/* Gera FICHA-DO-PROJETO.docx e FICHA-DO-PROJETO.md a partir de _ficha_conteudo.js */
const d = require('docx');
const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, Table, TableRow,
  TableCell, WidthType, ShadingType, BorderStyle, LevelFormat, PageBreak, ExternalHyperlink } = d;
const fs = require('fs');
const C = require('./_ficha_conteudo.js');

const AZUL = "123A6B", CINZA = "4A5058", CORAL = "C8452F", AREIA = "8A6D1F";
const TW = 9360;
const F = "Calibri";

function run(t, o = {}) {
  return new TextRun({ text: t, bold: o.b, italics: o.i, size: o.s || 22,
    color: o.c || "1A1A1A", font: F });
}
function P(text, o = {}) {
  return new Paragraph({
    alignment: o.align || AlignmentType.JUSTIFIED,
    spacing: { after: o.after == null ? 140 : o.after, line: o.line || 300, before: o.before || 0 },
    border: o.border,
    shading: o.fill ? { type: ShadingType.CLEAR, fill: o.fill, color: "auto" } : undefined,
    indent: o.indent,
    children: [run(text, o)]
  });
}
function H(text, lvl) {
  const size = lvl === 3 ? 22 : lvl === 2 ? 24 : 28;
  return new Paragraph({
    heading: lvl === 3 ? HeadingLevel.HEADING_3 : lvl === 2 ? HeadingLevel.HEADING_2 : HeadingLevel.HEADING_1,
    spacing: { before: lvl === 1 ? 360 : 300, after: 160 },
    children: [run(text, { b: true, s: size, c: AZUL })]
  });
}
function campo(rot, val) {
  return new Paragraph({
    alignment: AlignmentType.JUSTIFIED, spacing: { after: 150, line: 300 },
    children: [run(rot + ": ", { b: true, c: AZUL }), run(val)]
  });
}
function linkPar(url, nome) {
  return new Paragraph({
    alignment: AlignmentType.LEFT, spacing: { after: 130, line: 270 },
    indent: { left: 240 },
    children: [
      run("→ " + (nome || url) + " ", { s: 18, c: CINZA }),
      new ExternalHyperlink({ link: url, children: [
        new TextRun({ text: url, size: 17, color: "1155CC", underline: {}, font: F })] })
    ]
  });
}
function quote(text, fonte) {
  const kids = [run("“" + text + "”", { i: true, s: 21, c: AZUL })];
  if (fonte) kids.push(run("  (" + fonte + ")", { s: 17, c: CINZA }));
  return new Paragraph({
    alignment: AlignmentType.JUSTIFIED,
    spacing: { after: 150, line: 290, before: 60 },
    indent: { left: 380, right: 200 },
    border: { left: { style: BorderStyle.SINGLE, size: 12, color: CORAL, space: 10 } },
    children: kids
  });
}
function cell(text, o = {}) {
  const paras = String(text).split("\n").map((ln, k) => new Paragraph({
    alignment: o.align || AlignmentType.LEFT,
    spacing: { after: k === String(text).split("\n").length - 1 ? 0 : 60, line: 250 },
    children: [run(ln, { b: o.bold, s: o.size || 17, c: o.color || "1A1A1A" })]
  }));
  return new TableCell({
    width: { size: o.w, type: WidthType.DXA },
    shading: o.fill ? { type: ShadingType.CLEAR, fill: o.fill, color: "auto" } : undefined,
    margins: { top: 80, bottom: 80, left: 110, right: 110 },
    children: paras
  });
}
function tabela(cols, head, rows, size) {
  return new Table({
    columnWidths: cols,
    width: { size: TW, type: WidthType.DXA },
    rows: [
      new TableRow({ tableHeader: true,
        children: head.map((x, i) => cell(x, { w: cols[i], bold: true, fill: AZUL, color: "FFFFFF", size: size || 17 })) }),
      ...rows.map((r, ri) => new TableRow({
        children: r.map((x, i) => cell(x, { w: cols[i], fill: ri % 2 ? "F2F4F7" : undefined, size: size || 17 })) }))
    ]
  });
}
const REGUA = new Paragraph({
  spacing: { after: 200, before: 120 },
  border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: "C9C2B4", space: 1 } },
  children: [run("")]
});

