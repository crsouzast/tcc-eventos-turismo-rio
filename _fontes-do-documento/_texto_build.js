/* Converte TEXTO-CORRIDO.md em TEXTO-CORRIDO.docx (layout de matéria de revista). */
const d = require('docx');
const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, Table, TableRow,
  TableCell, WidthType, ShadingType, BorderStyle, ExternalHyperlink } = d;
const fs = require('fs');

const AZUL = "123A6B", CINZA = "4A5058";
const TW = 9360, F = "Georgia", FS = "Calibri";
const md = fs.readFileSync(process.argv[2], "utf8").split("\n");

/* converte **negrito**, *itálico* e URLs em runs */
function runs(t, o = {}) {
  const out = [];
  const re = /(\*\*[^*]+\*\*|\*[^*]+\*|https?:\/\/[^\s)]+)/g;
  let last = 0, m;
  const push = (txt, extra) => { if (txt) out.push(new TextRun(Object.assign(
    { text: txt, size: o.size || 22, color: o.color || "1A1A1A", font: o.font || F }, extra))); };
  while ((m = re.exec(t))) {
    push(t.slice(last, m.index));
    const tok = m[0];
    if (tok.startsWith("**")) push(tok.slice(2, -2), { bold: true });
    else if (tok.startsWith("*")) push(tok.slice(1, -1), { italics: true });
    else out.push(new ExternalHyperlink({ link: tok, children: [new TextRun({
      text: tok, size: (o.size || 22) - 4, color: "1155CC", underline: {}, font: FS })] }));
    last = m.index + tok.length;
  }
  push(t.slice(last));
  return out.length ? out : [new TextRun({ text: "", font: F })];
}

const kids = [];
let i = 0;
while (i < md.length) {
  const ln = md[i];
  const t = ln.trim();

  if (!t) { i++; continue; }

  if (t.startsWith("| ")) {                       /* tabela markdown */
    const rows = [];
    while (i < md.length && md[i].trim().startsWith("|")) {
      const cells = md[i].trim().replace(/^\||\|$/g, "").split("|").map(c => c.trim());
      if (!/^-+$/.test(cells[0].replace(/[\s|:-]/g, "") || "x") || !cells.every(c => /^:?-+:?$/.test(c)))
        rows.push(cells);
      i++;
    }
    const n = rows[0].length, cw = Math.floor(TW / n);
    kids.push(new Table({
      columnWidths: Array(n).fill(cw), width: { size: TW, type: WidthType.DXA },
      rows: rows.map((r, ri) => new TableRow({
        tableHeader: ri === 0,
        children: r.map(c => new TableCell({
          width: { size: cw, type: WidthType.DXA },
          shading: ri === 0 ? { type: ShadingType.CLEAR, fill: AZUL, color: "auto" }
            : (ri % 2 ? { type: ShadingType.CLEAR, fill: "F2F4F7", color: "auto" } : undefined),
          margins: { top: 70, bottom: 70, left: 100, right: 100 },
          children: [new Paragraph({ spacing: { after: 0, line: 250 },
            children: runs(c, { size: 17, color: ri === 0 ? "FFFFFF" : "1A1A1A", font: FS }) })]
        }))
      }))
    }));
    kids.push(new Paragraph({ spacing: { after: 160 }, children: [new TextRun({ text: "" })] }));
    continue;
  }

  if (t === "---") {
    kids.push(new Paragraph({ spacing: { after: 200, before: 160 },
      border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: "C9C2B4", space: 1 } },
      children: [new TextRun({ text: "" })] }));
    i++; continue;
  }

  if (t.startsWith("### ")) {                     /* linha fina */
    kids.push(new Paragraph({ alignment: AlignmentType.LEFT, spacing: { after: 240, line: 320 },
      children: runs(t.slice(4), { size: 26, color: CINZA }).map(r => { r.root && 0; return r; }) }));
    i++; continue;
  }
  if (t.startsWith("## ")) {
    kids.push(new Paragraph({ heading: HeadingLevel.HEADING_2, spacing: { before: 400, after: 180 },
      children: [new TextRun({ text: t.slice(3), bold: true, size: 28, color: AZUL, font: F })] }));
    i++; continue;
  }
  if (t.startsWith("# ")) {
    kids.push(new Paragraph({ heading: HeadingLevel.HEADING_1, spacing: { after: 160 },
      children: [new TextRun({ text: t.slice(2), bold: true, size: 44, color: "1A1A1A", font: F })] }));
    i++; continue;
  }
  if (t.startsWith("*") && t.endsWith("*") && !t.startsWith("**")) {   /* legenda/itálico isolado */
    kids.push(new Paragraph({ alignment: AlignmentType.JUSTIFIED, spacing: { after: 200, line: 270 },
      children: [new TextRun({ text: t.slice(1, -1), italics: true, size: 17, color: CINZA, font: FS })] }));
    i++; continue;
  }
  kids.push(new Paragraph({ alignment: AlignmentType.JUSTIFIED,
    spacing: { after: 170, line: 320 }, children: runs(t) }));
  i++;
}

const doc = new Document({
  creator: "Cristiana da Silva Souza Teixeira",
  title: "A cidade que aprendeu a viver de eventos",
  sections: [{ properties: { page: { margin: { top: 1440, bottom: 1440, left: 1560, right: 1560 } } },
    children: kids }]
});
Packer.toBuffer(doc).then(b => { fs.writeFileSync(process.argv[3], b);
  console.log("DOCX ok:", b.length, "bytes,", kids.length, "blocos"); });
