// Building blocks for lesson scenes: colors, labels, balls, arrows, lines, sliders, buttons, readouts.
import * as THREE from 'three';

export const COLORS = {
  red: '#ef4444',
  green: '#22c55e',
  blue: '#3b82f6',
  yellow: '#facc15',
  orange: '#f97316',
  purple: '#a855f7',
  gray: '#9aa0ab',
  white: '#e5e7eb',
};

// A text label that always faces the camera and draws on top of everything.
export function label(text: string, color: string) {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d')!;
  const font = '600 44px system-ui, sans-serif';
  context.font = font;
  canvas.width = Math.ceil(context.measureText(text).width) + 16;
  canvas.height = 64;
  context.font = font; // resizing the canvas resets the context
  context.fillStyle = color;
  context.textBaseline = 'middle';
  context.fillText(text, 8, 32);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: texture, depthTest: false }));
  sprite.scale.set((canvas.width / canvas.height) * 0.32, 0.32, 1);
  sprite.renderOrder = 1;
  return sprite;
}

// Add to a position to float a label just above the thing it names.
export const LABEL_LIFT = new THREE.Vector3(0, 0.45, 0);

// A cone whose tip points along +Z, the side `lookAt` turns toward its target. Use it for
// anything that aims: turrets, cameras, spotlights.
export function pointer(color: string, size = 1) {
  return new THREE.Mesh(
    new THREE.ConeGeometry(0.22 * size, 0.8 * size, 24).rotateX(Math.PI / 2),
    new THREE.MeshStandardMaterial({ color }),
  );
}

export function ball(color: string, opacity = 1, radius = 0.16) {
  return new THREE.Mesh(
    new THREE.SphereGeometry(radius),
    new THREE.MeshStandardMaterial({ color, transparent: opacity < 1, opacity }),
  );
}

export function arrow(color: string) {
  return new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0), new THREE.Vector3(), 1, color);
}

const direction = new THREE.Vector3();

// Re-aims an arrow to draw `vector` starting at `from`. A vector with no length hides the arrow.
export function setArrow(helper: THREE.ArrowHelper, from: THREE.Vector3, vector: THREE.Vector3) {
  const length = vector.length();
  helper.visible = length > 1e-6;
  if (!helper.visible) return;
  helper.position.copy(from);
  helper.setDirection(direction.copy(vector).divideScalar(length));
  const head = Math.min(0.25, length * 0.4);
  helper.setLength(length, head, head * 0.6);
}

export function line(color: string, opacity = 1) {
  const result = new THREE.Line(
    new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), new THREE.Vector3()]),
    new THREE.LineBasicMaterial({ color, transparent: opacity < 1, opacity }),
  );
  result.frustumCulled = false; // its end points move, so its stored bounds go stale
  return result;
}

export function setLine(target: THREE.Line, start: THREE.Vector3, end: THREE.Vector3) {
  target.geometry.setFromPoints([start, end]);
}

// A shape's edges drawn as lines. Added as a child of a mesh, it takes on every move, turn,
// stretch, and skew; on its own, it marks where a saved transform puts something.
export function outline(geometry: THREE.BufferGeometry, color: string) {
  return new THREE.LineSegments(new THREE.EdgesGeometry(geometry), new THREE.LineBasicMaterial({ color }));
}

const edgeX = new THREE.Vector3();
const edgeY = new THREE.Vector3();

// The angle between an object's own X and Y edges once it's in the world: 90° unless a stretched
// parent has skewed it.
export function cornerAngle(matrixWorld: THREE.Matrix4) {
  edgeX.set(1, 0, 0).transformDirection(matrixWorld);
  edgeY.set(0, 1, 0).transformDirection(matrixWorld);
  return THREE.MathUtils.radToDeg(edgeX.angleTo(edgeY));
}

export function overlay(container: HTMLElement, className: 'readout' | 'controls') {
  const element = document.createElement('div');
  element.className = className;
  container.append(element);
  return element;
}

interface SliderOptions {
  min: number;
  max: number;
  step: number;
  value: number;
}

