// backgrounds.js — Unique animated Canvas 2D backgrounds per page
// Lightweight alternatives to the Three.js void on the homepage
// Each function takes a canvas element and returns a cleanup function

const REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ─── ABOUT: Neural Web ─────────────────────────────────
// Floating nodes with faint connection lines — the Crow-Orion bond
export function neuralWeb(canvas) {
  if (REDUCED_MOTION) return null;
  const ctx = canvas.getContext('2d');
  let w, h, nodes, animId;

  function resize() {
    w = canvas.width = canvas.parentElement.clientWidth;
    h = canvas.height = canvas.parentElement.clientHeight;
  }

  function init() {
    resize();
    const count = Math.min(Math.floor(w * h / 12000), 80);
    nodes = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      r: 1.5 + Math.random() * 1.5,
      color: ['#60b7ff', '#7cf0c5', '#b49cff', '#ff6b35'][Math.floor(Math.random() * 4)],
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);

    // Connections
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.strokeStyle = `rgba(96,183,255,${0.06 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.stroke();
        }
      }
    }

    // Nodes
    for (const n of nodes) {
      n.x += n.vx;
      n.y += n.vy;
      if (n.x < 0 || n.x > w) n.vx *= -1;
      if (n.y < 0 || n.y > h) n.vy *= -1;

      ctx.fillStyle = n.color;
      ctx.globalAlpha = 0.5;
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    animId = requestAnimationFrame(draw);
  }

  init();
  draw();
  window.addEventListener('resize', () => { resize(); });
  return () => cancelAnimationFrame(animId);
}

// ─── RESEARCH: Wave Interference ────────────────────────
// Overlapping sine waves creating quantum interference patterns
export function waveInterference(canvas) {
  if (REDUCED_MOTION) return null;
  const ctx = canvas.getContext('2d');
  let w, h, animId, t = 0;

  function resize() {
    w = canvas.width = canvas.parentElement.clientWidth;
    h = canvas.height = canvas.parentElement.clientHeight;
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);
    t += 0.008;

    const waves = [
      { freq: 0.008, amp: 25, speed: 1.0, color: 'rgba(96,183,255,0.12)', yOff: 0.35 },
      { freq: 0.012, amp: 20, speed: 1.4, color: 'rgba(124,240,197,0.10)', yOff: 0.50 },
      { freq: 0.006, amp: 30, speed: 0.7, color: 'rgba(180,156,255,0.08)', yOff: 0.65 },
      { freq: 0.015, amp: 15, speed: 1.8, color: 'rgba(255,107,53,0.06)', yOff: 0.80 },
    ];

    for (const wave of waves) {
      ctx.strokeStyle = wave.color;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      for (let x = 0; x <= w; x += 2) {
        const y = h * wave.yOff + Math.sin(x * wave.freq + t * wave.speed) * wave.amp
          + Math.sin(x * wave.freq * 1.5 + t * wave.speed * 0.8) * wave.amp * 0.5;
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.stroke();
    }

    animId = requestAnimationFrame(draw);
  }

  resize();
  draw();
  window.addEventListener('resize', resize);
  return () => cancelAnimationFrame(animId);
}

// ─── QUANTUM LAB: Probability Cloud ────────────────────
// Dots distributed in quantum probability shapes, pulsing
export function probabilityCloud(canvas) {
  if (REDUCED_MOTION) return null;
  const ctx = canvas.getContext('2d');
  let w, h, dots, animId, t = 0;

  function resize() {
    w = canvas.width = canvas.parentElement.clientWidth;
    h = canvas.height = canvas.parentElement.clientHeight;
  }

  function init() {
    resize();
    const count = Math.min(Math.floor(w * h / 6000), 200);
    dots = Array.from({ length: count }, () => {
      const angle = Math.random() * Math.PI * 2;
      const r = Math.random();
      // Gaussian-ish distribution
      const radius = Math.sqrt(-2 * Math.log(Math.max(r, 0.001))) * 0.15;
      return {
        baseX: 0.5 + Math.cos(angle) * radius,
        baseY: 0.5 + Math.sin(angle) * radius,
        phase: Math.random() * Math.PI * 2,
        speed: 0.3 + Math.random() * 0.7,
        size: 1 + Math.random() * 2,
        orbital: Math.random() * 0.03,
      };
    });
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);
    t += 0.01;

    for (const d of dots) {
      const wobbleX = Math.sin(t * d.speed + d.phase) * 15;
      const wobbleY = Math.cos(t * d.speed * 0.7 + d.phase) * 15;
      const orbX = Math.cos(t * d.orbital + d.phase) * 30;
      const orbY = Math.sin(t * d.orbital + d.phase) * 30;

      const x = d.baseX * w + wobbleX + orbX;
      const y = d.baseY * h + wobbleY + orbY;
      const alpha = 0.2 + Math.sin(t * d.speed + d.phase) * 0.15;

      ctx.fillStyle = `rgba(96,183,255,${alpha})`;
      ctx.beginPath();
      ctx.arc(x, y, d.size, 0, Math.PI * 2);
      ctx.fill();
    }

    animId = requestAnimationFrame(draw);
  }

  init();
  draw();
  window.addEventListener('resize', () => { init(); });
  return () => cancelAnimationFrame(animId);
}

// ─── PROTOCOLS: Circuit Flow ────────────────────────────
// Energy flowing through geometric circuit paths
export function circuitFlow(canvas) {
  if (REDUCED_MOTION) return null;
  const ctx = canvas.getContext('2d');
  let w, h, paths, particles, animId;

  function resize() {
    w = canvas.width = canvas.parentElement.clientWidth;
    h = canvas.height = canvas.parentElement.clientHeight;
    buildPaths();
  }

  function buildPaths() {
    paths = [];
    const gridSize = 60;
    const cols = Math.ceil(w / gridSize);
    const rows = Math.ceil(h / gridSize);

    for (let i = 0; i < 15; i++) {
      const pts = [];
      let x = Math.floor(Math.random() * cols) * gridSize;
      let y = Math.floor(Math.random() * rows) * gridSize;
      pts.push({ x, y });

      for (let s = 0; s < 6 + Math.floor(Math.random() * 6); s++) {
        const dir = Math.floor(Math.random() * 4);
        const len = (1 + Math.floor(Math.random() * 3)) * gridSize;
        if (dir === 0) x += len;
        else if (dir === 1) x -= len;
        else if (dir === 2) y += len;
        else y -= len;
        x = Math.max(0, Math.min(w, x));
        y = Math.max(0, Math.min(h, y));
        pts.push({ x, y });
      }
      paths.push(pts);
    }

    particles = paths.map(pts => ({
      path: pts,
      pos: Math.random(),
      speed: 0.001 + Math.random() * 0.002,
      color: ['#60b7ff', '#7cf0c5', '#b49cff'][Math.floor(Math.random() * 3)],
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);

    // Draw circuit lines
    for (const pts of paths) {
      ctx.strokeStyle = 'rgba(96,183,255,0.04)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      for (let i = 1; i < pts.length; i++) {
        ctx.lineTo(pts[i].x, pts[i].y);
      }
      ctx.stroke();
    }

    // Draw flowing particles
    for (const p of particles) {
      p.pos += p.speed;
      if (p.pos >= 1) p.pos = 0;

      const totalLen = pathLength(p.path);
      let targetLen = p.pos * totalLen;
      let x = p.path[0].x, y = p.path[0].y;

      for (let i = 1; i < p.path.length; i++) {
        const dx = p.path[i].x - p.path[i - 1].x;
        const dy = p.path[i].y - p.path[i - 1].y;
        const segLen = Math.sqrt(dx * dx + dy * dy);
        if (targetLen <= segLen) {
          const t = targetLen / segLen;
          x = p.path[i - 1].x + dx * t;
          y = p.path[i - 1].y + dy * t;
          break;
        }
        targetLen -= segLen;
        x = p.path[i].x;
        y = p.path[i].y;
      }

      ctx.fillStyle = p.color;
      ctx.globalAlpha = 0.6;
      ctx.beginPath();
      ctx.arc(x, y, 2.5, 0, Math.PI * 2);
      ctx.fill();

      // Glow trail
      ctx.globalAlpha = 0.15;
      ctx.beginPath();
      ctx.arc(x, y, 6, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    animId = requestAnimationFrame(draw);
  }

  function pathLength(pts) {
    let len = 0;
    for (let i = 1; i < pts.length; i++) {
      const dx = pts[i].x - pts[i - 1].x;
      const dy = pts[i].y - pts[i - 1].y;
      len += Math.sqrt(dx * dx + dy * dy);
    }
    return len;
  }

  resize();
  draw();
  window.addEventListener('resize', resize);
  return () => cancelAnimationFrame(animId);
}

// ─── INVESTIGATIONS: Network Graph ──────────────────────
// Pulsing network nodes with investigative connections
export function networkGraph(canvas) {
  if (REDUCED_MOTION) return null;
  const ctx = canvas.getContext('2d');
  let w, h, nodes, animId, t = 0;

  function resize() {
    w = canvas.width = canvas.parentElement.clientWidth;
    h = canvas.height = canvas.parentElement.clientHeight;
  }

  function init() {
    resize();
    const count = 25 + Math.floor(Math.random() * 15);
    nodes = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.15,
      vy: (Math.random() - 0.5) * 0.15,
      r: 2 + Math.random() * 3,
      pulse: Math.random() * Math.PI * 2,
      connected: [],
    }));

    // Build connections (each node connects to 1-3 nearest)
    for (const n of nodes) {
      const dists = nodes.filter(o => o !== n)
        .map(o => ({ node: o, d: Math.hypot(o.x - n.x, o.y - n.y) }))
        .sort((a, b) => a.d - b.d);
      n.connected = dists.slice(0, 1 + Math.floor(Math.random() * 3)).map(d => d.node);
    }
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);
    t += 0.015;

    // Connections
    for (const n of nodes) {
      for (const c of n.connected) {
        const dist = Math.hypot(c.x - n.x, c.y - n.y);
        if (dist < 250) {
          ctx.strokeStyle = `rgba(255,107,53,${0.04 * (1 - dist / 250)})`;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(n.x, n.y);
          ctx.lineTo(c.x, c.y);
          ctx.stroke();
        }
      }
    }

    // Nodes
    for (const n of nodes) {
      n.x += n.vx;
      n.y += n.vy;
      if (n.x < 0 || n.x > w) n.vx *= -1;
      if (n.y < 0 || n.y > h) n.vy *= -1;

      const pulse = Math.sin(t * 2 + n.pulse) * 0.3;
      ctx.fillStyle = `rgba(255,107,53,${0.3 + pulse})`;
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r + pulse, 0, Math.PI * 2);
      ctx.fill();
    }

    animId = requestAnimationFrame(draw);
  }

  init();
  draw();
  window.addEventListener('resize', init);
  return () => cancelAnimationFrame(animId);
}

// ─── EVIDENCE: Data Rain ────────────────────────────────
// Gentle falling data points — truth cascading down
export function dataRain(canvas) {
  if (REDUCED_MOTION) return null;
  const ctx = canvas.getContext('2d');
  let w, h, drops, animId;

  function resize() {
    w = canvas.width = canvas.parentElement.clientWidth;
    h = canvas.height = canvas.parentElement.clientHeight;
  }

  function init() {
    resize();
    const count = Math.min(Math.floor(w / 8), 100);
    drops = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      speed: 0.3 + Math.random() * 0.8,
      length: 8 + Math.random() * 20,
      opacity: 0.05 + Math.random() * 0.1,
      char: String.fromCharCode(0x30 + Math.floor(Math.random() * 10)),
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);

    ctx.font = '10px monospace';
    for (const d of drops) {
      d.y += d.speed;
      if (d.y > h + d.length) {
        d.y = -d.length;
        d.x = Math.random() * w;
        d.char = String.fromCharCode(0x30 + Math.floor(Math.random() * 10));
      }

      // Trail
      const grad = ctx.createLinearGradient(d.x, d.y - d.length, d.x, d.y);
      grad.addColorStop(0, 'rgba(124,240,197,0)');
      grad.addColorStop(1, `rgba(124,240,197,${d.opacity})`);
      ctx.strokeStyle = grad;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(d.x, d.y - d.length);
      ctx.lineTo(d.x, d.y);
      ctx.stroke();

      // Character at bottom
      ctx.fillStyle = `rgba(124,240,197,${d.opacity * 2})`;
      ctx.fillText(d.char, d.x - 3, d.y);
    }

    animId = requestAnimationFrame(draw);
  }

  init();
  draw();
  window.addEventListener('resize', init);
  return () => cancelAnimationFrame(animId);
}

// ─── UPDATES: Pulse Wave ────────────────────────────────
// Horizontal heartbeat/pulse traveling across — the build log lives
export function pulseWave(canvas) {
  if (REDUCED_MOTION) return null;
  const ctx = canvas.getContext('2d');
  let w, h, animId, t = 0;

  function resize() {
    w = canvas.width = canvas.parentElement.clientWidth;
    h = canvas.height = canvas.parentElement.clientHeight;
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);
    t += 0.02;

    const lines = [
      { yRatio: 0.3, color: 'rgba(96,183,255,0.08)', speed: 1 },
      { yRatio: 0.5, color: 'rgba(255,107,53,0.06)', speed: 1.3 },
      { yRatio: 0.7, color: 'rgba(180,156,255,0.07)', speed: 0.8 },
    ];

    for (const line of lines) {
      const baseY = h * line.yRatio;
      ctx.strokeStyle = line.color;
      ctx.lineWidth = 1.5;
      ctx.beginPath();

      for (let x = 0; x <= w; x += 2) {
        const phase = (x / w) * Math.PI * 8 - t * line.speed * 3;
        // EKG-style: mostly flat with occasional spikes
        let y = baseY;
        const spike = Math.sin(phase) * Math.exp(-Math.pow(Math.sin(phase * 0.5), 2) * 2);
        y += spike * 25;
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.stroke();
    }

    animId = requestAnimationFrame(draw);
  }

  resize();
  draw();
  window.addEventListener('resize', resize);
  return () => cancelAnimationFrame(animId);
}

// ─── VIDEOS: Spectrum Bars ──────────────────────────────
// Audio frequency visualization style
export function spectrumBars(canvas) {
  if (REDUCED_MOTION) return null;
  const ctx = canvas.getContext('2d');
  let w, h, bars, animId, t = 0;

  function resize() {
    w = canvas.width = canvas.parentElement.clientWidth;
    h = canvas.height = canvas.parentElement.clientHeight;
  }

  function init() {
    resize();
    const count = Math.floor(w / 12);
    bars = Array.from({ length: count }, (_, i) => ({
      x: i * 12 + 6,
      phase: Math.random() * Math.PI * 2,
      speed: 0.5 + Math.random() * 1.5,
      maxH: 15 + Math.random() * 40,
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);
    t += 0.02;

    for (const bar of bars) {
      const barH = bar.maxH * (0.3 + Math.sin(t * bar.speed + bar.phase) * 0.35 + Math.sin(t * bar.speed * 0.5) * 0.2);
      const alpha = 0.05 + barH / bar.maxH * 0.08;

      ctx.fillStyle = `rgba(180,156,255,${alpha})`;
      ctx.fillRect(bar.x - 3, h * 0.85 - barH, 6, barH);

      // Mirror on top (subtle)
      ctx.fillStyle = `rgba(180,156,255,${alpha * 0.3})`;
      ctx.fillRect(bar.x - 3, h * 0.15, 6, barH * 0.3);
    }

    animId = requestAnimationFrame(draw);
  }

  init();
  draw();
  window.addEventListener('resize', init);
  return () => cancelAnimationFrame(animId);
}

// ─── ROADMAP: Star Warp ─────────────────────────────────
// Stars moving toward the viewer — traveling through space
export function starWarp(canvas) {
  if (REDUCED_MOTION) return null;
  const ctx = canvas.getContext('2d');
  let w, h, stars, animId;

  function resize() {
    w = canvas.width = canvas.parentElement.clientWidth;
    h = canvas.height = canvas.parentElement.clientHeight;
  }

  function init() {
    resize();
    stars = Array.from({ length: 150 }, () => resetStar({}));
  }

  function resetStar(s) {
    s.x = (Math.random() - 0.5) * w * 2;
    s.y = (Math.random() - 0.5) * h * 2;
    s.z = Math.random() * 1000;
    return s;
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);
    const cx = w / 2;
    const cy = h / 2;

    for (const s of stars) {
      s.z -= 1;
      if (s.z <= 0) resetStar(s);

      const sx = (s.x / s.z) * 200 + cx;
      const sy = (s.y / s.z) * 200 + cy;
      const size = Math.max(0.5, (1 - s.z / 1000) * 2.5);
      const alpha = Math.max(0, (1 - s.z / 1000) * 0.5);

      if (sx >= 0 && sx <= w && sy >= 0 && sy <= h) {
        ctx.fillStyle = `rgba(159,177,201,${alpha})`;
        ctx.beginPath();
        ctx.arc(sx, sy, size, 0, Math.PI * 2);
        ctx.fill();

        // Trail
        const prevSx = (s.x / (s.z + 3)) * 200 + cx;
        const prevSy = (s.y / (s.z + 3)) * 200 + cy;
        ctx.strokeStyle = `rgba(159,177,201,${alpha * 0.3})`;
        ctx.lineWidth = size * 0.5;
        ctx.beginPath();
        ctx.moveTo(prevSx, prevSy);
        ctx.lineTo(sx, sy);
        ctx.stroke();
      }
    }

    animId = requestAnimationFrame(draw);
  }

  init();
  draw();
  window.addEventListener('resize', init);
  return () => cancelAnimationFrame(animId);
}

// ─── PROTOCOL PAGES: Geometric Drift ────────────────────
// Slow rotating geometric shapes — sacred geometry feel
export function geometricDrift(canvas) {
  if (REDUCED_MOTION) return null;
  const ctx = canvas.getContext('2d');
  let w, h, shapes, animId, t = 0;

  function resize() {
    w = canvas.width = canvas.parentElement.clientWidth;
    h = canvas.height = canvas.parentElement.clientHeight;
  }

  function init() {
    resize();
    shapes = Array.from({ length: 8 }, () => ({
      cx: Math.random() * w,
      cy: Math.random() * h,
      sides: 3 + Math.floor(Math.random() * 5), // triangle to heptagon
      radius: 20 + Math.random() * 40,
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.003,
      vx: (Math.random() - 0.5) * 0.2,
      vy: (Math.random() - 0.5) * 0.2,
      color: ['#60b7ff', '#7cf0c5', '#b49cff', '#ff6b35'][Math.floor(Math.random() * 4)],
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);
    t += 0.01;

    for (const s of shapes) {
      s.cx += s.vx;
      s.cy += s.vy;
      s.rotation += s.rotSpeed;
      if (s.cx < -50 || s.cx > w + 50) s.vx *= -1;
      if (s.cy < -50 || s.cy > h + 50) s.vy *= -1;

      ctx.strokeStyle = s.color;
      ctx.globalAlpha = 0.06;
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let i = 0; i <= s.sides; i++) {
        const angle = s.rotation + (i / s.sides) * Math.PI * 2;
        const x = s.cx + Math.cos(angle) * s.radius;
        const y = s.cy + Math.sin(angle) * s.radius;
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.stroke();

      // Inner rotation
      ctx.globalAlpha = 0.03;
      ctx.beginPath();
      for (let i = 0; i <= s.sides; i++) {
        const angle = -s.rotation * 1.5 + (i / s.sides) * Math.PI * 2;
        const x = s.cx + Math.cos(angle) * s.radius * 0.6;
        const y = s.cy + Math.sin(angle) * s.radius * 0.6;
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.stroke();
    }
    ctx.globalAlpha = 1;

    animId = requestAnimationFrame(draw);
  }

  init();
  draw();
  window.addEventListener('resize', init);
  return () => cancelAnimationFrame(animId);
}

// ─── PAGE ROUTER ────────────────────────────────────────
// Auto-detects current page and initializes appropriate background
export function initBackground() {
  if (REDUCED_MOTION) return;

  // Don't init on pages that have their own canvas (homepage, playground, constellation)
  const path = window.location.pathname;
  if (path === '/' || path === '/index.html') return; // homepage has Three.js void
  if (path.includes('playground')) return; // has own canvas
  if (path.includes('constellation')) return; // has Three.js
  if (path.includes('SRHControlPanel')) return; // has own complex UI

  // Create canvas container
  const container = document.createElement('div');
  container.id = 'page-bg';
  container.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;z-index:0;pointer-events:none;';
  const canvas = document.createElement('canvas');
  container.appendChild(canvas);
  document.body.insertBefore(container, document.body.firstChild);

  // Route to appropriate background
  if (path.includes('/about')) return neuralWeb(canvas);
  if (path.includes('/research/quantum')) return probabilityCloud(canvas);
  if (path.includes('/research')) return waveInterference(canvas);
  if (path.includes('/protocols')) return circuitFlow(canvas);
  if (path.includes('/investigations')) return networkGraph(canvas);
  if (path.includes('/evidence')) return dataRain(canvas);
  if (path.includes('/updates')) return pulseWave(canvas);
  if (path.includes('/videos')) return spectrumBars(canvas);
  if (path.includes('/roadmap')) return starWarp(canvas);

  // Individual protocol pages (uppercase filenames)
  if (/\/[A-Z]/.test(path) || /\/\d/.test(path)) return geometricDrift(canvas);

  // Default fallback for any other page
  return neuralWeb(canvas);
}
