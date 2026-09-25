// Fills the publication lists in index.html from a BibTeX file.
// @article -> Published, @unpublished with an arXiv eprint -> Preprints, other @unpublished -> not shown.
const BIB = 'publications.bib';
const ME = 'Al-Hiyasat, Amer';
const MARKS = { equal: '*', senior: '†' };

function parseBib(text) {
  const entries = [];
  for (const [, type, body] of text.matchAll(/@(\w+)\s*\{([\s\S]*?)\n\}/g)) {
    const e = { type: type.toLowerCase() };
    for (const [, k, v, n] of body.matchAll(/([\w+]+)\s*=\s*(?:\{((?:[^{}]|\{[^{}]*\})*)\}|(\d+))/g))
      e[k.toLowerCase()] = (v ?? n).trim();
    entries.push(e);
  }
  return entries;
}

const clean = s => s.replace(/\\emph\{([^}]*)\}/g, '<i>$1</i>').replace(/\\&/g, '&amp;')
  .replace(/--/g, '–').replace(/[{}]/g, '').replace(/\s+/g, ' ');

function authors(e) {
  const marks = {};
  for (const [, i, kind] of (e['author+an'] || '').matchAll(/(\d+)=(\w+)/g)) marks[i] = MARKS[kind] || '';
  return e.author.split(/\s+and\s+/).map((a, i) => {
    const [last, first] = a.split(/,\s*/);
    const name = clean(`${first} ${last}`) + (marks[i + 1] ? `<sup>${marks[i + 1]}</sup>` : '');
    return a === ME ? `<b>${name}</b>` : name;
  }).join(', ');
}

function render(e) {
  const title = e.url ? `<a href="${e.url}">${clean(e.title)}</a>` : clean(e.title);
  const arxiv = e.eprint ? `<a href="https://arxiv.org/abs/${e.eprint}">arXiv:${e.eprint}</a>` : '';
  const venue = e.journal
    ? [`<i>${clean(e.journal)}</i>`, e.volume && `<b>${e.volume}</b>`].filter(Boolean).join(' ') +
      (e.eid || e.pages ? ', ' + clean(e.eid || e.pages) : '')
    : arxiv;
  const extra = [e.journal && arxiv, e.note && e.type === 'article' && e.note].filter(Boolean).join(', ');
  return `<li>${authors(e)}. ${title}. ${venue ? venue + ' ' : ''}(${e.year})${extra ? '. ' + extra : ''}.</li>`;
}

fetch(BIB).then(r => r.text()).then(text => {
  const entries = parseBib(text).sort((a, b) => (b.sortyear || b.year).localeCompare(a.sortyear || a.year));
  const group = e => e.type === 'article' ? 'published' : e.eprint ? 'preprints' : null;
  for (const e of entries) if (group(e)) document.getElementById(group(e)).insertAdjacentHTML('beforeend', render(e));
  // Number continuously: preprints count down from the total, published count down to 1.
  preprints.start = preprints.children.length + published.children.length;
});
