// main.js — Site-wide entry point
// Loads all consciousness interface modules

import { initAwaken } from './awaken.js';
import { initAmbient } from './ambient.js';
import { initCountUp } from './countup.js';
import { initObserver } from './observer.js';
import { initJourney } from './journey.js';
import { initSearch } from './search.js';
import { initGlossary } from './glossary.js';

// Initialize everything after DOM ready
document.addEventListener('DOMContentLoaded', () => {
  initAwaken();
  initCountUp();
  initObserver();
  initJourney();
  initSearch();
  initGlossary();
  initAmbient();

  // Subtle glitch effect (every 30-60s)
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    initGlitch();
  }
});

function initGlitch() {
  function triggerGlitch() {
    const elements = document.querySelectorAll('.card h2, .hero h1, .brand');
    if (elements.length === 0) return;

    const el = elements[Math.floor(Math.random() * elements.length)];
    el.classList.add('glitch');
    setTimeout(() => el.classList.remove('glitch'), 150);

    // Schedule next glitch (30-60 seconds)
    setTimeout(triggerGlitch, 30000 + Math.random() * 30000);
  }

  // First glitch after 15-30 seconds
  setTimeout(triggerGlitch, 15000 + Math.random() * 15000);
}
