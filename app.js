import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const mount = document.querySelector('#stage');
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.outputColorSpace = THREE.SRGBColorSpace;
mount.appendChild(renderer.domElement);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
camera.position.set(2.2, 3.2, 9.6);
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.07;
controls.minDistance = 4.5;
controls.maxDistance = 17;
controls.target.set(0, 0, 0);
controls.saveState();
const initialCameraPosition = camera.position.clone();
const initialCameraTarget = controls.target.clone();
const initialCameraZoom = camera.zoom;
let mobileCameraMode = false;

scene.add(new THREE.AmbientLight(0xffffff, 1.25));
const lamp = new THREE.DirectionalLight(0xffffff, 2.1);
lamp.position.set(-3, 6, 8);
scene.add(lamp);
const rim = new THREE.DirectionalLight(0x78b9ff, 1.3);
rim.position.set(3, -2, -5);
scene.add(rim);

// All teaching objects share one transform so moving the magnet also moves its field and planes.
const modelRoot = new THREE.Group();
scene.add(modelRoot);
const magnet = new THREE.Group();
modelRoot.add(magnet);
const bodyGeometry = new THREE.BoxGeometry(1.65, 0.68, 0.65);
const red = new THREE.MeshStandardMaterial({ color: 0xc63336, roughness: 0.48, metalness: 0.08 });
const blue = new THREE.MeshStandardMaterial({ color: 0x244c78, roughness: 0.48, metalness: 0.08 });
const left = new THREE.Mesh(bodyGeometry, red);
left.position.x = -0.825;
const right = new THREE.Mesh(bodyGeometry, blue);
right.position.x = 0.825;
magnet.add(left, right);

// A quiet brand mark is printed on the four long faces of the magnet.
const brandCanvas = document.createElement('canvas');
brandCanvas.width = 1024; brandCanvas.height = 256;
const brandContext = brandCanvas.getContext('2d');
brandContext.font = '700 112px "Microsoft YaHei", "PingFang SC", sans-serif';
brandContext.textAlign = 'center'; brandContext.textBaseline = 'middle';
brandContext.shadowColor = 'rgba(5, 15, 25, .55)';
brandContext.shadowBlur = 9;
brandContext.fillStyle = '#f2f6fa';
brandContext.fillText('张专注物理', 512, 132);
const brandTexture = new THREE.CanvasTexture(brandCanvas);
brandTexture.colorSpace = THREE.SRGBColorSpace;
const brandMaterial = new THREE.MeshBasicMaterial({ map: brandTexture, transparent: true, opacity: 0.58, depthWrite: false });
const brandGeometry = new THREE.PlaneGeometry(2.2, 0.48);
for (const face of [
  { position: [0, 0, 0.329], rotation: [0, 0, 0] },
  { position: [0, 0, -0.329], rotation: [0, Math.PI, 0] },
  { position: [0, 0.347, 0], rotation: [-Math.PI / 2, 0, 0] },
  { position: [0, -0.347, 0], rotation: [Math.PI / 2, 0, 0] }
]) {
  const mark = new THREE.Mesh(brandGeometry, brandMaterial);
  mark.position.set(...face.position);
  mark.rotation.set(...face.rotation);
  magnet.add(mark);
}

function textSprite(label, color) {
  const c = document.createElement('canvas'); c.width = 256; c.height = 128;
  const ctx = c.getContext('2d');
  ctx.fillStyle = 'rgba(9,25,42,.88)';
  ctx.beginPath();
  ctx.moveTo(60, 18);
  ctx.lineTo(196, 18);
  ctx.quadraticCurveTo(238, 18, 238, 60);
  ctx.lineTo(238, 68);
  ctx.quadraticCurveTo(238, 110, 196, 110);
  ctx.lineTo(60, 110);
  ctx.quadraticCurveTo(18, 110, 18, 68);
  ctx.lineTo(18, 60);
  ctx.quadraticCurveTo(18, 18, 60, 18);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = color; ctx.lineWidth = 5; ctx.stroke();
  ctx.fillStyle = '#ffffff'; ctx.font = 'bold 62px Arial';
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(label, 128, 67);
  const t = new THREE.CanvasTexture(c);
  const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: t, transparent: true, depthTest: false }));
  s.scale.set(0.52, 0.26, 1); return s;
}
const nTag = textSprite('N', '#fb7773'); nTag.position.set(-1.9, 0.53, 0.1);
const sTag = textSprite('S', '#88bdf6'); sTag.position.set(1.9, 0.53, 0.1);
modelRoot.add(nTag, sTag);