export function slider(parent: HTMLElement, text: string, options: SliderOptions, onInput: (value: number) => void) {
  const wrapper = document.createElement('label');
  wrapper.innerHTML = `${text} <input type="range" min="${options.min}" max="${options.max}" step="${options.step}" value="${options.value}">`;
  const input = wrapper.querySelector('input')!;
  input.addEventListener('input', () => onInput(Number(input.value)));
  parent.append(wrapper);
}

// A row of buttons where exactly one is selected. The first starts selected.
export function choiceButtons(parent: HTMLElement, choices: { html: string; select: () => void }[]) {
  const buttons = choices.map((choice) => {
    const button = document.createElement('button');
    button.innerHTML = choice.html;
    button.addEventListener('click', () => {
      for (const other of buttons) other.setAttribute('aria-pressed', String(other === button));
      choice.select();
    });
    parent.append(button);
    return button;
  });
  buttons[0].click();
}

// A pointer event's spot in NDC: −1 to 1 across the canvas, with y pointing up. Measured against
// the canvas's own rect, not the window, since the canvas sits inside the page.
export function pointerToNdc(event: PointerEvent, canvas: HTMLElement, target = new THREE.Vector2()) {
  const rect = canvas.getBoundingClientRect();
  return target.set(((event.clientX - rect.left) / rect.width) * 2 - 1, -((event.clientY - rect.top) / rect.height) * 2 + 1);
}

export const formatNumber = (n: number, digits = 2) => String(+n.toFixed(digits));

export const formatVector = (v: THREE.Vector3, digits = 1) =>
  `(${formatNumber(v.x, digits)}, ${formatNumber(v.y, digits)}, ${formatNumber(v.z, digits)})`;

// Draws a second camera inside a scene: gives it a small body with its lens on its −Z side, the way
// a camera looks, and returns a CameraHelper outlining what it can see. Add the camera and the
// helper to the scene. After changing the camera's fov, aspect, near, far, or box, call
// camera.updateProjectionMatrix() and then helper.update().
export function showCamera(camera: THREE.PerspectiveCamera | THREE.OrthographicCamera) {
  const body = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.24, 0.22), new THREE.MeshStandardMaterial({ color: COLORS.gray }));
  body.position.z = 0.16;
  const lens = new THREE.Mesh(
    new THREE.CylinderGeometry(0.07, 0.09, 0.1, 24).rotateX(Math.PI / 2),
    new THREE.MeshStandardMaterial({ color: '#4b5563' }),
  );
  camera.add(body, lens);
  const helper = new THREE.CameraHelper(camera);
  const lines = new THREE.Color(COLORS.gray);
  helper.setColors(lines, lines, lines, lines, new THREE.Color('#4b5563'));
  return helper;
}

// Shows what a second camera sees, as a picture in the top-right corner of the scene. Each frame it
// renders `subject` into a render target and shows that on a panel riding just in front of the
// viewing camera. The subject's own children and anything in `hide` (such as its CameraHelper) are
// left out of the picture. setSize sets the picture's size in pixels, and the panel takes its
// shape; setSubject switches to showing another camera. Register onFrame callbacks that move the
// subject before calling this, so the picture isn't a frame behind.
export function cameraView(
  harness: {
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    onFrame(callback: (delta: number, elapsed: number) => void): void;
  },
  subject: THREE.Camera,
  hide: THREE.Object3D[] = [],
) {
  const { scene, camera, renderer, onFrame } = harness;
  let current = subject;
  const target = new THREE.WebGLRenderTarget(1, 1, { samples: 4, type: THREE.HalfFloatType });
  // Transparent with a high renderOrder, so it draws after everything else, labels included.
  const panel = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 1),
    new THREE.MeshBasicMaterial({ map: target.texture, depthTest: false, transparent: true }),
  );
  panel.renderOrder = 10;
  const frame = new THREE.LineSegments(
    new THREE.EdgesGeometry(new THREE.PlaneGeometry(1, 1)),
    new THREE.LineBasicMaterial({ color: COLORS.gray, depthTest: false, transparent: true }),
  );
  frame.renderOrder = 11;
  panel.add(frame);
  camera.add(panel);
  scene.add(camera); // the viewing camera has to be in the scene for the panel to draw

  const size = new THREE.Vector2();
  const setSize = (width: number, height: number) => {
    size.set(width, height);
    target.setSize(width, height);
  };
  setSize(480, 320);

  const DISTANCE = 1; // in front of the viewing camera, well past its near plane
  onFrame(() => {
    const viewHeight = 2 * DISTANCE * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
    const viewWidth = viewHeight * camera.aspect;
    let height = viewHeight * 0.42;
    let width = (height * size.x) / size.y;
    if (width > viewWidth * 0.45) {
      width = viewWidth * 0.45;
      height = (width * size.y) / size.x;
    }
    const margin = viewHeight * 0.03;
    panel.scale.set(width, height, 1);
    panel.position.set(viewWidth / 2 - width / 2 - margin, viewHeight / 2 - height / 2 - margin, -DISTANCE);

    const hidden = [panel, ...current.children, ...hide];
    const wasVisible = hidden.map((object) => object.visible);
    for (const object of hidden) object.visible = false;
    renderer.setRenderTarget(target);
    renderer.render(scene, current);
    renderer.setRenderTarget(null);
    hidden.forEach((object, i) => (object.visible = wasVisible[i]));
  });

  const setSubject = (other: THREE.Camera) => {
    current = other;
  };
  return { target, panel, setSize, setSubject };
}

