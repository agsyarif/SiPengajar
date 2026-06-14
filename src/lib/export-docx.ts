import HTMLtoDOCX from "html-to-docx";
import JSZip from "jszip";

// ── Content width in twips ────────────────────────────────
// A4 page 12240 twips - left margin 1728 - right margin 1440 = 9072
const CONTENT_WIDTH = 9072;
const COL_LEFT = 5800;
const COL_RIGHT = CONTENT_WIDTH - COL_LEFT; // 3272

export interface ModulMeta {
  mapel: string;
  jenjang: string;
  kelas: string;
  topik: string;
  judul: string;
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function buildHeaderXml(meta: ModulMeta): string {
  const left = escapeXml(
    `MODUL AJAR ${meta.mapel.toUpperCase()} | ${meta.jenjang.toUpperCase()} | KELAS ${meta.kelas}`,
  );
  const right = escapeXml(meta.topik);

  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:hdr xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"
       xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
  <w:tbl>
    <w:tblPr>
      <w:tblW w:w="${CONTENT_WIDTH}" w:type="dxa"/>
      <w:tblBorders>
        <w:top    w:val="none" w:sz="0" w:space="0" w:color="auto"/>
        <w:left   w:val="none" w:sz="0" w:space="0" w:color="auto"/>
        <w:bottom w:val="single" w:sz="6" w:space="0" w:color="CCCCCC"/>
        <w:right  w:val="none" w:sz="0" w:space="0" w:color="auto"/>
        <w:insideH w:val="none" w:sz="0" w:space="0" w:color="auto"/>
        <w:insideV w:val="none" w:sz="0" w:space="0" w:color="auto"/>
      </w:tblBorders>
      <w:tblCellMar>
        <w:top    w:w="0"   w:type="dxa"/>
        <w:left   w:w="0"   w:type="dxa"/>
        <w:bottom w:w="80"  w:type="dxa"/>
        <w:right  w:w="0"   w:type="dxa"/>
      </w:tblCellMar>
    </w:tblPr>
    <w:tblGrid>
      <w:gridCol w:w="${COL_LEFT}"/>
      <w:gridCol w:w="${COL_RIGHT}"/>
    </w:tblGrid>
    <w:tr>
      <w:tc>
        <w:tcPr>
          <w:tcW w:w="${COL_LEFT}" w:type="dxa"/>
          <w:tcBorders>
            <w:top w:val="none"/><w:left w:val="none"/>
            <w:bottom w:val="none"/><w:right w:val="none"/>
          </w:tcBorders>
        </w:tcPr>
        <w:p>
          <w:pPr><w:jc w:val="left"/><w:spacing w:before="0" w:after="0"/></w:pPr>
          <w:r>
            <w:rPr>
              <w:rFonts w:ascii="Arial" w:hAnsi="Arial"/>
              <w:sz w:val="16"/>
              <w:color w:val="777777"/>
            </w:rPr>
            <w:t>${left}</w:t>
          </w:r>
        </w:p>
      </w:tc>
      <w:tc>
        <w:tcPr>
          <w:tcW w:w="${COL_RIGHT}" w:type="dxa"/>
          <w:tcBorders>
            <w:top w:val="none"/><w:left w:val="none"/>
            <w:bottom w:val="none"/><w:right w:val="none"/>
          </w:tcBorders>
        </w:tcPr>
        <w:p>
          <w:pPr><w:jc w:val="right"/><w:spacing w:before="0" w:after="0"/></w:pPr>
          <w:r>
            <w:rPr>
              <w:rFonts w:ascii="Arial" w:hAnsi="Arial"/>
              <w:sz w:val="16"/>
              <w:b/>
              <w:color w:val="0F6E56"/>
            </w:rPr>
            <w:t>${right}</w:t>
          </w:r>
        </w:p>
      </w:tc>
    </w:tr>
  </w:tbl>
</w:hdr>`;
}

function buildFooterXml(meta: ModulMeta): string {
  const year = new Date().getFullYear();
  const left = escapeXml(`${meta.jenjang} — Kurikulum Merdeka \u00A9 ${year}`);

  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:ftr xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"
       xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
  <w:tbl>
    <w:tblPr>
      <w:tblW w:w="${CONTENT_WIDTH}" w:type="dxa"/>
      <w:tblBorders>
        <w:top    w:val="single" w:sz="6" w:space="0" w:color="CCCCCC"/>
        <w:left   w:val="none" w:sz="0" w:space="0" w:color="auto"/>
        <w:bottom w:val="none" w:sz="0" w:space="0" w:color="auto"/>
        <w:right  w:val="none" w:sz="0" w:space="0" w:color="auto"/>
        <w:insideH w:val="none" w:sz="0" w:space="0" w:color="auto"/>
        <w:insideV w:val="none" w:sz="0" w:space="0" w:color="auto"/>
      </w:tblBorders>
      <w:tblCellMar>
        <w:top    w:w="80"  w:type="dxa"/>
        <w:left   w:w="0"   w:type="dxa"/>
        <w:bottom w:w="0"   w:type="dxa"/>
        <w:right  w:w="0"   w:type="dxa"/>
      </w:tblCellMar>
    </w:tblPr>
    <w:tblGrid>
      <w:gridCol w:w="${COL_LEFT}"/>
      <w:gridCol w:w="${COL_RIGHT}"/>
    </w:tblGrid>
    <w:tr>
      <w:tc>
        <w:tcPr>
          <w:tcW w:w="${COL_LEFT}" w:type="dxa"/>
          <w:tcBorders>
            <w:top w:val="none"/><w:left w:val="none"/>
            <w:bottom w:val="none"/><w:right w:val="none"/>
          </w:tcBorders>
        </w:tcPr>
        <w:p>
          <w:pPr><w:jc w:val="left"/><w:spacing w:before="0" w:after="0"/></w:pPr>
          <w:r>
            <w:rPr>
              <w:rFonts w:ascii="Arial" w:hAnsi="Arial"/>
              <w:sz w:val="16"/>
              <w:color w:val="888888"/>
            </w:rPr>
            <w:t>${left}</w:t>
          </w:r>
        </w:p>
      </w:tc>
      <w:tc>
        <w:tcPr>
          <w:tcW w:w="${COL_RIGHT}" w:type="dxa"/>
          <w:tcBorders>
            <w:top w:val="none"/><w:left w:val="none"/>
            <w:bottom w:val="none"/><w:right w:val="none"/>
          </w:tcBorders>
        </w:tcPr>
        <w:p>
          <w:pPr><w:jc w:val="right"/><w:spacing w:before="0" w:after="0"/></w:pPr>
          <w:r>
            <w:rPr>
              <w:rFonts w:ascii="Arial" w:hAnsi="Arial"/>
              <w:sz w:val="16"/>
              <w:color w:val="888888"/>
            </w:rPr>
            <w:t xml:space="preserve">Halaman </w:t>
          </w:r>
          <w:fldSimple w:instr=" PAGE ">
            <w:r>
              <w:rPr>
                <w:rFonts w:ascii="Arial" w:hAnsi="Arial"/>
                <w:sz w:val="16"/>
                <w:color w:val="888888"/>
              </w:rPr>
              <w:t>1</w:t>
            </w:r>
          </w:fldSimple>
        </w:p>
      </w:tc>
    </w:tr>
  </w:tbl>
</w:ftr>`;
}

async function injectHeaderFooter(
  docxBuffer: ArrayBuffer,
  meta: ModulMeta,
): Promise<Buffer> {
  const zip = await JSZip.loadAsync(docxBuffer);

  // 1. Add header1.xml and footer1.xml
  zip.file("word/header1.xml", buildHeaderXml(meta));
  zip.file("word/footer1.xml", buildFooterXml(meta));

  // 2. Patch [Content_Types].xml
  const ctFile = zip.file("[Content_Types].xml");
  if (ctFile) {
    const ct = await ctFile.async("string");
    const ctPatched = ct.replace(
      "</Types>",
      `<Override PartName="/word/header1.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.header+xml"/>
<Override PartName="/word/footer1.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.footer+xml"/>
</Types>`,
    );
    zip.file("[Content_Types].xml", ctPatched);
  }

  // 3. Patch word/_rels/document.xml.rels
  const relsFile = zip.file("word/_rels/document.xml.rels");
  if (relsFile) {
    const rels = await relsFile.async("string");
    const relsPatched = rels.replace(
      "</Relationships>",
      `<Relationship Id="rIdHdr1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/header" Target="header1.xml"/>
<Relationship Id="rIdFtr1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/footer" Target="footer1.xml"/>
</Relationships>`,
    );
    zip.file("word/_rels/document.xml.rels", relsPatched);
  }

  // 4. Patch word/document.xml — inject header/footer refs before last </w:sectPr>
  const docFile = zip.file("word/document.xml");
  if (docFile) {
    let doc = await docFile.async("string");
    const sectPrClose = "</w:sectPr>";
    const lastIdx = doc.lastIndexOf(sectPrClose);
    if (lastIdx !== -1) {
      const refs = `<w:headerReference w:type="default" r:Id="rIdHdr1"/><w:footerReference w:type="default" r:Id="rIdFtr1"/>`;
      doc = doc.slice(0, lastIdx) + refs + doc.slice(lastIdx);
    }
    zip.file("word/document.xml", doc);
  }

  const out = await zip.generateAsync({ type: "arraybuffer" });
  return Buffer.from(out);
}

// ── CSS injected into the HTML body ──────────────────────
export const MODUL_CSS = `
  * { font-family: Arial, sans-serif; box-sizing: border-box; }
  body { font-size: 11pt; line-height: 1.5; color: #212121; margin: 0; padding: 0; }

  /* ── Header box ── */
  table.header-box { width: 100%; border-collapse: collapse; margin-bottom: 0; border: none; }
  table.header-box td {
    background-color: #1B5E80;
    padding: 20px 24px;
    text-align: center;
    border: none;
  }
  p.header-label {
    color: #B3E5FC; font-size: 9pt; font-weight: bold;
    letter-spacing: 3px; text-transform: uppercase; margin: 0 0 6px 0;
  }
  p.header-mapel {
    color: #FFFFFF; font-size: 22pt; font-weight: bold;
    letter-spacing: 1px; margin: 0 0 6px 0;
  }
  p.header-topik {
    color: #FFD54F; font-size: 14pt; font-weight: bold; margin: 0 0 4px 0;
  }
  p.header-subtitle { color: #E1F5FE; font-size: 10pt; margin: 0; }

  /* ── Summary info row ── */
  table.summary-table { width: 100%; border-collapse: collapse; margin: 0 0 20px 0; }
  td.summary-cell {
    background-color: #E1F5FE;
    padding: 10px 14px;
    border: 1px solid #B3E5FC;
    text-align: center;
    width: 33.33%;
  }
  p.summary-label { color: #37474F; font-size: 9pt; margin: 0 0 3px 0; }
  p.summary-value { color: #1B5E80; font-size: 11pt; font-weight: bold; margin: 0; }

  /* ── Main section headers (A, B) ── */
  h2.section-header {
    background-color: #1B5E80;
    color: #FFFFFF;
    padding: 8px 14px;
    font-size: 11pt;
    font-weight: bold;
    margin: 24px 0 10px 0;
    letter-spacing: 0.5px;
  }

  /* ── Subsection titles (1, 2, 3...) ── */
  h3.subsection-title {
    color: #0288D1;
    font-size: 11pt;
    font-weight: bold;
    margin: 14px 0 6px 0;
    padding: 0;
  }

  /* ── Per-meeting headers ── */
  h4.meeting-header {
    background-color: #E3F2FD;
    color: #1B5E80;
    font-size: 11pt;
    font-weight: bold;
    padding: 7px 12px;
    margin: 16px 0 4px 0;
    border-left: 4px solid #0288D1;
  }

  /* ── Data tables (identitas, PPP, asesmen, dll.) ── */
  table.data-table { width: 100%; border-collapse: collapse; margin: 6px 0 14px 0; }
  table.data-table td {
    border: 1px solid #B0BEC5;
    padding: 7px 10px;
    font-size: 11pt;
    vertical-align: top;
  }
  td.label-cell {
    background-color: #E1F5FE;
    color: #1B5E80;
    font-weight: bold;
    width: 32%;
  }

  /* ── Activity / kegiatan tables ── */
  table.activity-table { width: 100%; border-collapse: collapse; margin: 6px 0 8px 0; }
  table.activity-table th {
    background-color: #1B5E80;
    color: #FFFFFF;
    padding: 8px 10px;
    font-weight: bold;
    text-align: center;
    font-size: 10pt;
    border: 1px solid #0D47A1;
  }
  table.activity-table td {
    border: 1px solid #B0BEC5;
    padding: 7px 10px;
    font-size: 11pt;
    vertical-align: top;
  }
  td.phase-cell {
    background-color: #E1F5FE;
    color: #1B5E80;
    font-weight: bold;
    text-align: center;
    width: 14%;
  }
  td.time-cell {
    background-color: #ECEFF1;
    color: #37474F;
    text-align: center;
    font-weight: bold;
    width: 11%;
  }

  /* ── Assessment note ── */
  p.meeting-goal { font-size: 10.5pt; margin: 4px 0 6px 0; }
  p.assessment-note {
    background-color: #E8F5E9;
    padding: 7px 12px;
    margin: 4px 0 16px 0;
    font-size: 10.5pt;
    border-left: 3px solid #4CAF50;
  }

  /* ── General ── */
  p { font-size: 11pt; margin: 3px 0; }
  ul, ol { margin: 4px 0 8px 20px; padding: 0; }
  li { font-size: 11pt; margin: 2px 0; }
  strong, b { font-weight: bold; }
  em, i { font-style: italic; }
  u { text-decoration: underline; }
  h1, h2, h3, h4 { font-family: Arial, sans-serif; }
`;

export async function buildModulDocx(
  content: string,
  meta: ModulMeta,
): Promise<Buffer> {
  const cleaned = content.replace(/<style[\s\S]*?<\/style>/gi, "").trim();

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>${MODUL_CSS}</style>
</head>
<body>
${cleaned}
</body>
</html>`;

  const docxBuffer = await HTMLtoDOCX(html, null, {
    pageSize: { width: 12240, height: 15840 },
    margins: {
      top: 1440,
      bottom: 1440,
      left: 1728,
      right: 1440,
      header: 720,
      footer: 720,
    },
    font: "Arial",
    fontSize: 22,
    lineHeight: 360,
    table: { row: { cantSplit: false } },
    header: false,
    footer: false,
  });

  return injectHeaderFooter(docxBuffer as ArrayBuffer, meta);
}