const kids = [];
for (const n of C) {
  switch (n.t) {
    case "capa":
      kids.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 60 },
        children: [run("DIRETRIZES DA PESQUISA", { b: true, s: 32, c: AZUL })] }));
      kids.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 40 },
        children: [run("Ficha do projeto · Trabalho de Conclusão de Curso", { s: 22, c: CINZA })] }));
      kids.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 30 },
        children: [run("Cristiana da Silva Souza Teixeira", { b: true, s: 24 })] }));
      kids.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 300 },
        children: [run("Fontes consultadas e verificadas em 16 de setembro de 2026", { s: 17, c: CINZA })] }));
      kids.push(REGUA);
      break;
    case "h1": kids.push(H(n.x, 1)); break;
    case "h2": kids.push(H(n.x, 2)); break;
    case "h3": kids.push(H(n.x, 3)); break;
    case "p": kids.push(P(n.x)); break;
    case "campo": kids.push(campo(n.r, n.x)); break;
    case "link": kids.push(linkPar(n.x, n.nome)); break;
    case "quote": kids.push(quote(n.x, n.fonte)); break;
    case "li": kids.push(new Paragraph({ numbering: { reference: "bul", level: 0 },
      spacing: { after: 110, line: 295 }, children: [run(n.x)] })); break;
    case "tabela": kids.push(tabela(n.cols, n.head, n.rows)); kids.push(P("", { after: 120 })); break;
    case "tabelaq": kids.push(tabela(n.cols, n.head, n.rows, 15)); kids.push(P("", { after: 120 })); break;
    case "fonte": kids.push(P(n.x, { s: 17, c: CINZA, after: 200 })); break;
    case "obs": kids.push(P(n.x, { s: 19, c: AREIA, after: 200, indent: { left: 200 } })); break;
    case "nota": kids.push(P(n.x, { s: 18, c: CINZA, after: 200 })); break;
    case "aviso": kids.push(P(n.x, { s: 19, b: false, c: "1A1A1A", fill: "EEF3FA", after: 220 })); break;
    case "ref": kids.push(P(n.x, { s: 18, after: 130, indent: { left: 200, hanging: 200 } })); break;
    case "quebra": kids.push(new Paragraph({ children: [new PageBreak()] })); break;
    case "regua": kids.push(REGUA); break;
    case "fecho": kids.push(P(n.x, { s: 17, c: CINZA, align: AlignmentType.CENTER, after: 0 })); break;
    default: throw new Error("no desconhecido: " + n.t);
  }
}

const doc = new Document({
  creator: "Cristiana da Silva Souza Teixeira",
  title: "Ficha do Projeto - TCC - Eventos e turismo no Rio de Janeiro 2018-2025",
  numbering: { config: [{ reference: "bul", levels: [{ level: 0, format: LevelFormat.BULLET,
    text: "•", alignment: AlignmentType.LEFT,
    style: { paragraph: { indent: { left: 420, hanging: 210 } } } }] }] },
  sections: [{ properties: { page: { margin: { top: 1440, bottom: 1440, left: 1440, right: 1440 } } },
    children: kids }]
});

Packer.toBuffer(doc).then(b => {
  fs.writeFileSync(process.argv[2], b);
  console.log("DOCX ok:", b.length, "bytes");
});

/* ---------------- Markdown ---------------- */
let md = "";
for (const n of C) {
  switch (n.t) {
    case "capa":
      md += "# DIRETRIZES DA PESQUISA\n\n**Ficha do projeto · Trabalho de Conclusão de Curso**\n\n" +
        "**Cristiana da Silva Souza Teixeira**\n\nFontes consultadas e verificadas em 16 de setembro de 2026.\n\n---\n\n";
      break;
    case "h1": md += "\n## " + n.x + "\n\n"; break;
    case "h2": md += "\n### " + n.x + "\n\n"; break;
    case "h3": md += "\n#### " + n.x + "\n\n"; break;
    case "p": md += n.x + "\n\n"; break;
    case "campo": md += "**" + n.r + ":** " + n.x + "\n\n"; break;
    case "link": md += "> 🔗 [" + (n.nome || n.x).replace(/[\[\]]/g, "") + "](" + n.x + ")\n\n"; break;
    case "quote": md += "> " + n.x + (n.fonte ? "\n>\n> — " + n.fonte : "") + "\n\n"; break;
    case "li": md += "- " + n.x + "\n"; break;
    case "tabela": case "tabelaq":
      md += "\n| " + n.head.join(" | ") + " |\n|" + n.head.map(() => "---").join("|") + "|\n";
      for (const r of n.rows) md += "| " + r.map(c => String(c).replace(/\n/g, "<br>")).join(" | ") + " |\n";
      md += "\n";
      break;
    case "fonte": md += "_" + n.x + "_\n\n"; break;
    case "obs": md += "> **Nota:** " + n.x + "\n\n"; break;
    case "nota": md += "_" + n.x + "_\n\n"; break;
    case "aviso": md += "> ⚠️ **" + n.x + "**\n\n"; break;
    case "ref": md += "- " + n.x + "\n"; break;
    case "quebra": md += "\n---\n\n"; break;
    case "regua": md += "\n---\n\n"; break;
    case "fecho": md += "_" + n.x + "_\n"; break;
  }
}
fs.writeFileSync(process.argv[3], md, "utf8");
console.log("MD ok:", md.length, "chars");
