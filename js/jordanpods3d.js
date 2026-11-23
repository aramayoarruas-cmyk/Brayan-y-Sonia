// Visor 360° de los JORDÁNPODS.
// Se arrastra con el ratón o el dedo para girar los cascos en todas direcciones y,
// al soltarlos, vuelven solos a su posición original.
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/RoomEnvironment.js';

const box = document.getElementById('visor3d');
const fallback = document.getElementById('visor-foto');

function webglOk() {
  try {
    const c = document.createElement('canvas');
    return !!(window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl')));
  } catch (e) { return false; }
}

if (box && webglOk()) init();

/* Forma de «gajo» de anillo: diadema, almohadilla de la diadema y horquilla */
function arco(r1, r2, a0, a1) {
  const s = new THREE.Shape();
  s.absarc(0, 0, r2, a0, a1, false);
  s.absarc(0, 0, r1, a1, a0, true);
  return s;
}
function extruir(shape, depth, bevel = 0.018) {
  const g = new THREE.ExtrudeGeometry(shape, {
    depth, bevelEnabled: true, bevelThickness: bevel, bevelSize: bevel, bevelSegments: 5, curveSegments: 120
  });
  g.translate(0, 0, -depth / 2);
  return g;
}
function rectRedondo(w, h, r) {
  const s = new THREE.Shape(), x = -w / 2, y = -h / 2;
  s.moveTo(x + r, y); s.lineTo(x + w - r, y); s.quadraticCurveTo(x + w, y, x + w, y + r);
  s.lineTo(x + w, y + h - r); s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  s.lineTo(x + r, y + h); s.quadraticCurveTo(x, y + h, x, y + h - r);
  s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y);
  return s;
}

