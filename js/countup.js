// countup.js — KPI number count-up animation on scroll

export function initCountUp() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateNumber(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.kpi .n').forEach(el => {
    el.dataset.target = el.textContent.trim();
    el.textContent = '0';
    observer.observe(el);
  });
}

function animateNumber(el) {
  const raw = el.dataset.target;
  const hasPlus = raw.includes('+');
  const hasComma = raw.includes(',');
  const numStr = raw.replace(/[^0-9.]/g, '');
  const target = parseFloat(numStr);

  if (isNaN(target)) {
    el.textContent = raw;
    return;
  }

  const duration = 1500;
  const start = performance.now();

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(eased * target);

    let display = current.toString();
    if (hasComma) {
      display = current.toLocaleString();
    }
    if (hasPlus) {
      display += '+';
    }

    el.textContent = display;

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      el.textContent = raw; // restore exact original
    }
  }

  requestAnimationFrame(update);
}
