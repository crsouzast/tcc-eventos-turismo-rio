/* Injeta no dashboard: aba "Referências" (bibliografia com links) e aba "Quadro de conferência". */
const fs = require('fs');
const C = require('./_ficha_conteudo.js');
const P = "./tcc-eventos-turismo-rio/index.html";
let h = fs.readFileSync(P, "utf8");

/* IDEMPOTENTE: remove abas e seções já injetadas antes de reinjetar */
h = h.replace(/\n    <button role="tab" aria-selected="false" data-p="p1[12]">[^<]*<\/button>/g, "");
const RE_SEC = /<!-- ============ 1[12]\. [^=]*============ -->[\s\S]*?<\/section>\n/;
while (RE_SEC.test(h)) h = h.replace(RE_SEC, "");
h = h.replace('    <button role="tab" aria-selected="false" data-p="p9">Entrevistas</button>',
              '    <button role="tab" aria-selected="false" data-p="p9">Entrevista e revista</button>');

const esc = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const linkify = s => esc(s).replace(/(https?:\/\/[^\s)]+?)(?=[.,;]?(\s|$))/g,
  '<a href="$1" target="_blank" rel="noopener">$1</a>');

/* ---- 1) bibliografia: percorre a seção 7 ---- */
let i7 = C.findIndex(n => n.t === "h1" && /^7\./.test(n.x));
let i8 = C.findIndex(n => n.t === "h1" && /^8\./.test(n.x));
const secao7 = C.slice(i7 + 1, i8 > 0 ? i8 : C.length);
let bib = "";
for (const n of secao7) {
  if (n.t === "h2") bib += '<h3>' + esc(n.x) + '</h3>\n';
  else if (n.t === "p") bib += '<p class="cap">' + esc(n.x) + '</p>\n';
  else if (n.t === "ref") bib += '<p class="refitem">' + linkify(n.x) + '</p>\n';
}

/* ---- 2) quadro de conferência ---- */
const q = C.find(n => n.t === "tabelaq");
let quadro = '<div class="tabela"><table class="q"><thead><tr>' +
  q.head.map(x => '<th>' + esc(x) + '</th>').join("") + '</tr></thead><tbody>';
for (const r of q.rows) {
  quadro += '<tr>' +
    '<td>' + esc(r[0]) + '</td>' +
    '<td class="fnt">' + linkify(r[1]).replace(/\n/g, "<br>") + '</td>' +
    '<td class="cit">' + esc(r[2]) + '</td>' +
    '</tr>';
}
quadro += '</tbody></table></div>';

/* ---- 3) CSS extra ---- */
if (!h.includes(".refitem{")) {
  h = h.replace("  @media(max-width:560px){",
`  .refitem{font-size:13px;color:var(--ink2);margin:0 0 11px;padding-left:18px;
    text-indent:-18px;line-height:1.6}
  .refitem a{word-break:break-all;font-size:12.5px}
  table.q{font-size:12.5px;min-width:900px}
  table.q td{vertical-align:top}
  table.q td.fnt{color:var(--ink2);font-size:11.5px}
  table.q td.fnt a{word-break:break-all}
  table.q td.cit{color:var(--ink);font-style:italic}
  @media(max-width:560px){`);
}

/* ---- 4) abas ---- */
h = h.replace('    <button role="tab" aria-selected="false" data-p="p9">Entrevista e revista</button>',
  '    <button role="tab" aria-selected="false" data-p="p9">Entrevistas</button>\n' +
  '    <button role="tab" aria-selected="false" data-p="p11">Referências</button>\n' +
  '    <button role="tab" aria-selected="false" data-p="p12">Quadro de conferência</button>');

