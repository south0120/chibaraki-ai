// 幾何学ワイヤーフレームが漂う動的背景（Three.js）
import * as THREE from 'three';

const canvas = document.getElementById('bg-canvas');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.z = 22;

const COLORS = [0x2e7dd1, 0x3fa8a0, 0x7fc243];
const GEOMETRIES = [
  new THREE.IcosahedronGeometry(1, 0),
  new THREE.OctahedronGeometry(1, 0),
  new THREE.TetrahedronGeometry(1, 0),
  new THREE.TorusGeometry(0.8, 0.28, 6, 18),
  new THREE.BoxGeometry(1.2, 1.2, 1.2),
];

const shapes = [];
for (let i = 0; i < 16; i++) {
  const geo = GEOMETRIES[i % GEOMETRIES.length];
  const mat = new THREE.LineBasicMaterial({
    color: COLORS[i % COLORS.length],
    transparent: true,
    opacity: 0.28,
  });
  const mesh = new THREE.LineSegments(new THREE.EdgesGeometry(geo), mat);
  mesh.position.set(
    (Math.random() - 0.5) * 42,
    (Math.random() - 0.5) * 24,
    (Math.random() - 0.5) * 12 - 3
  );
  mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
  mesh.scale.setScalar(0.9 + Math.random() * 2.2);
  mesh.userData = {
    rx: (Math.random() - 0.5) * 0.006,
    ry: (Math.random() - 0.5) * 0.006,
    baseY: mesh.position.y,
    amp: 0.4 + Math.random() * 0.8,
    speed: 0.15 + Math.random() * 0.3,
    phase: Math.random() * Math.PI * 2,
  };
  scene.add(mesh);
  shapes.push(mesh);
}

// 背景に散らす微粒子
const particleCount = 90;
const positions = new Float32Array(particleCount * 3);
for (let i = 0; i < particleCount; i++) {
  positions[i * 3] = (Math.random() - 0.5) * 50;
  positions[i * 3 + 1] = (Math.random() - 0.5) * 30;
  positions[i * 3 + 2] = (Math.random() - 0.5) * 14 - 4;
}
const particleGeo = new THREE.BufferGeometry();
particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
const particles = new THREE.Points(
  particleGeo,
  new THREE.PointsMaterial({ color: 0x3fa8a0, size: 0.12, transparent: true, opacity: 0.5 })
);
scene.add(particles);

let mouseX = 0;
let mouseY = 0;
window.addEventListener('pointermove', (e) => {
  mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
  mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
}, { passive: true });

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

let running = true;
document.addEventListener('visibilitychange', () => {
  running = !document.hidden;
  if (running && !reduceMotion) requestAnimationFrame(animate);
});

const clock = new THREE.Clock();
function animate() {
  if (!running) return;
  const t = clock.getElapsedTime();
  for (const s of shapes) {
    s.rotation.x += s.userData.rx;
    s.rotation.y += s.userData.ry;
    s.position.y = s.userData.baseY + Math.sin(t * s.userData.speed + s.userData.phase) * s.userData.amp;
  }
  particles.rotation.y = t * 0.01;
  camera.position.x += (mouseX * 1.5 - camera.position.x) * 0.03;
  camera.position.y += (-mouseY * 1.0 - camera.position.y) * 0.03;
  camera.lookAt(0, 0, 0);
  renderer.render(scene, camera);
  if (!reduceMotion) requestAnimationFrame(animate);
}

renderer.render(scene, camera);
if (!reduceMotion) requestAnimationFrame(animate);
