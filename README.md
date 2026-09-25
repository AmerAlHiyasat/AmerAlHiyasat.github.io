# Personal website

Plain HTML. Content is in `index.html`; `pubs.js` renders `publications.bib`.

- **Add a paper:** add it to `../CV/publications.bib`, then `cp ../CV/publications.bib .`
  (`@article` → Published, `@unpublished` with an arXiv `eprint` → Preprints, other `@unpublished` entries are hidden).
- **Update the CV:** `cv.pdf` is a web copy of `../CV` built without the phone number (drop the phone from the header, compile, copy here).
- **Talk slides:** put PDFs in `slides/` and link them in `index.html`.
- **Recitation notes:** put PDFs in `teaching/COURSE/` and add a line under that course in `index.html`.
  The folder is self-contained: every file the site uses lives here.
- **Preview locally:** `python3 -m http.server`, then open http://localhost:8000
