// 千葉・茨城の県と沿線市域のシルエットが漂う幾何学背景（Three.js）
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

// 各エリアの簡略化シルエット（x:東西, y:南北）
const OUTLINES = {
  // 茨城県：北東の尖った海岸線と鹿島灘
  ibaraki: [
    [-0.30, 2.10], [0.00, 2.20], [0.50, 2.50], [0.90, 2.90], [1.10, 2.60],
    [1.00, 2.00], [1.15, 1.40], [1.50, 0.70], [1.60, 0.40], [1.40, 0.35],
    [1.20, 0.70], [0.90, 0.50], [0.50, 0.35], [0.10, 0.50], [-0.30, 0.40],
    [-0.50, 0.80], [-0.40, 1.40], [-0.55, 1.90],
  ],
  // 千葉県：房総半島と銚子
  chiba: [
    [0.00, 2.00], [0.25, 2.40], [0.45, 2.00], [0.90, 1.90], [1.50, 1.75],
    [1.75, 1.60], [1.50, 1.40], [1.10, 0.90], [0.90, 0.30], [0.70, -0.20],
    [0.35, -0.50], [0.05, -0.35], [0.20, -0.10], [0.00, 0.20], [0.25, 0.60],
    [0.05, 0.80], [-0.10, 1.20], [-0.25, 1.60],
  ],
  // 松戸市：南北に長い市域
  matsudo: [
    [0.00, 1.00], [0.35, 0.80], [0.45, 0.30], [0.30, -0.30], [0.45, -0.80],
    [0.10, -1.00], [-0.25, -0.70], [-0.35, 0.00], [-0.20, 0.60],
  ],
  // 柏市：南東に伸びる市域
  kashiwa: [
    [0.00, 0.80], [0.50, 0.60], [0.70, 0.10], [0.50, -0.40], [0.80, -0.80],
    [0.30, -0.90], [-0.20, -0.60], [-0.60, -0.20], [-0.50, 0.40],
  ],
  // 我孫子市：手賀沼沿いに東西に細長い
  abiko: [
    [-1.00, 0.20], [-0.50, 0.35], [0.00, 0.30], [0.50, 0.35], [1.00, 0.15],
    [0.80, -0.15], [0.30, -0.25], [-0.30, -0.30], [-0.80, -0.15],
  ],
  // 取手市：利根川沿いの市域
  toride: [
    [-0.90, 0.15], [-0.40, 0.40], [0.10, 0.25], [0.60, 0.40], [0.90, 0.10],
    [0.60, -0.20], [0.10, -0.35], [-0.50, -0.25],
  ],
  // 土浦市：霞ヶ浦に面した市域
  tsuchiura: [
    [-0.50, 0.70], [0.10, 0.80], [0.40, 0.50], [0.20, 0.20], [0.50, -0.10],
    [0.30, -0.50], [-0.20, -0.70], [-0.60, -0.30], [-0.70, 0.20],
  ],
  // 北千住（足立区）エリア
  kitasenju: [
    [-0.80, 0.30], [-0.30, 0.55], [0.30, 0.50], [0.80, 0.25], [0.60, -0.30],
    [0.00, -0.50], [-0.60, -0.35],
  ],
};

function outlineGeometry(points) {
  const shape = new THREE.Shape(points.map(([x, y]) => new THREE.Vector2(x, y)));
  const geo = new THREE.ExtrudeGeometry(shape, { depth: 0.22, bevelEnabled: false });
  return new THREE.EdgesGeometry(geo, 12);
}

const GEOMETRIES = Object.values(OUTLINES).map(outlineGeometry);

// 県シルエット（先頭2つ）は大きめ、市シルエットは小さめに散りばめる
const shapes = [];
const INSTANCES = 18;
for (let i = 0; i < INSTANCES; i++) {
  const geoIndex = i % GEOMETRIES.length;
  const mat = new THREE.LineBasicMaterial({
    color: COLORS[i % COLORS.length],
    transparent: true,
    opacity: geoIndex < 2 ? 0.30 : 0.24,
  });
  const mesh = new THREE.LineSegments(GEOMETRIES[geoIndex], mat);
  mesh.position.set(
    (Math.random() - 0.5) * 44,
    (Math.random() - 0.5) * 24,
    (Math.random() - 0.5) * 10 - 3
  );
  const base = geoIndex < 2 ? 2.4 : 1.6;
  mesh.scale.setScalar(base + Math.random() * 1.6);
  // シルエットが判別できるよう、傾きは浅く・回転はゆっくり揺らすだけにする
  mesh.rotation.x = (Math.random() - 0.5) * 0.7;
  mesh.rotation.y = (Math.random() - 0.5) * 0.7;
  mesh.userData = {
    baseY: mesh.position.y,
    baseRz: (Math.random() - 0.5) * 0.5,
    swing: 0.15 + Math.random() * 0.2,
    amp: 0.4 + Math.random() * 0.8,
    speed: 0.12 + Math.random() * 0.25,
    phase: Math.random() * Math.PI * 2,
  };
  mesh.rotation.z = mesh.userData.baseRz;
  scene.add(mesh);
  shapes.push(mesh);
}

// ロゴのネットワーク模様に合わせた微粒子
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
    const u = s.userData;
    s.position.y = u.baseY + Math.sin(t * u.speed + u.phase) * u.amp;
    s.rotation.z = u.baseRz + Math.sin(t * u.speed * 0.8 + u.phase) * u.swing;
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
