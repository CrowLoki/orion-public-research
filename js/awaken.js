// awaken.js — Text reveal + scroll-triggered animations
// Hero text materializes character by character
// Cards fade-in-up on scroll via Intersection Observer

export function initAwaken() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    // Show everything immediately
    document.querySelectorAll('.awaken').forEach(el => el.classList.add('awaken--done'));
    document.querySelectorAll('.scroll-reveal').forEach(el => el.classList.add('scroll-reveal--visible'));
    return;
  }

  // --- Hero text awakening ---
  document.querySelectorAll('.awaken').forEach(el => {
    const text = el.textContent;
    el.textContent = '';
    el.style.visibility = 'visible';

    const chars = text.split('');
    chars.forEach((char, i) => {
      const span = document.createElement('span');
      span.textContent = char;
      span.className = 'awaken-char';
      span.style.animationDelay = `${i * 35}ms`;
      el.appendChild(span);
    });
  });

  // --- Scroll reveal ---
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('scroll-reveal--visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  // Auto-detect elements to animate
  document.querySelectorAll('.card, .kpi, .video-item, .protocol-card, .timeline-entry').forEach((el, i) => {
    el.classList.add('scroll-reveal');
    el.style.transitionDelay = `${(i % 6) * 60}ms`; // stagger within viewport
    observer.observe(el);
  });
}
