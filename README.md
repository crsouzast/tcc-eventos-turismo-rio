# Principais eventos que fomentaram o turismo no Rio de Janeiro (2018–2025)

**Dashboard de pesquisa + revista** para o Trabalho de Conclusão de Curso de
**Cristiana da Silva Souza Teixeira**.

> **TÍTULO:** Principais eventos que fomentaram o turismo no Rio de Janeiro entre os anos de 2018 a 2025:
> uma análise da ocupação hoteleira e dos impactos na cidade.

## Abra aqui

| O quê | Arquivo |
|---|---|
| **Dashboard** (10 abas: série, eventos, cruzamento, regiões, metodologia, fontes) | [`index.html`](index.html) |
| **Revista** — 6 páginas, pronta para virar PDF com Ctrl+P | [`revista/revista.html`](revista/revista.html) |
| **Pasta de fontes** — 15 fichas com ABNT, link, resumo e citações | [`fontes/00-INDICE-DE-FONTES.md`](fontes/00-INDICE-DE-FONTES.md) |
| **Dados brutos** em CSV | [`dados/`](dados/) |
| **Diretrizes da Pesquisa** — a ficha do projeto, com o que já está atendido | [`DIRETRIZES-DA-PESQUISA.md`](DIRETRIZES-DA-PESQUISA.md) |

---

## O que este repositório resolve

As Diretrizes da Pesquisa definem a metodologia assim: identificar os períodos de maior ocupação
hoteleira, verificar se neles houve eventos turísticos relevantes e relacionar os dois. Este
repositório executa exatamente isso e deixa o material pronto para ser escrito:

1. **A série completa** de ocupação hoteleira da cidade do Rio, mensal, por região, de janeiro de 2018
   a dezembro de 2025 — extraída da Pesquisa de Ocupação Hoteleira HotéisRIO/ABIH-RJ consolidada no
   [Observatório da Hotelaria do Rio de Janeiro](https://sindhoteisrj.com.br/observatorio-da-hotelaria-do-rio-de-janeiro).
2. **Dezoito eventos documentados** no período, cada um com público, ocupação, impacto econômico e
   fonte oficial arquivada.
3. **O cruzamento** entre picos de ocupação e calendário de eventos, com os limites do método declarados.
4. **A revista**, produto final do TCC, já redigida e diagramada em 6 páginas.

### O achado principal

| Ano | Ocupação média da cidade | O que aconteceu |
|---|---|---|
| 2018 | 53,66% | ano-base, rescaldo pós-Olimpíadas |
| 2019 | 64,55% | Copa América, Rock in Rio |
| **2020** | **44,06%** | pandemia; julho marca 19,78%, pior mês da série |
| 2021 | 48,73% | Carnaval e Réveillon cancelados |
| 2022 | 65,00% | Rock in Rio faz setembro superar janeiro |
| 2023 | 71,11% | Web Summit, Taylor Swift, Libertadores |
| 2024 | 73,15% | Madonna, Rock in Rio 40 anos, G20 |
| **2025** | **77,73%** | **recorde da série**; Carnaval a 98,62% |

Os eventos de grande porte aparecem, sem exceção, nos meses de maior ocupação — inclusive em meses que
a sazonalidade condenaria ao vazio, como maio e setembro. **A hipótese do projeto se sustenta.**

---

## Recomendação: encurte o recorte

O título fala de 2018 a 2025, e a série completa está aqui. Mas se o objetivo é entregar um TCC bom com
menos trabalho, **o recorte forte é 2023–2025**, por três razões:

- é o período coberto pelo Observatório da Hotelaria publicado pelo SindHotéisRJ;
- de 2024 em diante **a pesquisa de ocupação é conduzida pela própria autora** — autoria direta do dado
  é um argumento metodológico de peso;
- é onde a documentação oficial dos eventos é mais completa (2019 tem lacuna de fonte, ver ficha F07).

Como fazer sem mudar o projeto aprovado: mantenha o título 2018–2025, use 2018–2022 como **contexto
histórico e contrafactual** (um capítulo curto, que é justamente a página 4 da revista) e concentre a
análise em **2023–2025**. A aba *Recorte 2023–2025* do dashboard já está montada assim.

---

## Estrutura

```
tcc-eventos-turismo-rio/
├── index.html                  dashboard (abre direto no navegador, funciona offline)
├── revista/revista.html        revista de 6 páginas, pronta para PDF
├── dados/
│   ├── ocupacao_cidade_do_rio_2018_2025.csv        série mensal da cidade
│   ├── ocupacao_hoteleira_rio_2018_2025_por_regiao.csv   série por região
│   ├── eventos.json            18 eventos com dados e ficha de fonte
│   ├── ocupacao.json           base usada pelos gráficos
│   └── dados.js                mesma base, embutida para funcionar offline
└── fontes/
    ├── 00-INDICE-DE-FONTES.md  índice, classificação e ressalvas
    └── F01 … F15               uma ficha por fonte
```

Cada ficha de fonte tem sempre a mesma estrutura: **o que é · referência em ABNT pronta para colar ·
links · resumo explicando o que aquilo significa · citações para usar no texto · onde entra no TCC**.

---

## Duas ressalvas que você precisa levar para a banca

1. **Projeção não é apuração.** Vários números oficiais são estimativas divulgadas *antes* do evento
   (Madonna: R$ 293,4 milhões; Web Summit 2023: R$ 1,2 bilhão). Escreva "deve movimentar" para projeção
   e "movimentou" para balanço, sempre com a data da fonte.
2. **Março de 2019 (90,66%) é dado suspeito.** Está muito acima de todas as regiões no mesmo mês e não
   corresponde a nenhum evento identificado. Confirme na planilha original antes de citar.

---

## Fontes

Dados de ocupação: **Pesquisa de Ocupação Hoteleira HotéisRIO / ABIH-RJ**.
Eventos e impactos: Prefeitura do Rio (SMDUE, SMDE, SMTUR, Casa Civil), Riotur, Ministério do Turismo,
Secretaria de Estado de Turismo do RJ, Agência Brasil (EBC), IBGE (Pesquisa Mensal de Serviços) e
Fundação Getulio Vargas. Consulta e verificação: **16 de setembro de 2026**.

Uso acadêmico.

---

## Novos arquivos desta versão

- [`FUNDAMENTACAO-TEORICA.md`](FUNDAMENTACAO-TEORICA.md) — 9 referências acadêmicas (SciELO, Redalyc),
  cada uma com link direto, citação e explicação de como usar, mais um resumo em linguagem simples.
- [`RESUMO-SIMPLES.md`](RESUMO-SIMPLES.md) — o TCC contado sem jargão, com o link da fonte em cada
  afirmação, para você reescrever com as suas palavras.
- [`FICHA-DO-PROJETO.docx`](FICHA-DO-PROJETO.docx) — **ficha para download em Word**: Diretrizes da
  Pesquisa, tabelas de ocupação e de impacto, fundamentação teórica e ressalvas metodológicas.
