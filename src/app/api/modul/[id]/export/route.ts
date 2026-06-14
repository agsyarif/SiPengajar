import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { buildModulDocx, MODUL_CSS } from "@/lib/export-docx";
import path from "path";
import fs from "fs/promises";

type Params = Promise<{ id: string }>;

export async function GET(req: NextRequest, { params }: { params: Params }) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const modul = await prisma.modul.findUnique({
    where: { id },
    include: {
      design: { select: { template: true } },
      user: { select: { schoolName: true } },
    },
  });

  if (!modul || modul.userId !== session.user.id) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }

  if (!modul.content) {
    return NextResponse.json(
      { message: "Konten modul belum tersedia." },
      { status: 400 },
    );
  }

  const format = req.nextUrl.searchParams.get("format") ?? "docx";

  if (format === "docx") {
    const buffer = await buildModulDocx(modul.content, {
      mapel: modul.mapel,
      jenjang: modul.jenjang,
      kelas: modul.kelas,
      topik: modul.topik,
      judul: modul.judul,
    });
    const filename = encodeURIComponent(
      `Modul_Ajar_${modul.mapel}_${modul.judul}`
        .replace(/\s+/g, "_")
        .replace(/[^a-zA-Z0-9_]/g, ""),
    );
    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": `attachment; filename="${filename}.docx"`,
      },
    });
  }

  if (format === "pdf") {
    const template = modul.design?.template ?? "formal";
    const schoolName = modul.user?.schoolName ?? "Nama Sekolah";

    const cssPath = path.join(process.cwd(), "src/styles/document-templates.css");
    const templateCss = await fs.readFile(cssPath, "utf-8");
    const year = new Date().getFullYear();
    const clean = modul.content.replace(/<style[\s\S]*?<\/style>/gi, "").trim();

    const html = `<!DOCTYPE html>
<html lang="id"><head>
<meta charset="UTF-8">
<style>
  @page {
    size: A4;
    margin: 20mm 18mm 20mm 25mm;
  }
  * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; box-sizing: border-box; }
  body { margin: 0; padding: 24pt 0; font-size: 10pt; }
  ${MODUL_CSS}
  ${templateCss}
  /* Re-apply template font with higher specificity to beat MODUL_CSS * rule */
  .doc-body.formal, .doc-body.formal * { font-family: "Times New Roman", Georgia, serif !important; }
  .doc-body.modern, .doc-body.modern * { font-family: "DM Sans", "Helvetica Neue", Arial, sans-serif !important; }
  h2.section-header { page-break-before: auto; }
  tr { page-break-inside: avoid; }
</style>
</head>
<body class="export-mode">
  <div class="paper-container">
    <div class="kop-sekolah ${template}">
      <div class="kop-school-name">${schoolName}</div>
      <div class="kop-address">sipengajar.id · ${modul.jenjang} — Kurikulum Merdeka © ${year}</div>
    </div>
    <div class="doc-body ${template}">
      <div class="modul-ajar">${clean}</div>
    </div>
  </div>
</body></html>`;

    let browser;
    try {
      const chromium = (await import("@sparticuz/chromium")).default;
      const puppeteer = (await import("puppeteer-core")).default;
      const localChrome = process.env.CHROME_PATH;
      const executablePath = localChrome ?? (await chromium.executablePath());
      const args = localChrome
        ? ["--no-sandbox", "--disable-setuid-sandbox"]
        : chromium.args;
      browser = await puppeteer.launch({
        args,
        executablePath,
        headless: true,
      });
      const page = await browser.newPage();
      await page.setContent(html, { waitUntil: "load" });
      const pdfBuffer = await page.pdf({
        format: "A4",
        printBackground: true,
        margin: { top: "20mm", bottom: "20mm", left: "25mm", right: "18mm" },
      });
      await browser.close();

      const filename = encodeURIComponent(
        `Modul_Ajar_${modul.mapel}_${modul.judul}`
          .replace(/\s+/g, "_")
          .replace(/[^a-zA-Z0-9_]/g, ""),
      );
      return new NextResponse(Buffer.from(pdfBuffer), {
        status: 200,
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename="${filename}.pdf"`,
        },
      });
    } catch (err) {
      await browser?.close().catch(() => {});
      console.error("[export/pdf]", err);
      return NextResponse.json(
        { message: "Gagal generate PDF. Pastikan CHROME_PATH di-set di .env.local." },
        { status: 500 },
      );
    }
  }

  return NextResponse.json(
    { message: `Format "${format}" belum didukung.` },
    { status: 400 },
  );
}