// The reference plane passes through the magnet's geometric mid-height (y = 0).
const grid = new THREE.GridHelper(9.6, 24, 0x547f96, 0x294b61);
grid.position.y = 0;
grid.material.transparent = true;
grid.material.opacity = 0.37;
grid.material.depthWrite = false;
modelRoot.add(grid);
const gridWash = new THREE.Mesh(
  new THREE.PlaneGeometry(9.6, 9.6),
  new THREE.MeshBasicMaterial({ color: 0x16435a, transparent: true, opacity: 0.045, side: THREE.DoubleSide, depthWrite: false })
);
gridWash.rotation.x = -Math.PI / 2;
gridWash.position.y = -0.003;
modelRoot.add(gridWash);
// A vertical sheet at x = 0 bisects the bar magnet into equal left and right halves.
const verticalPaper = new THREE.Group();
const paperFill = new THREE.Mesh(
  new THREE.PlaneGeometry(7.0, 6.0),
  new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.5, side: THREE.DoubleSide, depthWrite: false })
);
paperFill.rotation.y = Math.PI / 2;
verticalPaper.add(paperFill);
verticalPaper.visible = false;
modelRoot.add(verticalPaper);
const midline = new THREE.Line(
  new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, -0.75, 0), new THREE.Vector3(0, 0.75, 0)]),
  new THREE.LineDashedMaterial({ color: 0xf0f6fa, dashSize: 0.10, gapSize: 0.08, transparent: true, opacity: 0.65 })
);
midline.computeLineDistances();
modelRoot.add(midline);

const fieldGroup = new THREE.Group(); modelRoot.add(fieldGroup);
const arrowGroup = new THREE.Group(); modelRoot.add(arrowGroup);
const paperMarks = new THREE.Group(); modelRoot.add(paperMarks);
const lineMaterial = new THREE.MeshBasicMaterial({ color: 0xa9d7e4, transparent: true, opacity: 0.56, depthWrite: false });
const arrowMaterial = new THREE.MeshBasicMaterial({ color: 0xffd99b });
function symbolMaterial(symbol) {
  const canvas = document.createElement('canvas'); canvas.width = canvas.height = 128;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#102b3b'; ctx.strokeStyle = '#102b3b';
  if (symbol === 'dot') {
    ctx.beginPath(); ctx.arc(64, 64, 13, 0, Math.PI * 2); ctx.fill();
  } else {
    ctx.lineWidth = 10; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(39, 39); ctx.lineTo(89, 89);
    ctx.moveTo(89, 39); ctx.lineTo(39, 89); ctx.stroke();
  }
  const map = new THREE.CanvasTexture(canvas);
  return new THREE.SpriteMaterial({ map, transparent: true, depthTest: false, depthWrite: false });
}
const dotSymbol = symbolMaterial('dot');
const crossSymbol = symbolMaterial('cross');
let observerSide = 1;

