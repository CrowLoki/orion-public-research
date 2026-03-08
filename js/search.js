// search.js — Global search modal (Ctrl+K)
// Uses search-index.json for fuzzy matching

let searchData = null;
let overlay = null;

export function initSearch() {
  // Keyboard shortcut
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      openSearch();
    }
    if (e.key === 'Escape' && overlay) {
      closeSearch();
    }
  });

  // Load index
  fetch('/search-index.json')
    .then(r => r.json())
    .then(data => { searchData = data; })
    .catch(() => { /* index not available */ });
}

function createOverlay() {
  overlay = document.createElement('div');
  overlay.className = 'search-overlay';

  const modal = document.createElement('div');
  modal.className = 'search-modal';

  const input = document.createElement('input');
  input.type = 'text';
  input.className = 'search-modal-input';
  input.placeholder = 'Search protocols, research, pages...';
  input.setAttribute('autocomplete', 'off');

  const results = document.createElement('div');
  results.className = 'search-results';

  const hint = document.createElement('div');
  hint.className = 'search-hint';
  hint.textContent = 'ESC to close';

  modal.appendChild(input);
  modal.appendChild(results);
  modal.appendChild(hint);
  overlay.appendChild(modal);

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeSearch();
  });

  input.addEventListener('input', () => {
    const query = input.value.trim().toLowerCase();
    showResults(query, results);
  });

  document.body.appendChild(overlay);
  return { input, results };
}

function openSearch() {
  if (overlay) {
    overlay.classList.add('search-overlay--visible');
    overlay.querySelector('.search-modal-input').focus();
    return;
  }

  const { input } = createOverlay();
  requestAnimationFrame(() => {
    overlay.classList.add('search-overlay--visible');
    input.focus();
  });
}

function closeSearch() {
  if (!overlay) return;
  overlay.classList.remove('search-overlay--visible');
}

function showResults(query, container) {
  container.textContent = '';

  if (!query || !searchData) return;

  // Combine protocols and pages arrays
  const allItems = [...(searchData.protocols || []), ...(searchData.pages || [])];
  const matches = allItems.filter(p => {
    const text = (p.title + ' ' + (p.description || '') + ' ' + (p.category || '') + ' ' + ((p.keywords || []).join(' '))).toLowerCase();
    return text.includes(query);
  }).slice(0, 8);

  if (matches.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'search-empty';
    empty.textContent = 'No results found';
    container.appendChild(empty);
    return;
  }

  matches.forEach(item => {
    const link = document.createElement('a');
    link.className = 'search-result-item';
    link.href = item.url || (item.file ? '/' + item.file : '/' + item.id + '.html');

    const title = document.createElement('div');
    title.className = 'search-result-title';
    title.textContent = item.title;

    const desc = document.createElement('div');
    desc.className = 'search-result-desc';
    desc.textContent = item.description || item.category || '';

    link.appendChild(title);
    link.appendChild(desc);
    container.appendChild(link);
  });
}
