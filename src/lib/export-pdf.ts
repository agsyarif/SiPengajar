export interface PrintMeta {
  mapel: string;
  jenjang: string;
  kelas: string;
  topik: string;
}

function cssStr(s: string): string {
  return s.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

function buildPrintCSS(meta: PrintMeta): string {
  const year = new Date().getFullYear();
  const headerLeft = cssStr(
    `MODUL AJAR ${meta.mapel.toUpperCase()} | ${meta.jenjang.toUpperCase()} | KELAS ${meta.kelas}`,
  );
  const headerRight = cssStr(meta.topik);
  const footerLeft = cssStr(`${meta.jenjang} \u2014 Kurikulum Merdeka \u00A9 ${year}`);

  return `
    @page {
      size: A4;
      margin: 25mm 20mm 22mm 25mm;
      @top-left {
        content: "${headerLeft}";
        font-family: Arial, sans-serif;
        font-size: 8pt;
        color: #777777;
        vertical-align: bottom;
        padding-bottom: 5pt;
        border-bottom: 0.5pt solid #CCCCCC;
      }
      @top-right {
        content: "${headerRight}";
        font-family: Arial, sans-serif;
        font-size: 8pt;
        font-weight: bold;
        color: #0F6E56;
        vertical-align: bottom;
        padding-bottom: 5pt;
        border-bottom: 0.5pt solid #CCCCCC;
      }
      @bottom-left {
        content: "${footerLeft}";
        font-family: Arial, sans-serif;
        font-size: 8pt;
        color: #888888;
        vertical-align: top;
        padding-top: 5pt;
        border-top: 0.5pt solid #CCCCCC;
      }
      @bottom-right {
        content: "Halaman " counter(page);
        font-family: Arial, sans-serif;
        font-size: 8pt;
        color: #888888;
        vertical-align: top;
        padding-top: 5pt;
        border-top: 0.5pt solid #CCCCCC;
      }
    }

    * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; box-sizing: border-box; }
    body { font-family: Arial, sans-serif; font-size: 11pt; line-height: 1.5; color: #212121; margin: 0; padding: 0; }

    table.header-box { width: 100%; border-collapse: collapse; }
    table.header-box td { background-color: #1B5E80 !important; padding: 20px 24px; text-align: center; border: none !important; }
    p.header-label { color: #B3E5FC; font-size: 9pt; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; margin: 0 0 6px; }
    p.header-mapel { color: #fff; font-size: 22pt; font-weight: 700; margin: 0 0 6px; }
    p.header-topik { color: #FFD54F; font-size: 14pt; font-weight: 700; margin: 0 0 4px; }
    p.header-subtitle { color: #E1F5FE; font-size: 10pt; margin: 0; }

    table.summary-table { width: 100%; border-collapse: collapse; margin: 0 0 16px; }
    td.summary-cell { background-color: #E1F5FE !important; padding: 10px 14px; border: 1px solid #B3E5FC; text-align: center; width: 33.33%; }
    p.summary-label { color: #37474F; font-size: 9pt; margin: 0 0 3px; }
    p.summary-value { color: #1B5E80; font-size: 11pt; font-weight: 700; margin: 0; }

    h2.section-header { background-color: #1B5E80 !important; color: #fff !important; padding: 8px 14px; font-size: 11pt; font-weight: 700; margin: 20px 0 10px; letter-spacing: 0.5px; }
    h3.subsection-title { color: #0288D1; font-size: 11pt; font-weight: 700; margin: 14px 0 6px; }
    h4.meeting-header { background-color: #E3F2FD !important; color: #1B5E80; font-size: 11pt; font-weight: 700; padding: 7px 12px; margin: 16px 0 4px; border-left: 4px solid #0288D1; }

    table.data-table { width: 100%; border-collapse: collapse; margin: 6px 0 14px; }
    table.data-table td { border: 1px solid #B0BEC5; padding: 7px 10px; font-size: 11pt; vertical-align: top; }
    td.label-cell { background-color: #E1F5FE !important; color: #1B5E80; font-weight: 700; width: 32%; }

    table.activity-table { width: 100%; border-collapse: collapse; margin: 6px 0 8px; }
    table.activity-table th { background-color: #1B5E80 !important; color: #fff; padding: 8px 10px; font-weight: 700; text-align: center; font-size: 10pt; border: 1px solid #0D47A1; }
    table.activity-table td { border: 1px solid #B0BEC5; padding: 7px 10px; font-size: 11pt; vertical-align: top; }
    td.phase-cell { background-color: #E1F5FE !important; color: #1B5E80; font-weight: 700; text-align: center; width: 14%; }
    td.time-cell { background-color: #ECEFF1 !important; color: #37474F; text-align: center; font-weight: 700; width: 11%; }

    p.meeting-goal { font-size: 10.5pt; margin: 4px 0 6px; }
    p.assessment-note { background-color: #E8F5E9 !important; padding: 7px 12px; margin: 4px 0 16px; font-size: 10.5pt; border-left: 3px solid #4CAF50; }

    p { font-size: 11pt; margin: 3px 0; }
    ul, ol { padding-left: 22px; margin: 4px 0 8px; }
    ul li { list-style-type: disc; font-size: 11pt; margin-bottom: 3px; }
    ol li { list-style-type: decimal; font-size: 11pt; margin-bottom: 3px; }
    table { width: 100%; border-collapse: collapse; margin: 6px 0; }
    strong, b { font-weight: 700; }
    em, i { font-style: italic; }
    u { text-decoration: underline; }

    h2.section-header { page-break-before: auto; break-before: auto; }
    table { page-break-inside: auto; break-inside: auto; }
    tr { page-break-inside: avoid; break-inside: avoid; }
  `;
}

function buildPrintHTML(content: string, title: string, meta: PrintMeta): string {
  const clean = content.replace(/<style[\s\S]*?<\/style>/gi, "").trim();
  return `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <title>${title}</title>
  <style>${buildPrintCSS(meta)}</style>
</head>
<body>${clean}</body>
<script>
  window.addEventListener('load', function() {
    setTimeout(function() { window.print(); }, 300);
  });
</script>
</html>`;
}

export function printAsPDF(content: string, title: string, meta: PrintMeta): void {
  const html = buildPrintHTML(content, title, meta);
  const iframe = document.createElement("iframe");
  iframe.style.cssText =
    "position:fixed;top:-9999px;left:-9999px;width:1px;height:1px;border:none;";
  document.body.appendChild(iframe);
  const doc = iframe.contentDocument ?? iframe.contentWindow?.document;
  if (!doc) return;
  doc.open();
  doc.write(html);
  doc.close();
  iframe.onload = () => {
    setTimeout(() => {
      iframe.contentWindow?.print();
      setTimeout(() => document.body.removeChild(iframe), 2000);
    }, 200);
  };
}
