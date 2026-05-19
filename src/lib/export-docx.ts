import HTMLtoDOCX from "html-to-docx";

const MODUL_CSS = `
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

export async function buildModulDocx(content: string): Promise<Buffer> {
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
    pageSize: { width: 12240, height: 15840 },  // A4 in twips (215.9mm × 279.4mm ≈ US Letter, but close enough for A4)
    margins: {
      top: 1440,    // 25mm
      bottom: 1440, // 25mm
      left: 1728,   // 30mm
      right: 1440,  // 25mm
    },
    font: "Times New Roman",
    fontSize: 24,  // 12pt in half-points
    lineHeight: 360,
    table: { row: { cantSplit: false } },
  });

  return Buffer.from(docxBuffer as ArrayBuffer);
}
