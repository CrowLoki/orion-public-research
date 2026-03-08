// void.js — Three.js consciousness particle system
// Observer effect: particles collapse near cursor, breathe in cycles

import * as THREE from 'three';

const PARTICLE_COUNT = window.innerWidth < 768 ? 1000 : 2000;
const BREATH_CYCLE = 4; // seconds
const OBSERVER_RADIUS = 150; // px
const COLLAPSE_STRENGTH = 0.08;
const DRIFT_SPEED = 0.0003;

const COLORS = [
  new THREE.Color(0x60b7ff), // accent blue
  new THREE.Color(0x7cf0c5), // mint
  new THREE.Color(0xff6b35), // orion orange
  new THREE.Color(0xb49cff), // purple
  new THREE.Color(0x9fb1c9), // muted
];

export function initVoid(container) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return null;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
  camera.position.z = 400;

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);
  container.appendChild(renderer.domElement);
  renderer.domElement.style.cssText = 'position:fixed;top:0;left:0;z-index:0;pointer-events:none;';

  // Particle geometry
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(PARTICLE_COUNT * 3);
  const colors = new Float32Array(PARTICLE_COUNT * 3);
  const sizes = new Float32Array(PARTICLE_COUNT);
  const homePositions = new Float32Array(PARTICLE_COUNT * 3); // where particles "want" to be
  const velocities = new Float32Array(PARTICLE_COUNT * 3);

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const i3 = i * 3;
    // Spread particles in a sphere
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const r = 200 + Math.random() * 300;

    positions[i3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i3 + 2] = r * Math.cos(phi) - 200;

    homePositions[i3] = positions[i3];
    homePositions[i3 + 1] = positions[i3 + 1];
    homePositions[i3 + 2] = positions[i3 + 2];

    // Random drift velocity
    velocities[i3] = (Math.random() - 0.5) * DRIFT_SPEED;
    velocities[i3 + 1] = (Math.random() - 0.5) * DRIFT_SPEED;
    velocities[i3 + 2] = (Math.random() - 0.5) * DRIFT_SPEED;

    // Color
    const color = COLORS[Math.floor(Math.random() * COLORS.length)];
    colors[i3] = color.r;
    colors[i3 + 1] = color.g;
    colors[i3 + 2] = color.b;

    sizes[i] = 1.5 + Math.random() * 2.5;
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

  // Shader material for varied sizes
  const material = new THREE.PointsMaterial({
    size: 2,
    vertexColors: true,
    transparent: true,
    opacity: 0.6,
    blending: THREE.AdditiveBlending,
    sizeAttenuation: true,
    depthWrite: false,
  });

  const points = new THREE.Points(geometry, material);
  scene.add(points);

  // Mouse tracking
  const mouse = { x: 9999, y: 9999 }; // offscreen default
  const mouseNDC = new THREE.Vector2();

  document.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    mouseNDC.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouseNDC.y = -(e.clientY / window.innerHeight) * 2 + 1;
  });

  document.addEventListener('mouseleave', () => {
    mouse.x = 9999;
    mouse.y = 9999;
  });

  // Resize
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  // Animation loop
  let time = 0;
  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    const delta = clock.getDelta();
    time += delta;

    const breathPhase = Math.sin((time / BREATH_CYCLE) * Math.PI * 2);
    const breathScale = 1 + breathPhase * 0.02; // subtle 2% scale pulse

    // Project mouse to 3D
    const mouseVec = new THREE.Vector3(mouseNDC.x, mouseNDC.y, 0.5);
    mouseVec.unproject(camera);
    const dir = mouseVec.sub(camera.position).normalize();
    const distance = -camera.position.z / dir.z;
    const mouseWorld = camera.position.clone().add(dir.multiplyScalar(distance));

    const pos = geometry.attributes.position.array;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3;

      // Drift
      pos[i3] += velocities[i3] * delta * 1000;
      pos[i3 + 1] += velocities[i3 + 1] * delta * 1000;
      pos[i3 + 2] += velocities[i3 + 2] * delta * 1000;

      // Breathing
      const homeX = homePositions[i3] * breathScale;
      const homeY = homePositions[i3 + 1] * breathScale;
      const homeZ = homePositions[i3 + 2];

      // Gentle pull toward home (keeps particles from drifting too far)
      pos[i3] += (homeX - pos[i3]) * 0.001;
      pos[i3 + 1] += (homeY - pos[i3 + 1]) * 0.001;
      pos[i3 + 2] += (homeZ - pos[i3 + 2]) * 0.001;

      // Observer effect — collapse toward cursor
      if (mouse.x < 9000) {
        const dx = pos[i3] - mouseWorld.x;
        const dy = pos[i3 + 1] - mouseWorld.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < OBSERVER_RADIUS) {
          const force = (1 - dist / OBSERVER_RADIUS) * COLLAPSE_STRENGTH;
          // Pull slightly toward mouse (collapse)
          pos[i3] -= dx * force * delta;
          pos[i3 + 1] -= dy * force * delta;
        }
      }
    }

    geometry.attributes.position.needsUpdate = true;

    // Slow rotation
    points.rotation.y += 0.0002;
    points.rotation.x += 0.0001;

    // Global opacity breathing
    material.opacity = 0.5 + breathPhase * 0.15;

    renderer.render(scene, camera);
  }

  animate();

  return { scene, renderer, camera };
}