function clearGroup(group) {
  for (const child of [...group.children]) { group.remove(child); child.geometry?.dispose(); }
}
// Outside the magnet, use the field of two opposite, softened equivalent poles.
// Each streamline follows B numerically rather than a hand-drawn arch.
const north = new THREE.Vector3(-1.65, 0, 0);
const south = new THREE.Vector3(1.65, 0, 0);
function fieldAt(p) {
  const a = p.clone().sub(north), b = p.clone().sub(south);
  const a3 = Math.pow(a.lengthSq() + 0.04, 1.5);
  const b3 = Math.pow(b.lengthSq() + 0.04, 1.5);
  return a.multiplyScalar(1 / a3).sub(b.multiplyScalar(1 / b3));
}
function direction(p) { return fieldAt(p).normalize(); }
function traceLine(start) {
  const points = [start.clone()];
  let p = start.clone();
  const h = 0.025;
  for (let i = 0; i < 900; i++) {
    const k1 = direction(p);
    const k2 = direction(p.clone().addScaledVector(k1, h / 2));
    const k3 = direction(p.clone().addScaledVector(k2, h / 2));
    const k4 = direction(p.clone().addScaledVector(k3, h));
    const next = p.clone().addScaledVector(k1, h / 6).addScaledVector(k2, h / 3)
      .addScaledVector(k3, h / 3).addScaledVector(k4, h / 6);
    // Clip at the magnet surface; the outside segment must not run through the solid.
    if (Math.abs(next.x) < 1.651 && Math.abs(next.y) < 0.34 && Math.abs(next.z) < 0.325) {
      let outside = 0, inside = 1;
      for (let step = 0; step < 10; step++) {
        const middle = (outside + inside) / 2;
        const point = p.clone().lerp(next, middle);
        if (Math.abs(point.x) < 1.651 && Math.abs(point.y) < 0.34 && Math.abs(point.z) < 0.325) inside = middle;
        else outside = middle;
      }
      points.push(p.clone().lerp(next, outside));
      break;
    }
    p = next;
    points.push(p.clone());
    if (p.length() > 8) break;
  }
  return points;
}
function addFieldLine(pts) {
  if (pts.length < 2) return;
  const curve = new THREE.CatmullRomCurve3(pts);
  const tube = new THREE.Mesh(new THREE.TubeGeometry(curve, Math.min(180, Math.max(16, pts.length)), 0.005, 5, false), lineMaterial);
  fieldGroup.add(tube);
  for (let k = 1; k < pts.length; k++) {
    if (pts[k - 1].x <= 0 && pts[k].x >= 0) {
      const fraction = -pts[k - 1].x / (pts[k].x - pts[k - 1].x);
      const hit = pts[k - 1].clone().lerp(pts[k], fraction);
      // Only intersections within the finite white sheet receive a dot or cross.
      if (Math.abs(hit.y) <= 3 && Math.abs(hit.z) <= 3.5) {
        const mark = new THREE.Sprite(dotSymbol);
        mark.position.copy(hit);
        mark.scale.set(0.30, 0.30, 1);
        mark.renderOrder = 10;
        mark.userData.fieldNormal = Math.sign(fieldAt(hit).x);
        paperMarks.add(mark);
      }
      break;
    }
  }
  const pos = curve.getPointAt(0.55);
  const tangent = curve.getTangentAt(0.55).normalize();
  const cone = new THREE.Mesh(new THREE.ConeGeometry(0.030, 0.105, 8), arrowMaterial);
  cone.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), tangent);
  cone.position.copy(pos); arrowGroup.add(cone);
}
function radialPeak(points) {
  return Math.max(...points.map(p => Math.hypot(p.y, p.z)));
}
// Place one streamline in each visible radial band. The outermost band starts
// on the N end face; the remaining bands start on a long face of the magnet.
function sideSeedX(targetPeak) {
  let nearEnd = -1.649, nearMiddle = -0.35;
  for (let i = 0; i < 13; i++) {
    const x = (nearEnd + nearMiddle) / 2;
    const peak = radialPeak(traceLine(new THREE.Vector3(x, 0, 0.335)));
    if (peak > targetPeak) nearEnd = x;
    else nearMiddle = x;
  }
  return (nearEnd + nearMiddle) / 2;
}
function rebuild() {
  clearGroup(fieldGroup); clearGroup(arrowGroup); paperMarks.clear();
  const density = Number(document.querySelector('#density').value);
  const slice = document.querySelector('#slice').checked;
  const space = document.querySelector('#space-lines').checked;
  if (!slice && !space) {
    document.querySelector('#density-value').textContent = density;
    updateVisibility();
    return;
  }
  const endRadius = 0.30;
  const outerPeak = radialPeak(traceLine(new THREE.Vector3(-1.68, 0, endRadius)));
  const count = slice ? 2 : 12;
  for (let layer = 0; layer < density; layer++) {
    const fromEnd = layer === density - 1;
    const targetPeak = 0.34 + (outerPeak - 0.34) * (layer + 1) / density;
    const x = fromEnd ? -1.68 : sideSeedX(targetPeak);
    for (let j = 0; j < count; j++) {
      const phi = slice ? Math.PI / 2 + j * Math.PI : j * 2 * Math.PI / count;
      const cos = Math.cos(phi), sin = Math.sin(phi);
      // Start just outside the rectangular long face, including diagonal views.
      const sideRadius = Math.min(0.34 / Math.max(Math.abs(cos), 1e-6), 0.325 / Math.max(Math.abs(sin), 1e-6)) + 0.01;
      const radius = fromEnd ? endRadius : sideRadius;
      const y = radius * cos, z = radius * sin;
      const pts = traceLine(new THREE.Vector3(x, y, z));
      if (fromEnd) pts.unshift(new THREE.Vector3(-1.65, y, z));
      if (pts.length >= 20) addFieldLine(pts);
    }
  }
  // The axial field points away from N and toward S; these rays continue beyond the view.
  addFieldLine([new THREE.Vector3(-1.65, 0, 0), new THREE.Vector3(-3.6, 0, 0)]);
  addFieldLine([new THREE.Vector3(3.6, 0, 0), new THREE.Vector3(1.65, 0, 0)]);
  updateVisibility();
  document.querySelector('#density-value').textContent = density;
}
function updateVisibility() {
  fieldGroup.visible = document.querySelector('#lines').checked &&
    (document.querySelector('#slice').checked || document.querySelector('#space-lines').checked);
  arrowGroup.visible = fieldGroup.visible && document.querySelector('#arrows').checked;
  verticalPaper.visible = document.querySelector('#vertical-paper').checked;
  paperMarks.visible = fieldGroup.visible && verticalPaper.visible && document.querySelector('#paper-marks').checked;
}
function updateMarkerFacing() {
  if (!paperMarks.visible) return;
  scene.updateMatrixWorld(true);
  const side = modelRoot.worldToLocal(camera.position.clone()).x;
  if (Math.abs(side) > 0.02) observerSide = Math.sign(side);
  for (const mark of paperMarks.children) {
    mark.material = mark.userData.fieldNormal * observerSide > 0 ? dotSymbol : crossSymbol;
  }
}
document.querySelector('#density').addEventListener('input', rebuild);
for (const [selected, other] of [['slice', 'space-lines'], ['space-lines', 'slice']]) {
  document.querySelector('#' + selected).addEventListener('input', event => {
    if (event.target.checked) {
      document.querySelector('#' + other).checked = false;
      document.querySelector('#lines').checked = true;
    } else if (!document.querySelector('#' + other).checked) {
      document.querySelector('#lines').checked = false;
    }
    rebuild();
  });
}
document.querySelector('#lines').addEventListener('input', event => {
  if (event.target.checked && !document.querySelector('#slice').checked &&
      !document.querySelector('#space-lines').checked) {
    document.querySelector('#slice').checked = true;
    rebuild();
  } else updateVisibility();
});
for (const id of ['arrows', 'vertical-paper', 'paper-marks']) document.querySelector('#' + id).addEventListener('input', updateVisibility);