function init() {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;
  box.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(renderer), 0.04).texture;

  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 50);
  camera.position.set(0, 0.15, 6.2);
  camera.lookAt(0, -0.1, 0);

  const key = new THREE.DirectionalLight(0xffffff, 1.4); key.position.set(3, 5, 4); scene.add(key);
  const rim = new THREE.DirectionalLight(0xdfe4ff, 1.1); rim.position.set(-4, 3, -3); scene.add(rim);

  // Materiales: plástico mate, piel de las almohadillas, tela y aro metálico
  const plastico = new THREE.MeshPhysicalMaterial({ roughness: 0.38, metalness: 0.0, clearcoat: 0.3, clearcoatRoughness: 0.45 });
  const plasticoOsc = new THREE.MeshPhysicalMaterial({ roughness: 0.5, metalness: 0.0, clearcoat: 0.15 });
  const piel = new THREE.MeshStandardMaterial({ roughness: 0.6, metalness: 0.0 });
  const tela = new THREE.MeshStandardMaterial({ color: 0x0b0b0e, roughness: 0.95 });
  const metal = new THREE.MeshStandardMaterial({ color: 0x8a8d96, roughness: 0.25, metalness: 0.9 });

  const cascos = new THREE.Group();
  const bandY = 0.28, cupY = -0.78, cupX = 1.1;

  // Diadema plana y ancha
  const band = new THREE.Mesh(extruir(arco(1.0, 1.085, 0, Math.PI), 0.4), plastico);
  band.position.y = bandY; cascos.add(band);
  // Almohadilla interior de la diadema
  const bandPad = new THREE.Mesh(extruir(arco(0.93, 1.0, 0.32, Math.PI - 0.32), 0.3, 0.025), piel);
  bandPad.position.y = bandY; cascos.add(bandPad);

  for (const s of [-1, 1]) {
    // Deslizador, un poco más ancho que la diadema
    const slider = new THREE.Mesh(extruir(rectRedondo(0.13, 0.5, 0.05), 0.44, 0.012), plasticoOsc);
    slider.position.set(s * 1.045, bandY - 0.22, 0); cascos.add(slider);

    const cup = new THREE.Group(); cup.position.set(s * cupX, cupY, 0); cascos.add(cup);

    // Horquilla que abraza el auricular por arriba
    const yokeG = extruir(arco(0.58, 0.65, 0.95, Math.PI - 0.95), 0.08, 0.015);
    yokeG.rotateY(Math.PI / 2);
    const yoke = new THREE.Mesh(yokeG, plastico); yoke.position.x = -s * 0.03; cup.add(yoke);
    const eje = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.14, 24), plasticoOsc);
    eje.position.y = 0.63; cup.add(eje);

    // Carcasa plana con el borde redondeado
    const perfil = [[0, -0.115], [0.5, -0.115], [0.545, -0.095], [0.56, -0.05], [0.56, 0.05], [0.545, 0.095], [0.5, 0.115], [0, 0.115]]
      .map(([r, y]) => new THREE.Vector2(r, y));
    const shellG = new THREE.LatheGeometry(perfil, 96); shellG.rotateZ(Math.PI / 2);
    cup.add(new THREE.Mesh(shellG, plastico));
    // Tapa exterior lisa y aro metálico fino
    const tapa = new THREE.Mesh(new THREE.CylinderGeometry(0.49, 0.49, 0.02, 96), plasticoOsc);
    tapa.rotation.z = Math.PI / 2; tapa.position.x = s * 0.12; cup.add(tapa);
    const aro = new THREE.Mesh(new THREE.TorusGeometry(0.5, 0.01, 12, 120), metal);
    aro.rotation.y = Math.PI / 2; aro.position.x = s * 0.122; cup.add(aro);

    // Almohadilla gruesa de piel y tela interior
    const pad = new THREE.Mesh(new THREE.TorusGeometry(0.37, 0.145, 32, 96), piel);
    pad.rotation.y = Math.PI / 2; pad.scale.z = 1.25; pad.position.x = -s * 0.2; cup.add(pad);
    const fondo = new THREE.Mesh(new THREE.CircleGeometry(0.38, 64), tela);
    fondo.rotation.y = -s * Math.PI / 2; fondo.position.x = -s * 0.17; cup.add(fondo);

    // Botones en el borde del auricular derecho
    if (s === 1) {
      [0.95, 1.18, 1.41].forEach((a) => {
        const b = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.05, 0.035), plasticoOsc);
        b.position.set(0, -Math.cos(a) * 0.565, -Math.sin(a) * 0.565);
        b.rotation.x = a; cup.add(b);
      });
    }
    cascos.userData['cup' + s] = cup;
  }

  // Escudo con el logo «pj» en los dos auriculares
  const loader = new THREE.TextureLoader();
  const logoMat = new THREE.MeshStandardMaterial({ transparent: true, roughness: 0.45 });
  const texturas = {};
  function cargarLogo(url) {
    if (texturas[url]) { logoMat.map = texturas[url]; logoMat.needsUpdate = true; return; }
    loader.load(url, (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
      texturas[url] = tex; logoMat.map = tex; logoMat.needsUpdate = true;
    });
  }
  for (const s of [-1, 1]) {
    const logo = new THREE.Mesh(new THREE.PlaneGeometry(0.64, 0.64), logoMat);
    logo.rotation.y = s * Math.PI / 2; logo.position.x = s * 0.132;
    cascos.userData['cup' + s].add(logo);
  }

  /* ---------- Colores: negro (como el producto) o azul marino (como el Canva) ---------- */
  const COLORES = {
    negro: { plastico: 0x19191c, oscuro: 0x121214, piel: 0x0e0e10, logo: 'assets/escudo_pj_negro.png' },
    azul: { plastico: 0x23264d, oscuro: 0x1b1e3d, piel: 0x15172d, logo: 'assets/escudo_pj.png' }
  };
  function ponerColor(nombre) {
    const c = COLORES[nombre]; if (!c) return;
    plastico.color.setHex(c.plastico); plasticoOsc.color.setHex(c.oscuro); piel.color.setHex(c.piel);
    cargarLogo(c.logo);
    document.querySelectorAll('[data-color]').forEach((x) => x.setAttribute('aria-pressed', x.dataset.color === nombre ? 'true' : 'false'));
  }
  document.querySelectorAll('[data-color]').forEach((b) => b.addEventListener('click', () => ponerColor(b.dataset.color)));
  ponerColor('negro');

  // Posición original: vista de tres cuartos, como en la foto del producto
  const pivote = new THREE.Group();
  cascos.position.y = 0.2;
  pivote.add(cascos);
  const ORIGINAL = new THREE.Quaternion().setFromEuler(new THREE.Euler(0.14, -0.66, 0.05));
  pivote.quaternion.copy(ORIGINAL);
  scene.add(pivote);

  /* ---------- Girar arrastrando y volver al soltar ---------- */
  const hint = document.getElementById('visor-hint');
  let arrastrando = false, lx = 0, ly = 0;
  const qx = new THREE.Quaternion(), qy = new THREE.Quaternion();
  const EJE_X = new THREE.Vector3(1, 0, 0), EJE_Y = new THREE.Vector3(0, 1, 0);
  const el = renderer.domElement;
  el.style.touchAction = 'none';

  el.addEventListener('pointerdown', (e) => {
    arrastrando = true; lx = e.clientX; ly = e.clientY;
    try { el.setPointerCapture(e.pointerId); } catch (err) {}
    box.classList.add('dragging'); if (hint) hint.classList.add('used');
  });
  el.addEventListener('pointermove', (e) => {
    if (!arrastrando) return;
    const dx = e.clientX - lx, dy = e.clientY - ly; lx = e.clientX; ly = e.clientY;
    qy.setFromAxisAngle(EJE_Y, dx * 0.011);
    qx.setFromAxisAngle(EJE_X, dy * 0.011);
    pivote.quaternion.premultiply(qy).premultiply(qx);
  });
  const soltar = () => { arrastrando = false; box.classList.remove('dragging'); };
  el.addEventListener('pointerup', soltar);
  el.addEventListener('pointercancel', soltar);
  el.addEventListener('lostpointercapture', soltar);

  function resize() {
    const w = box.clientWidth, h = box.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.fov = camera.aspect < 0.8 ? 48 : camera.aspect < 1.2 ? 40 : 34;
    camera.updateProjectionMatrix();
  }
  new ResizeObserver(resize).observe(box);
  resize();

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const reloj = new THREE.Clock();
  renderer.setAnimationLoop(() => {
    const dt = Math.min(reloj.getDelta(), 0.1), t = reloj.elapsedTime;
    if (!arrastrando) {
      // Al soltar, vuelve suavemente a la posición original
      pivote.quaternion.slerp(ORIGINAL, 1 - Math.exp(-dt * 6));
      // Ligero balanceo en reposo
      cascos.position.y = 0.2 + (reduce ? 0 : Math.sin(t * 1.3) * 0.03);
    }
    renderer.render(scene, camera);
  });

  box.classList.add('ready');
  if (fallback) fallback.hidden = true;
  window.__visor = { pivote, ORIGINAL };
}