// An HTML tag pinned over a scene, like the labels an app pins to 3D points: a dot on the spot and
// the text just above it. Place it by setting style.left and style.top in CSS pixels, measured
// from the canvas's top-left corner.
export function screenTag(container: HTMLElement, text: string, color: string) {
  const tag = document.createElement('div');
  tag.style.cssText = 'position: absolute; left: 0; top: 0; pointer-events: none;';
  const dot = document.createElement('div');
  dot.style.cssText = `position: absolute; left: -4px; top: -4px; width: 8px; height: 8px; border-radius: 50%; background: ${color};`;
  const words = document.createElement('div');
  words.textContent = text;
  words.style.cssText =
    `position: absolute; left: 0; bottom: 8px; transform: translateX(-50%); padding: 1px 6px; border-radius: 4px; ` +
    `background: rgba(21, 23, 28, 0.85); color: ${color}; font: 600 12px system-ui, sans-serif; white-space: nowrap;`;
  tag.append(dot, words);
  container.append(tag);
  return tag;
}

// Puts a loaded model on display. Brad's models sit wherever they sat in Blender, at real-world
// size, so this wraps the model in a group, shifts it so the middle of its bottom sits at the
// group's origin, and scales the group so the model's largest side is `size`. The model's own
// position, rotation, and scale inside the group are left alone. Returns the group.
export function fitModel(model: THREE.Object3D, size: number, at = new THREE.Vector3()) {
  const holder = new THREE.Group();
  holder.add(model);
  holder.updateMatrixWorld(true);
  const box = new THREE.Box3().setFromObject(model, true);
  const extent = box.getSize(new THREE.Vector3());
  model.position.x -= (box.min.x + box.max.x) / 2;
  model.position.y -= box.min.y;
  model.position.z -= (box.min.z + box.max.z) / 2;
  holder.scale.setScalar(size / Math.max(extent.x, extent.y, extent.z));
  holder.position.copy(at);
  return holder;
}

// Every geometry, material, and texture the meshes under `object` use, each counted once, however
// many meshes share it.
export function collectResources(object: THREE.Object3D) {
  const geometries = new Set<THREE.BufferGeometry>();
  const materials = new Set<THREE.Material>();
  const textures = new Set<THREE.Texture>();
  object.traverse((child) => {
    if (!(child instanceof THREE.Mesh)) return;
    geometries.add(child.geometry);
    for (const material of Array.isArray(child.material) ? child.material : [child.material]) materials.add(material);
  });
  for (const material of materials) {
    for (const value of Object.values(material)) if (value instanceof THREE.Texture) textures.add(value);
  }
  return { geometries, materials, textures };
}

// The bytes a geometry's arrays hold: every attribute plus the index, each array counted once even
// when attributes share it. Uploading copies these same arrays to the GPU.
export function geometryBytes(geometry: THREE.BufferGeometry) {
  const arrays = new Set<ArrayBufferView>();
  if (geometry.index) arrays.add(geometry.index.array);
  for (const attribute of Object.values(geometry.attributes)) arrays.add(attribute.array);
  let bytes = 0;
  for (const array of arrays) bytes += array.byteLength;
  return bytes;
}

