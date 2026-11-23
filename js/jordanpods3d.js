// Visor 360° de los JORDÁNPODS: modelo 3D sencillo que se gira arrastrando el ratón o el dedo.
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/OrbitControls.js';

const box = document.getElementById('visor3d');
const fallback = document.getElementById('visor-foto');

function webglOk() {
  try {
    const c = document.createElement('canvas');
    return !!(window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl')));
  } catch (e) { return false; }
}

if (!box || !webglOk()) {
  if (fallback) fallback.hidden = false;
} else {
  init();
}

function init() {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  box.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 50);
  camera.position.set(2.6, 0.9, 5.2);

  // Luces
  scene.add(new THREE.HemisphereLight(0xffffff, 0x8a93d6, 1.15));
  const key = new THREE.DirectionalLight(0xffffff, 1.9); key.position.set(3, 4, 5); scene.add(key);
  const rim = new THREE.DirectionalLight(0xa8b2ff, 1.2); rim.position.set(-4, 2, -4); scene.add(rim);
  const fill = new THREE.DirectionalLight(0xffffff, 0.5); fill.position.set(-3, -1, 3); scene.add(fill);

  // Materiales
  const navy = new THREE.MeshStandardMaterial({ color: 0x262b5e, roughness: 0.42, metalness: 0.15 });
  const navyDark = new THREE.MeshStandardMaterial({ color: 0x1c2049, roughness: 0.5, metalness: 0.1 });
  const leather = new THREE.MeshStandardMaterial({ color: 0x15183a, roughness: 0.88, metalness: 0.0 });
  const accent = new THREE.MeshStandardMaterial({ color: 0x3c4394, roughness: 0.3, metalness: 0.35 });

  const cascos = new THREE.Group();
  const R = 1.05;          // radio de la diadema
  const bandY = 0.2;       // altura del centro de la diadema
  const cupY = -0.62;      // altura del centro de los auriculares
  const cupX = R + 0.1;    // separación de los auriculares

  // Diadema exterior (medio aro aplanado)
  const band = new THREE.Mesh(new THREE.TorusGeometry(R, 0.065, 20, 120, Math.PI), navy);
  band.scale.z = 3.0; band.position.y = bandY; cascos.add(band);
  // Almohadilla interior de la diadema
  const pad = new THREE.Mesh(new THREE.TorusGeometry(R - 0.085, 0.045, 16, 100, Math.PI * 0.62), leather);
  pad.scale.z = 2.6; pad.position.y = bandY; pad.rotation.z = Math.PI * 0.19; cascos.add(pad);

  for (const s of [-1, 1]) {
    // Deslizador y horquilla
    const slider = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.42, 0.34), navyDark);
    slider.position.set(s * R, bandY - 0.18, 0); cascos.add(slider);
    const hinge = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.36, 20), accent);
    hinge.rotation.x = Math.PI / 2; hinge.position.set(s * R, bandY - 0.38, 0); cascos.add(hinge);

    const cup = new THREE.Group(); cup.position.set(s * cupX, cupY, 0); cascos.add(cup);
    // Carcasa
    const shell = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.53, 0.26, 64), navy);
    shell.rotation.z = Math.PI / 2; cup.add(shell);
    // Tapa exterior y aro brillante
    const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.46, 0.5, 0.05, 64), navyDark);
    cap.rotation.z = Math.PI / 2; cap.position.x = s * 0.15; cup.add(cap);
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.47, 0.018, 12, 80), accent);
    ring.rotation.y = Math.PI / 2; ring.position.x = s * 0.155; cup.add(ring);
    // Almohadilla de piel
    const cushion = new THREE.Mesh(new THREE.TorusGeometry(0.33, 0.13, 24, 64), leather);
    cushion.rotation.y = Math.PI / 2; cushion.position.x = -s * 0.17; cushion.scale.z = 1; cup.add(cushion);
    const inner = new THREE.Mesh(new THREE.CircleGeometry(0.33, 48), leather);
    inner.rotation.y = s * -Math.PI / 2; inner.position.x = -s * 0.14; cup.add(inner);
    // Botones en el borde del auricular derecho
    if (s === 1) {
      for (let i = 0; i < 3; i++) {
        const b = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.05, 0.03), accent);
        const a = -0.35 + i * 0.18;
        b.position.set(0, Math.sin(a) * 0.53 - 0.06, Math.cos(a) * 0.53);
        b.rotation.x = -a; cup.add(b);
      }
    }
    cup.userData.side = s;
    cascos.userData['cup' + s] = cup;
  }

  // Escudo con el logo «pj» en el exterior de los dos auriculares
  new THREE.TextureLoader().load('assets/escudo_pj.png', (tex) => {
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
    const mat = new THREE.MeshStandardMaterial({ map: tex, transparent: true, roughness: 0.55, metalness: 0.05 });
    for (const s of [-1, 1]) {
      const logo = new THREE.Mesh(new THREE.PlaneGeometry(0.5, 0.5), mat);
      logo.rotation.y = s * Math.PI / 2;
      logo.position.x = s * 0.178;
      cascos.userData['cup' + s].add(logo);
    }
  });

  cascos.position.y = 0.12;
  cascos.rotation.y = -0.35;
  scene.add(cascos);

  // Controles: arrastrar para girar en todas direcciones
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set(0, -0.12, 0);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.enablePan = false;
  controls.enableZoom = true;
  controls.minDistance = 3.4;
  controls.maxDistance = 8;
  controls.rotateSpeed = 0.9;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  controls.autoRotate = !reduce;
  controls.autoRotateSpeed = 1.6;
  renderer.domElement.style.touchAction = 'pan-y'; // en el móvil se puede seguir bajando por la página
  controls.update();
  const start = { pos: camera.position.clone() };

  let idle;
  const hint = document.getElementById('visor-hint');
  controls.addEventListener('start', () => {
    controls.autoRotate = false; clearTimeout(idle);
    box.classList.add('dragging'); if (hint) hint.classList.add('used');
  });
  controls.addEventListener('end', () => {
    box.classList.remove('dragging');
    clearTimeout(idle);
    if (!reduce) idle = setTimeout(() => { controls.autoRotate = true; }, 5000);
  });

  const reset = document.getElementById('visor-reset');
  if (reset) reset.addEventListener('click', () => {
    camera.position.copy(start.pos); controls.target.set(0, -0.12, 0); controls.update();
  });

  // Por defecto la rueda del ratón hace scroll en la página; el zoom solo con Ctrl/gesto de pellizco
  renderer.domElement.addEventListener('wheel', (e) => { if (!e.ctrlKey) e.stopImmediatePropagation(); }, { capture: true });

  function resize() {
    const w = box.clientWidth, h = box.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.fov = camera.aspect < 0.8 ? 50 : camera.aspect < 1.2 ? 40 : 33; // en pantallas estrechas se aleja un poco
    camera.updateProjectionMatrix();
  }
  new ResizeObserver(resize).observe(box);
  resize();

  renderer.setAnimationLoop(() => { controls.update(); renderer.render(scene, camera); });
  box.classList.add('ready');
  if (fallback) fallback.hidden = true; // el modelo 3D ya se ve: quitamos la foto de reserva
  window.__visor = { scene, camera, controls };
}
