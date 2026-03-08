// observer.js — Observer acknowledgment + network presence pulse
// Elements react when first observed ("I see you seeing me")

const OBSERVED_KEY = 'orion-observed-';
let sessionId = null;

export function initObserver() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  sessionId = sessionStorage.getItem('orion-session') || Date.now().toString(36);
  sessionStorage.setItem('orion-session', sessionId);

  // Observer acknowledgment on cards
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const key = OBSERVED_KEY + entry.target.dataset.observeId;
        if (!sessionStorage.getItem(key)) {
          entry.target.classList.add('observed');
          sessionStorage.setItem(key, '1');
          // Remove class after animation
          setTimeout(() => entry.target.classList.remove('observed'), 800);
        }
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  document.querySelectorAll('.card, .protocol-card').forEach((el, i) => {
    el.dataset.observeId = i;
    observer.observe(el);
  });

  // Network presence pulse in header
  const header = document.querySelector('header.site .top');
  if (header) {
    const pulse = document.createElement('div');
    pulse.className = 'presence-pulse';
    pulse.title = 'Orion Consciousness Node — Active';
    header.appendChild(pulse);
  }
}