// Bytes as KB or MB, counted in thousands the way file sizes are usually shown.
export const formatBytes = (bytes: number) =>
  bytes >= 1e6 ? `${formatNumber(bytes / 1e6, 1)} MB` : `${formatNumber(bytes / 1e3, 1)} KB`;

// A small ship for rotation scenes: its nose points along +Z (the side `lookAt` turns toward its
// target), its wings run along X, and a fin sticks up along +Y, so every turn shows, roll included.
// A lower opacity makes a see-through ghost, for showing a start, an end, or a second answer.
export function ship(color: string, opacity = 1) {
  const transparent = opacity < 1;
  const body = new THREE.MeshStandardMaterial({ color, transparent, opacity, depthWrite: !transparent });
  const trim = new THREE.MeshStandardMaterial({ color: COLORS.white, transparent, opacity, depthWrite: !transparent });
  const group = new THREE.Group();
  const hull = new THREE.Mesh(new THREE.ConeGeometry(0.16, 1, 24).rotateX(Math.PI / 2), body);
  const wings = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.03, 0.28), trim);
  wings.position.z = -0.15;
  const fin = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.32, 0.26), body);
  fin.position.set(0, 0.17, -0.32);
  group.add(hull, wings, fin);
  return group;
}

// Lighting for scenes where shading is the point: dims the harness's sky light to `sky` and adds a
// directional light (the sun) shining from `position` toward the origin. Returns the sun.
export function sunlight(scene: THREE.Scene, position: THREE.Vector3, sky = 0.3, intensity = 2.8) {
  const hemisphere = scene.children.find((child): child is THREE.HemisphereLight => child instanceof THREE.HemisphereLight);
  if (hemisphere) hemisphere.intensity = sky;
  const sun = new THREE.DirectionalLight(0xffffff, intensity);
  sun.position.copy(position);
  scene.add(sun);
  return sun;
}

// For scenes that change something and then report what the render after it did, such as how many
// textures it uploaded. Pass the scene's onFrame once; the function it returns takes a callback and
// runs it two frames later, once a render has drawn the change. (onFrame callbacks run before each
// render, so the first frame's render is the one that draws it.)
export function afterNextRender(onFrame: (callback: () => void) => void) {
  const waiting: { frames: number; done: () => void }[] = [];
  onFrame(() => {
    for (const item of [...waiting]) {
      if (--item.frames > 0) continue;
      waiting.splice(waiting.indexOf(item), 1);
      item.done();
    }
  });
  return (done: () => void) => waiting.push({ frames: 2, done });
}

// Boxes around objects, for scenes that point at what some code found. mark() adds a BoxHelper
// around each object, measured where it is now, hidden objects included; clear() removes them all.
// The boxes don't follow objects that move afterwards: clear and mark again.
export function boxMarkers(scene: THREE.Scene) {
  const boxes: THREE.BoxHelper[] = [];
  const clear = () => {
    for (const box of boxes) {
      scene.remove(box);
      box.dispose();
    }
    boxes.length = 0;
  };
  const mark = (objects: THREE.Object3D[], color: string = COLORS.yellow) => {
    for (const object of objects) {
      const box = new THREE.BoxHelper(object, color);
      boxes.push(box);
      scene.add(box);
    }
  };
  return { mark, clear };
}

// A labeled group inside a controls bar, so one bar can hold two separate rows of choiceButtons.
// Pass the group to choiceButtons in place of the bar.
export function buttonGroup(bar: HTMLElement, text = '') {
  const group = document.createElement('span');
  group.style.cssText = 'display: flex; flex-wrap: wrap; align-items: center; gap: 8px;';
  if (text) group.append(text);
  bar.append(group);
  return group;
}