/* ---- 5) seções ---- */
const secoes = `
<!-- ============ 11. REFERÊNCIAS ============ -->
<section class="page" id="p11"><div class="wrap">
  <h2>Referências bibliográficas</h2>
  <p class="lead">Bibliografia completa do projeto, com o endereço de cada documento para você abrir,
    ler e confirmar. Artigos científicos revisados por pares, trabalhos acadêmicos de repositórios
    institucionais, livros de jornalismo de revista e design editorial, dados oficiais de turismo e
    balanços de eventos. Tudo consultado e verificado em 16 de setembro de 2026.</p>
  <div class="card">
${bib}
  </div>
  <div class="card">
    <h3>Onde continuar pesquisando</h3>
    <div class="tabela">
      <table>
        <thead><tr><th>Biblioteca</th><th>Link</th><th>O que buscar</th></tr></thead>
        <tbody>
          <tr><td>SciELO Brasil</td><td><a href="https://search.scielo.org" target="_blank" rel="noopener">search.scielo.org</a></td><td><code>megaeventos AND hotelaria AND "Rio de Janeiro"</code></td></tr>
          <tr><td>Redalyc</td><td><a href="https://www.redalyc.org" target="_blank" rel="noopener">redalyc.org</a></td><td>Caderno Virtual de Turismo e revistas latino-americanas</td></tr>
          <tr><td>Revista Brasileira de Pesquisa em Turismo</td><td><a href="https://rbtur.org.br" target="_blank" rel="noopener">rbtur.org.br</a></td><td>principal revista da área no Brasil</td></tr>
          <tr><td>Repositório da UFF</td><td><a href="https://app.uff.br/riuff" target="_blank" rel="noopener">app.uff.br/riuff</a></td><td>TCCs e dissertações de Turismo da sua universidade</td></tr>
          <tr><td>BDTD / IBICT</td><td><a href="https://bdtd.ibict.br" target="_blank" rel="noopener">bdtd.ibict.br</a></td><td>teses e dissertações sobre turismo e eventos</td></tr>
          <tr><td>ANPTUR</td><td><a href="https://www.anptur.org.br" target="_blank" rel="noopener">anptur.org.br</a></td><td>anais de congressos de pesquisa em turismo</td></tr>
          <tr><td>Dados abertos do MTur</td><td><a href="https://dados.gov.br/dados/conjuntos-dados/estimativas-de-chegadas-de-turistas-internacionais-ao-brasil" target="_blank" rel="noopener">dados.gov.br</a></td><td>série de chegadas de turistas internacionais</td></tr>
          <tr><td>Google Acadêmico</td><td><a href="https://scholar.google.com.br" target="_blank" rel="noopener">scholar.google.com.br</a></td><td>mesma busca, com filtro "desde 2020"</td></tr>
        </tbody>
      </table>
    </div>
  </div>
</div></section>

<!-- ============ 12. QUADRO DE CONFERÊNCIA ============ -->
<section class="page" id="p12"><div class="wrap">
  <h2>Quadro de conferência</h2>
  <p class="lead">Cada afirmação da pesquisa, o endereço exato de onde ela saiu e a citação já formatada
    para colar no TCC. As aspas indicam transcrição literal da fonte; o texto sem aspas é paráfrase fiel.
    Use este quadro para conferir tudo antes de escrever — e para nunca citar um número sem fonte.</p>
  ${quadro}
  <p class="nota">Como citar no corpo do texto: artigos científicos por autor e ano — (RUSSO; FIGUEIRA, 2022).
    Órgãos públicos pela entidade e ano — (PREFEITURA DO RIO, 2024), (EMBRATUR, 2025). Dado do sindicato
    divulgado pela imprensa — (HotéisRIO apud PANROTAS, 2024), forma que preserva a distinção entre quem
    produziu o dado e quem o publicou.</p>
  <p class="nota">Duas ressalvas assinaladas: a página do Ministério do Turismo sobre o G20 estava com
    acesso restrito na data da consulta, e a página do Observatório Legislativo da Câmara sobre violência
    e turismo estava fora do ar. Onde a fonte é projeção divulgada antes do evento, a citação preserva o
    verbo no futuro ("deve movimentar", "irá movimentar").</p>
</div></section>

<!-- ============ 9. ENTREVISTA E REVISTA ============ -->`;

h = h.replace('<!-- ============ 9. ENTREVISTA E REVISTA ============ -->', secoes);
fs.writeFileSync(P, h, "utf8");
console.log("dashboard atualizado: refs", (bib.match(/refitem/g) || []).length, "| quadro", q.rows.length, "linhas");
