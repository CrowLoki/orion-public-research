// glossary.js — Hover tooltips for key terms site-wide
// Scans page text, wraps matching terms with tooltip spans

let glossaryData = null;

export function initGlossary() {
  fetch('/glossary.json')
    .then(r => r.json())
    .then(data => {
      glossaryData = data;
      applyGlossary();
    })
    .catch(() => { /* glossary not available */ });
}

function applyGlossary() {
  if (!glossaryData || !glossaryData.terms) return;

  // Build regex from all term names (longest first to avoid partial matches)
  const terms = Object.keys(glossaryData.terms)
    .sort((a, b) => b.length - a.length);

  const selectors = 'p, li, td, .protocol-desc';
  const elements = document.querySelectorAll(selectors);

  elements.forEach(el => {
    // Skip if already processed or inside a link/heading
    if (el.dataset.glossaryDone) return;
    if (el.closest('a, h1, h2, h3, nav, .glossary-tooltip')) return;

    let html = el.textContent;
    let modified = false;

    terms.forEach(term => {
      const regex = new RegExp('\\b(' + escapeRegex(term) + ')\\b', 'gi');
      if (regex.test(html)) {
        // Only wrap first occurrence per element
        let replaced = false;
        html = html.replace(regex, (match) => {
          if (replaced) return match;
          replaced = true;
          modified = true;
          const def = glossaryData.terms[term];
          return `<span class="glossary-term" data-tooltip="${escapeAttr(def)}">${match}</span>`;
        });
      }
    });

    if (modified) {
      // Use a safe approach: only modify text nodes
      wrapTerms(el, glossaryData.terms);
    }
    el.dataset.glossaryDone = '1';
  });
}

function wrapTerms(element, terms) {
  const termKeys = Object.keys(terms).sort((a, b) => b.length - a.length);
  const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, null);
  const textNodes = [];

  while (walker.nextNode()) {
    if (!walker.currentNode.parentElement.closest('a, h1, h2, h3, .glossary-term')) {
      textNodes.push(walker.currentNode);
    }
  }

  textNodes.forEach(node => {
    let text = node.textContent;
    let found = false;

    for (const term of termKeys) {
      const regex = new RegExp('\\b(' + escapeRegex(term) + ')\\b', 'i');
      if (regex.test(text)) {
        found = true;
        const parts = text.split(regex);
        const frag = document.createDocumentFragment();

        parts.forEach((part, i) => {
          if (i % 2 === 1) {
            // This is the matched term
            const span = document.createElement('span');
            span.className = 'glossary-term';
            span.dataset.tooltip = terms[term];
            span.textContent = part;
            frag.appendChild(span);
          } else if (part) {
            frag.appendChild(document.createTextNode(part));
          }
        });

        node.parentNode.replaceChild(frag, node);
        break; // only first term per text node
      }
    }
  });
}

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function escapeAttr(str) {
  return str.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
}