const dragRaycaster = new THREE.Raycaster();
const dragPointer = new THREE.Vector2();
const dragPlane = new THREE.Plane();
const dragPoint = new THREE.Vector3();
let dragState = null;
function pointRayAt(event) {
  const rect = renderer.domElement.getBoundingClientRect();
  dragPointer.set(
    (event.clientX - rect.left) / rect.width * 2 - 1,
    -(event.clientY - rect.top) / rect.height * 2 + 1
  );
  camera.updateMatrixWorld();
  dragRaycaster.setFromCamera(dragPointer, camera);
}
function overMagnet(event) {
  pointRayAt(event);
  modelRoot.updateWorldMatrix(true, true);
  return dragRaycaster.intersectObjects([left, right], false).length > 0;
}
function finishMagnetDrag(event) {
  if (!dragState || (event && event.pointerId !== dragState.pointerId)) return;
  const pointerId = dragState.pointerId;
  controls.enabled = dragState.controlsEnabled;
  controls.enableDamping = dragState.dampingEnabled;
  dragState = null;
  renderer.domElement.style.cursor = '';
  if (renderer.domElement.hasPointerCapture(pointerId)) renderer.domElement.releasePointerCapture(pointerId);
  if (event) { event.preventDefault(); event.stopImmediatePropagation(); }
}
renderer.domElement.addEventListener('pointerdown', event => {
  if (event.button !== 2 || !overMagnet(event)) return;
  event.preventDefault();
  event.stopImmediatePropagation();
  const dampingEnabled = controls.enableDamping;
  controls.enableDamping = false;
  controls.update();
  pointRayAt(event);
  const center = modelRoot.getWorldPosition(new THREE.Vector3());
  const normal = camera.getWorldDirection(new THREE.Vector3());
  dragPlane.setFromNormalAndCoplanarPoint(normal, center);
  if (!dragRaycaster.ray.intersectPlane(dragPlane, dragPoint)) {
    controls.enableDamping = dampingEnabled;
    return;
  }
  dragState = {
    pointerId: event.pointerId,
    startPoint: dragPoint.clone(),
    startPosition: modelRoot.position.clone(),
    controlsEnabled: controls.enabled,
    dampingEnabled
  };
  controls.enabled = false;
  renderer.domElement.setPointerCapture(event.pointerId);
  renderer.domElement.style.cursor = 'grabbing';
}, true);
renderer.domElement.addEventListener('pointermove', event => {
  if (!dragState) {
    if (event.pointerType === 'mouse') renderer.domElement.style.cursor = overMagnet(event) ? 'move' : '';
    return;
  }
  if (event.pointerId !== dragState.pointerId) return;
  event.preventDefault();
  event.stopImmediatePropagation();
  pointRayAt(event);
  if (!dragRaycaster.ray.intersectPlane(dragPlane, dragPoint)) return;
  const parentRotation = scene.getWorldQuaternion(new THREE.Quaternion()).invert();
  const delta = dragPoint.clone().sub(dragState.startPoint).applyQuaternion(parentRotation);
  modelRoot.position.copy(dragState.startPosition).add(delta);
}, true);
renderer.domElement.addEventListener('pointerup', finishMagnetDrag, true);
renderer.domElement.addEventListener('pointercancel', finishMagnetDrag, true);
renderer.domElement.addEventListener('lostpointercapture', finishMagnetDrag, true);
renderer.domElement.addEventListener('contextmenu', event => event.preventDefault());
window.addEventListener('blur', () => finishMagnetDrag());