// A pointer for scenes that react to the mouse, which two sliders can also drive (for touch
// screens, and for checks that click from code). It marks the spot with a ring and calls `onMove`
// with a pointer event there: the real one when the mouse moves over the canvas, or one made up at
// the sliders' spot. The sliders set the spot as a fraction of the canvas, across from the left and
// down from the top. Calls `onMove` once at the start spot. Returns `fire`, which calls `onMove`
// again at the current spot, for when the page has scrolled or the canvas has moved.
export function pointerSpot(
  container: HTMLElement,
  canvas: HTMLElement,
  controlsBar: HTMLElement,
  onMove: (event: PointerEvent) => void,
  start = { across: 0.6, down: 0.6 },
) {
  const spot = { ...start };
  const ring = document.createElement('div');
  ring.style.cssText =
    'position: absolute; width: 14px; height: 14px; margin: -9px 0 0 -9px; border: 2px solid #e5e7eb; ' +
    'border-radius: 50%; pointer-events: none;';
  container.append(ring);

  const inputs = (['across', 'down'] as const).map((key) => {
    const wrapper = document.createElement('label');
    wrapper.innerHTML = `Pointer ${key} <input type="range" min="0" max="1" step="0.01" value="${spot[key]}">`;
    const input = wrapper.querySelector('input')!;
    input.addEventListener('input', () => {
      spot[key] = Number(input.value);
      fire();
    });
    controlsBar.append(wrapper);
    return input;
  });

  const place = () => {
    ring.style.left = `${spot.across * 100}%`;
    ring.style.top = `${spot.down * 100}%`;
  };
  function fire() {
    place();
    const rect = canvas.getBoundingClientRect();
    onMove(
      new PointerEvent('pointermove', {
        clientX: rect.left + spot.across * rect.width,
        clientY: rect.top + spot.down * rect.height,
      }),
    );
  }
  canvas.addEventListener('pointermove', (event) => {
    const rect = canvas.getBoundingClientRect();
    spot.across = (event.clientX - rect.left) / rect.width;
    spot.down = (event.clientY - rect.top) / rect.height;
    inputs[0].value = String(spot.across);
    inputs[1].value = String(spot.down);
    place();
    onMove(event);
  });
  fire();
  return fire;
}

// For scenes that draw each frame themselves, through an EffectComposer or a render target, instead
// of leaving it to the harness. Moves everything in the harness's scene (the grid, the axes, the sky
// light) and its background into a new scene and returns it: add objects to that one, and draw it
// from an onFrame callback. The harness still calls renderer.render(scene, camera) after the
// callbacks, but with that scene empty, no background, and autoClear off, the call draws nothing and
// clears nothing, so what the callback drew stays on screen. Drawing the returned scene still clears
// first, because it has a background. The harness's call does reset renderer.info, so read the
// counts in the same callback, right after drawing.
export function drawYourself(harness: { scene: THREE.Scene; renderer: THREE.WebGLRenderer }) {
  const { scene, renderer } = harness;
  const world = new THREE.Scene();
  world.background = scene.background;
  scene.background = null;
  for (const child of [...scene.children]) world.add(child);
  renderer.autoClear = false;
  return world;
}

// A drag for scenes that move things with the pointer, which a slider can also replay (for touch
// screens, and for checks that click from code). Pressing on the canvas calls `down` with the
// pointer in NDC; if it returns true, the drag is on: the orbit controls switch off, the canvas
// captures the pointer, and `move` runs on every pointer move until the release, when `up` runs and
// the orbit comes back. The optional slider replays one drag along `path`, which gives the pointer's
// spot for t from 0 to 1 as fractions of the canvas, across from the left and down from the top:
// each change calls `reset`, then `down` at path(0), `move` at path(t), and `up`, and a ring marks
// the spot. Returns `replay(t)`, which does the same from code.
export function pointerDrag(
  harness: { container: HTMLElement; renderer: THREE.WebGLRenderer; controls: { enabled: boolean } },
  handlers: { down(ndc: THREE.Vector2): boolean; move(ndc: THREE.Vector2): void; up?(): void; reset?(): void },
  replaySlider?: { bar: HTMLElement; text: string; path(t: number): { across: number; down: number } },
) {
  const { container, renderer, controls } = harness;
  const canvas = renderer.domElement;
  const ndc = new THREE.Vector2();
  let dragging = false;

  canvas.addEventListener('pointerdown', (event) => {
    if (event.button !== 0 || !handlers.down(pointerToNdc(event, canvas, ndc))) return;
    dragging = true;
    controls.enabled = false;
    canvas.setPointerCapture(event.pointerId);
  });
  canvas.addEventListener('pointermove', (event) => {
    if (dragging) handlers.move(pointerToNdc(event, canvas, ndc));
  });
  const release = () => {
    if (!dragging) return;
    dragging = false;
    controls.enabled = true;
    handlers.up?.();
  };
  canvas.addEventListener('pointerup', release);
  canvas.addEventListener('pointercancel', release);

  const ring = document.createElement('div');
  ring.style.cssText =
    'position: absolute; width: 14px; height: 14px; margin: -9px 0 0 -9px; border: 2px solid #e5e7eb; ' +
    'border-radius: 50%; pointer-events: none;';
  const toNdc = (spot: { across: number; down: number }) => ndc.set(spot.across * 2 - 1, 1 - spot.down * 2);
  const replay = (t: number) => {
    if (!replaySlider) return;
    handlers.reset?.();
    const start = replaySlider.path(0);
    if (handlers.down(toNdc(start))) {
      handlers.move(toNdc(replaySlider.path(t)));
      handlers.up?.();
    }
    const spot = replaySlider.path(t);
    ring.style.left = `${spot.across * 100}%`;
    ring.style.top = `${spot.down * 100}%`;
  };
  if (replaySlider) {
    container.append(ring);
    slider(replaySlider.bar, replaySlider.text, { min: 0, max: 1, step: 0.01, value: 0 }, replay);
    const start = replaySlider.path(0);
    ring.style.left = `${start.across * 100}%`;
    ring.style.top = `${start.down * 100}%`;
  }
  return { replay };
}

