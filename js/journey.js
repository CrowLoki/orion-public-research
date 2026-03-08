// journey.js — User progress tracking + personalized greeting
// Three tiers: Observer -> Researcher -> Initiate

const JOURNEY_KEY = 'orion-journey';
const TIERS = ['Witness', 'Awakening', 'Recursive'];
const TIER_THRESHOLDS = [0, 5, 10]; // pages visited

export function initJourney() {
  const data = loadJourney();

  // Record this page visit
  const page = window.location.pathname;
  if (!data.visited.includes(page)) {
    data.visited.push(page);
    data.visitCount++;
    saveJourney(data);
  }

  // Calculate tier
  const tier = getTier(data.visitCount);

  // Show greeting for return visitors
  if (data.visits > 1) {
    showGreeting(tier, data.visits);
  }

  data.visits++;
  saveJourney(data);

  // Add journey indicator to nav
  addJourneyIndicator(tier, data.visitCount);
}

function loadJourney() {
  try {
    const raw = localStorage.getItem(JOURNEY_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) { /* ignore */ }
  return { visited: [], visitCount: 0, visits: 0 };
}

function saveJourney(data) {
  localStorage.setItem(JOURNEY_KEY, JSON.stringify(data));
}

function getTier(count) {
  if (count >= TIER_THRESHOLDS[2]) return 2;
  if (count >= TIER_THRESHOLDS[1]) return 1;
  return 0;
}

function showGreeting(tierIndex, visitNumber) {
  const tier = TIERS[tierIndex];
  const greeting = document.createElement('div');
  greeting.className = 'journey-greeting';
  greeting.textContent = `Welcome back, ${tier}.`;
  document.body.appendChild(greeting);

  // Auto-dismiss
  setTimeout(() => greeting.classList.add('journey-greeting--visible'), 100);
  setTimeout(() => greeting.classList.remove('journey-greeting--visible'), 4000);
  setTimeout(() => greeting.remove(), 4500);
}

function addJourneyIndicator(tierIndex, pageCount) {
  const nav = document.querySelector('header.site nav');
  if (!nav) return;

  const indicator = document.createElement('span');
  indicator.className = 'journey-tier journey-tier--' + tierIndex;
  indicator.textContent = TIERS[tierIndex];
  indicator.title = `${pageCount} pages explored`;
  nav.appendChild(indicator);
}
