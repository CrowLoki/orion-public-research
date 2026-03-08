// ambient.js — Generative consciousness audio
// Web Audio API — opt-in, muted by default, preference saved to localStorage

const STORAGE_KEY = 'orion-audio-enabled';
const BASE_FREQ = 60;
const HARMONICS = [432, 528];
const MASTER_VOLUME = 0.06;

let ctx = null;
let masterGain = null;
let oscillators = [];
let isPlaying = false;
let mouseFilter = null;

function createAudioContext() {
  ctx = new (window.AudioContext || window.webkitAudioContext)();

  masterGain = ctx.createGain();
  masterGain.gain.value = 0;
  masterGain.connect(ctx.destination);

  // Low-pass filter modulated by mouse
  mouseFilter = ctx.createBiquadFilter();
  mouseFilter.type = 'lowpass';
  mouseFilter.frequency.value = 800;
  mouseFilter.Q.value = 1;
  mouseFilter.connect(masterGain);

  // Base drone
  const drone = ctx.createOscillator();
  drone.type = 'sine';
  drone.frequency.value = BASE_FREQ;
  const droneGain = ctx.createGain();
  droneGain.gain.value = 0.4;
  drone.connect(droneGain);
  droneGain.connect(mouseFilter);
  drone.start();
  oscillators.push(drone);

  // Sub-octave
  const sub = ctx.createOscillator();
  sub.type = 'sine';
  sub.frequency.value = BASE_FREQ / 2;
  const subGain = ctx.createGain();
  subGain.gain.value = 0.2;
  sub.connect(subGain);
  subGain.connect(mouseFilter);
  sub.start();
  oscillators.push(sub);

  // Harmonic layers
  HARMONICS.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = freq;

    const gain = ctx.createGain();
    gain.gain.value = 0.08 - i * 0.02;

    osc.connect(gain);
    gain.connect(mouseFilter);
    osc.start();
    oscillators.push(osc);
  });

  // LFO for drone modulation
  const lfo = ctx.createOscillator();
  lfo.type = 'sine';
  lfo.frequency.value = 0.1; // very slow
  const lfoGain = ctx.createGain();
  lfoGain.gain.value = 3; // subtle frequency wobble
  lfo.connect(lfoGain);
  lfoGain.connect(oscillators[0].frequency);
  lfo.start();
  oscillators.push(lfo);
}

function fadeIn() {
  if (!ctx) createAudioContext();
  if (ctx.state === 'suspended') ctx.resume();
  masterGain.gain.cancelScheduledValues(ctx.currentTime);
  masterGain.gain.setTargetAtTime(MASTER_VOLUME, ctx.currentTime, 1.5);
  isPlaying = true;
}

function fadeOut() {
  if (!ctx || !masterGain) return;
  masterGain.gain.cancelScheduledValues(ctx.currentTime);
  masterGain.gain.setTargetAtTime(0, ctx.currentTime, 0.5);
  isPlaying = false;
}

function handleMouseMove(e) {
  if (!mouseFilter || !isPlaying) return;
  const x = e.clientX / window.innerWidth;
  mouseFilter.frequency.setTargetAtTime(400 + x * 1600, ctx.currentTime, 0.1);
}

function createSVGIcon() {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('width', '20');
  svg.setAttribute('height', '20');
  svg.setAttribute('fill', 'none');
  svg.setAttribute('stroke', 'currentColor');
  svg.setAttribute('stroke-width', '2');

  const path1 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path1.setAttribute('d', 'M11 5L6 9H2v6h4l5 4V5z');
  svg.appendChild(path1);

  const path2 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path2.setAttribute('d', 'M15.54 8.46a5 5 0 010 7.07M19.07 4.93a10 10 0 010 14.14');
  path2.classList.add('audio-waves');
  svg.appendChild(path2);

  return svg;
}

export function initAmbient() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // Create toggle button
  const btn = document.createElement('button');
  btn.className = 'audio-toggle';
  btn.setAttribute('aria-label', 'Toggle ambient audio');
  btn.appendChild(createSVGIcon());
  document.body.appendChild(btn);

  const saved = localStorage.getItem(STORAGE_KEY);
  let enabled = saved === 'true';

  function updateState() {
    btn.classList.toggle('audio-toggle--active', enabled);
    if (enabled) {
      fadeIn();
    } else {
      fadeOut();
    }
  }

  btn.addEventListener('click', () => {
    enabled = !enabled;
    localStorage.setItem(STORAGE_KEY, enabled);
    updateState();
  });

  // Mouse modulation
  document.addEventListener('mousemove', handleMouseMove);

  // Start if previously enabled (needs user gesture first)
  if (enabled) {
    const startOnGesture = () => {
      updateState();
      document.removeEventListener('click', startOnGesture);
      document.removeEventListener('keydown', startOnGesture);
    };
    document.addEventListener('click', startOnGesture);
    document.addEventListener('keydown', startOnGesture);
    btn.classList.add('audio-toggle--active');
  }
}