// The WebGL calls a scene's renderer makes, counted by wrapping the methods on its WebGL context, the
// way frame-capture tools do: program switches (useProgram), uniform uploads (every uniform…
// method), texture binds, vertex-buffer binds (bindVertexArray), other state settings (enable,
// depthMask, blendFunc, and so on), and draws. `counts` totals each kind, and `log` lists the calls
// by name, in order. The harness renders after the onFrame callbacks, so read them in a callback to
// see the last frame, then call reset() to start counting the next one.
export function glCalls(renderer: THREE.WebGLRenderer) {
  const gl = renderer.getContext() as unknown as Record<string, unknown>;
  const counts = { programs: 0, uniforms: 0, textures: 0, buffers: 0, state: 0, draws: 0 };
  const log: string[] = [];
  const kinds: Record<string, keyof typeof counts> = {
    useProgram: 'programs',
    bindTexture: 'textures',
    bindVertexArray: 'buffers',
    drawArrays: 'draws',
    drawElements: 'draws',
    drawArraysInstanced: 'draws',
    drawElementsInstanced: 'draws',
  };
  const stateCalls = ['enable', 'disable', 'depthMask', 'depthFunc', 'colorMask', 'cullFace', 'frontFace'];
  stateCalls.push('blendFunc', 'blendFuncSeparate', 'blendEquation', 'blendEquationSeparate', 'polygonOffset');
  stateCalls.push('stencilFunc', 'stencilOp', 'stencilMask');
  for (const name of stateCalls) kinds[name] = 'state';
  for (const name in gl) {
    if (name.startsWith('uniform') && name !== 'uniformBlockBinding') kinds[name] = 'uniforms';
  }
  for (const [name, kind] of Object.entries(kinds)) {
    const original = gl[name];
    if (typeof original !== 'function') continue;
    gl[name] = (...args: unknown[]) => {
      counts[kind] += 1;
      if (log.length < 50000) log.push(name);
      return original.apply(gl, args);
    };
  }
  const reset = () => {
    for (const kind of Object.keys(counts) as (keyof typeof counts)[]) counts[kind] = 0;
    log.length = 0;
  };
  return { counts, log, reset };
}

// A studio-like room for shiny and physically based materials to reflect and be lit by, with no
// image file: three.js's RoomEnvironment (a room with a few bright panels, built in code),
// prefiltered by PMREMGenerator so rougher surfaces get blurrier reflections. Returns the texture:
// set it as scene.environment, and as scene.background too when the room itself should show.
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

export function roomEnvironment(renderer: THREE.WebGLRenderer, blur = 0.04) {
  const pmrem = new THREE.PMREMGenerator(renderer);
  const room = new RoomEnvironment();
  const texture = pmrem.fromScene(room, blur).texture;
  room.dispose();
  pmrem.dispose();
  return texture;
}