function setCameraView(position) {
  // Flush gesture inertia before moving the camera so a previous pan cannot shift the new view.
  const damping = controls.enableDamping;
  controls.enableDamping = false;
  controls.update();
  const center = modelRoot.getWorldPosition(new THREE.Vector3());
  controls.target.copy(center);
  camera.position.copy(center).add(new THREE.Vector3(...position));
  camera.zoom = initialCameraZoom;
  camera.updateProjectionMatrix();
  controls.update();
  controls.enableDamping = damping;
}
document.querySelectorAll('[data-view]').forEach(btn => btn.addEventListener('click', () => {
  document.querySelectorAll('[data-view]').forEach(x => x.classList.remove('active'));
  btn.classList.add('active');
  const v = btn.dataset.view;
  const target = v === 'top' ? [0, 10.6, 0.01] : v === 'side' ? [0, 0.01, 10.6] : [2.2, 3.2, 9.6];
  setCameraView(target);
}));
const resetOptionIds = ['lines', 'arrows', 'slice', 'space-lines', 'vertical-paper', 'paper-marks', 'auto'];
const initialOptions = Object.fromEntries(resetOptionIds.map(id => [id, document.querySelector('#' + id).checked]));
const initialDensity = document.querySelector('#density').value;
document.querySelector('#reset').addEventListener('click', () => {
  finishMagnetDrag();
  for (const id of resetOptionIds) document.querySelector('#' + id).checked = initialOptions[id];
  document.querySelector('#density').value = initialDensity;
  modelRoot.position.set(0, 0, 0);
  modelRoot.rotation.set(0, 0, 0);
  observerSide = 1;
  const damping = controls.enableDamping;
  controls.enableDamping = false;
  controls.reset();
  camera.position.copy(initialCameraPosition);
  controls.target.copy(initialCameraTarget);
  camera.zoom = initialCameraZoom;
  camera.updateProjectionMatrix();
  controls.update();
  controls.enableDamping = damping;
  document.querySelectorAll('[data-view]').forEach(btn => btn.classList.toggle('active', btn.dataset.view === 'free'));
  rebuild();
});

function resize() {
  const w = mount.clientWidth, h = mount.clientHeight;
  // setSize also fixes the canvas CSS size; its drawing buffer scales separately with DPR.
  renderer.setSize(w, h); camera.aspect = w / h; camera.updateProjectionMatrix();
  const mobile = matchMedia('(pointer: coarse)').matches || w <= 620;
  controls.enablePan = !mobile;
  controls.maxTargetRadius = mobile ? 0 : Infinity;
  if (mobile && !mobileCameraMode) {
    const view = document.querySelector('.viewbar .active')?.dataset.view;
    setCameraView(view === 'top' ? [0, 10.6, 0.01] : view === 'side' ? [0, 0.01, 10.6] : [2.2, 3.2, 9.6]);
  }
  mobileCameraMode = mobile;
}
if ('ResizeObserver' in window) new ResizeObserver(resize).observe(mount);
else window.addEventListener('resize', resize);
resize(); rebuild();
function animate() {
  requestAnimationFrame(animate);
  if (document.querySelector('#auto').checked && !dragState) modelRoot.rotation.y += 0.0018;
  controls.update(); updateMarkerFacing(); renderer.render(scene, camera);
}
animate();
