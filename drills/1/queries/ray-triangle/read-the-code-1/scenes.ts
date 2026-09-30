// Scenes for the ray–triangle page. The README places each one with <div data-scene="name">.
import { ball, buttonGroup, choiceButtons, COLORS, formatNumber, formatVector, label, line, outline, overlay, pointer, setLine, slider } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';

const f = (n: number) => formatNumber(n, 2);
const percent = (n: number) => `${Math.round(n * 100)}%`;

export const paintPots: SceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(-1.3, 2.2, 5);
  controls.target.set(0.2, 1.55, 0);

  // One triangle, its corners pure red, green, and blue, with UVs so hit.uv shows the same blend.
  const corners = [new THREE.Vector3(-1.6, 0.3, 0), new THREE.Vector3(1.6, 0.3, 0), new THREE.Vector3(0, 2.5, 0)];
  const geometry = new THREE.BufferGeometry().setFromPoints(corners);
  geometry.setAttribute('color', new THREE.Float32BufferAttribute([1, 0, 0, 0, 1, 0, 0, 0, 1], 3));
  geometry.setAttribute('uv', new THREE.Float32BufferAttribute([0, 0, 1, 0, 0.5, 1], 2));
  const triangle = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ vertexColors: true }));
  triangle.updateMatrixWorld(); // the first raycast comes before any render
  const cornerTags = (['a', 'b', 'c'] as const).map((name, i) => {
    const tag = label(name, [COLORS.red, COLORS.green, COLORS.blue][i]);
    tag.position.copy(corners[i]).add(new THREE.Vector3(i === 0 ? -0.25 : 0.25, i === 2 ? 0 : -0.1, 0)); // c: beside it, clear of the readout
    return tag;
  });

  const scannerAt = new THREE.Vector3(2.4, 1.7, 2.4);
  const scanner = pointer(COLORS.gray, 0.5);
  scanner.position.copy(scannerAt);
  const ray = line(COLORS.white);
  // Unlit like the triangle, so its color matches the blend, with a white rim to stand out.
  const mix = new THREE.Mesh(new THREE.SphereGeometry(0.13), new THREE.MeshBasicMaterial());
  const rim = new THREE.Mesh(new THREE.SphereGeometry(0.17),new THREE.MeshBasicMaterial({ color: COLORS.white, side: THREE.BackSide }));
  mix.add(rim);
  scene.add(triangle, ...cornerTags, scanner, ray, mix);

  const readout = overlay(container, 'readout');
  const sliders = overlay(container, 'controls');
  const raycaster = new THREE.Raycaster();
  const aim = { x: 0.3, y: 1 };
  const color = new THREE.Vector3();

  const update = () => {
    const target = new THREE.Vector3(aim.x, aim.y, 0);
    scanner.lookAt(target);
    raycaster.set(scannerAt, target.clone().sub(scannerAt).normalize());
    const hit = raycaster.intersectObject(triangle)[0];
    setLine(ray, scannerAt, hit ? hit.point : raycaster.ray.at(6, new THREE.Vector3()));
    mix.visible = !!hit;
    if (!hit) {
      readout.textContent = 'raycaster.intersectObject(triangle)\n→ [] the ray misses the triangle';
      return;
    }
    const w = hit.barycoord!;
    THREE.Triangle.getInterpolatedAttribute(geometry.attributes.color as THREE.BufferAttribute, hit.face!.a, hit.face!.b, hit.face!.c, w, color);
    mix.material.color.setRGB(color.x, color.y, color.z);
    mix.position.copy(hit.point);
    readout.textContent = [
      `hit.barycoord (${f(w.x)}, ${f(w.y)}, ${f(w.z)})   weights for a, b, c, adding up to 1`,
      `hit.uv (${f(hit.uv!.x)}, ${f(hit.uv!.y)})   the corners' UVs, blended the same way`,
      `color at the hit: ${percent(w.x)} red + ${percent(w.y)} green + ${percent(w.z)} blue`,
      `hit.point ${formatVector(hit.point, 2)}`,
    ].join('\n');
  };
  slider(sliders, 'aim across', { min: -1.8, max: 1.8, step: 0.05, value: aim.x }, (value) => {
    aim.x = value;
    update();
  });
  slider(sliders, 'aim up', { min: 0.1, max: 2.7, step: 0.05, value: aim.y }, (value) => {
    aim.y = value;
    update();
  });
  update();
};

export const backFaces: SceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(4.2, 2.3, 2.4);
  controls.target.set(0, 1.1, 0);

  const shape = new THREE.PlaneGeometry(1.6, 1.1);
  const material = new THREE.MeshStandardMaterial({ color: COLORS.orange });
  const sign = new THREE.Mesh(shape, material);
  sign.position.set(0, 1.2, 0);
  sign.updateMatrixWorld(); // the first raycast comes before any render
  const edges = outline(shape, COLORS.gray); // always drawn, so the sign shows whichever side is hidden
  edges.position.copy(sign.position);
  const frontTag = label('front', COLORS.orange);
  frontTag.position.set(0, 1.2, 0.7);
  const backTag = label('back', COLORS.gray);
  backTag.position.set(0, 1.2, -0.7);

  const scanner = pointer(COLORS.red, 0.5);
  const ray = line(COLORS.red);
  const hitMark = ball(COLORS.white, 1, 0.07);
  scene.add(sign, edges, frontTag, backTag, scanner, ray, hitMark);

  const readout = overlay(container, 'readout');
  const controlsBar = overlay(container, 'controls');
  const raycaster = new THREE.Raycaster();
  const sides = { FrontSide: THREE.FrontSide, DoubleSide: THREE.DoubleSide, BackSide: THREE.BackSide };
  let side: keyof typeof sides = 'FrontSide';
  let fromFront = true;

  const update = () => {
    material.side = sides[side];
    material.needsUpdate = true;
    const start = new THREE.Vector3(0.25, 1.35, fromFront ? 2.6 : -2.6);
    const direction = new THREE.Vector3(0, 0, fromFront ? -1 : 1);
    scanner.position.copy(start);
    scanner.lookAt(start.clone().add(direction));
    raycaster.set(start, direction);
    const hit = raycaster.intersectObject(sign)[0];
    setLine(ray, start, hit ? hit.point : start.clone().addScaledVector(direction, 5.2));
    hitMark.visible = !!hit;
    if (hit) hitMark.position.copy(hit.point);
    const why = hit ? '' : fromFront ? ': BackSide tests only the back' : ': its back is skipped';
    // What Mesh.raycast runs for each triangle, for each side.
    const test = { FrontSide: '(a, b, c, true, spot)', DoubleSide: '(a, b, c, false, spot)', BackSide: '(c, b, a, true, spot)' }[side];
    readout.textContent = [
      `sign.material.side = ${side}   ray from ${fromFront ? 'the front' : 'behind'}`,
      `raycaster.intersectObject(sign) → ${hit ? `a hit at ${formatVector(hit.point, 2)}` : `[]${why}`}`,
      `for each triangle, three.js runs ray.intersectTriangle${test}`,
    ].join('\n');
  };

  choiceButtons(buttonGroup(controlsBar), [
    {
      html: 'Ray from the front',
      select: () => {
        fromFront = true;
        update();
      },
    },
    {
      html: 'Ray from behind',
      select: () => {
        fromFront = false;
        update();
      },
    },
  ]);
  choiceButtons(
    buttonGroup(controlsBar),
    (Object.keys(sides) as (keyof typeof sides)[]).map((name) => ({
      html: `<code>${name}</code>`,
      select: () => {
        side = name;
        update();
      },
    })),
  );
};
