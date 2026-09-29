// Scenes for the tangent space and normal maps page. The README places each one with <div data-scene="name">.
import { arrow, choiceButtons, COLORS, formatNumber, overlay, setArrow, slider, sunlight } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';

// One map color, (0.8, 0.5, 0.9): a direction tilted toward the texture's right, the +u side.
const MAP_DIRECTION = new THREE.Vector3(0.6, 0, 0.8);
const SAMPLES = [0, 4, 8, 12, 16, 20, 24]; // vertices along the middle row of the panel

export const tbn: SceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(0.5, 1.75, 2.7);
  controls.target.set(0, 1.15, 0.35);
  sunlight(scene, new THREE.Vector3(2, 4, 4), 0.6, 1.6);

  // Half a pipe, curving from facing −X, through facing the camera, to facing +X.
  const geometry = new THREE.CylinderGeometry(0.9, 0.9, 1.2, 24, 2, true, -Math.PI / 2, Math.PI);
  geometry.computeTangents();
  const panel = new THREE.Mesh(
    geometry,
    new THREE.MeshStandardMaterial({ color: COLORS.gray, side: THREE.DoubleSide, transparent: true, opacity: 0.55 }),
  );
  panel.position.y = 1.0;
  scene.add(panel);

  const position = geometry.attributes.position;
  const normal = geometry.attributes.normal;
  const tangent = geometry.attributes.tangent;
  const rowStart = 25; // the middle row: 25 vertices around, after the top row's 25
  const markers = SAMPLES.map(() => {
    const set = { t: arrow(COLORS.red), b: arrow(COLORS.green), n: arrow(COLORS.blue), map: arrow(COLORS.yellow) };
    scene.add(set.t, set.b, set.n, set.map);
    return set;
  });

  const readout = overlay(container, 'readout');
  const controlsBar = overlay(container, 'controls');
  let inTangentSpace = true;
  let turn = 0;
  const p = new THREE.Vector3();
  const t = new THREE.Vector3();
  const b = new THREE.Vector3();
  const n = new THREE.Vector3();
  const d = new THREE.Vector3();

  const update = () => {
    panel.rotation.y = THREE.MathUtils.degToRad(turn);
    panel.updateMatrixWorld();
    SAMPLES.forEach((column, k) => {
      const i = rowStart + column;
      p.fromBufferAttribute(position, i).applyMatrix4(panel.matrixWorld);
      n.fromBufferAttribute(normal, i).transformDirection(panel.matrixWorld);
      t.fromBufferAttribute(tangent, i).transformDirection(panel.matrixWorld);
      b.crossVectors(n, t).multiplyScalar(tangent.getW(i)); // the bitangent, as three.js's shader builds it
      d.copy(inTangentSpace ? t.clone().multiplyScalar(MAP_DIRECTION.x).addScaledVector(b, MAP_DIRECTION.y).addScaledVector(n, MAP_DIRECTION.z) : MAP_DIRECTION);
      setArrow(markers[k].t, p, t.clone().multiplyScalar(0.28));
      setArrow(markers[k].b, p, b.clone().multiplyScalar(0.28));
      setArrow(markers[k].n, p, n.clone().multiplyScalar(0.28));
      setArrow(markers[k].map, p, d.clone().multiplyScalar(0.55));
    });

    readout.textContent = [
      `map color (0.8, 0.5, 0.9)  →  direction (${formatNumber(MAP_DIRECTION.x)}, ${formatNumber(MAP_DIRECTION.y)}, ${formatNumber(MAP_DIRECTION.z)})`,
      inTangentSpace
        ? 'read in tangent space: tangent × 0.6 + bitangent × 0 + normal × 0.8'
        : 'read as a world direction: (0.6, 0, 0.8), the same at every point',
      inTangentSpace
        ? 'leans the same way against the surface everywhere, however it turns'
        : 'ignores the surface: wrong everywhere except where it happens to fit',
    ].join('\n');
  };

  choiceButtons(controlsBar, [
    {
      html: 'read in tangent space',
      select: () => {
        inTangentSpace = true;
        update();
      },
    },
    {
      html: 'read as a world direction',
      select: () => {
        inTangentSpace = false;
        update();
      },
    },
  ]);
  slider(controlsBar, 'Turn panel', { min: -90, max: 90, step: 15, value: turn }, (value) => {
    turn = value;
    update();
  });
};

// A studded plate's normal map, made +Y (OpenGL style): green means up the image. Row 0 of a
// DataTexture is the bottom of the image, v = 0, so rows count upward.
function studTexture() {
  const [width, height] = [384, 256];
  const [columns, rows] = [6, 4];
  const radius = 26;
  const heightAt = (x: number, y: number) => {
    const cellW = width / columns;
    const cellH = height / rows;
    const dx = (x % cellW) - cellW / 2;
    const dy = (y % cellH) - cellH / 2;
    const d = Math.hypot(dx, dy) / radius;
    return d < 1 ? Math.cos((d * Math.PI) / 2) ** 2 : 0;
  };
  const data = new Uint8Array(width * height * 4);
  const strength = 9;
  const direction = new THREE.Vector3();
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const slopeX = (heightAt(x + 1, y) - heightAt(x - 1 + width, y)) / 2;
      const slopeY = (heightAt(x, y + 1) - heightAt(x, y - 1 + height)) / 2;
      direction.set(-slopeX * strength, -slopeY * strength, 1).normalize();
      const i = (y * width + x) * 4;
      data[i] = Math.round((direction.x * 0.5 + 0.5) * 255);
      data[i + 1] = Math.round((direction.y * 0.5 + 0.5) * 255);
      data[i + 2] = Math.round((direction.z * 0.5 + 0.5) * 255);
      data[i + 3] = 255;
    }
  }
  const texture = new THREE.DataTexture(data, width, height); // colorSpace stays NoColorSpace
  texture.magFilter = THREE.LinearFilter;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.generateMipmaps = true;
  texture.needsUpdate = true;
  return texture;
}

const LIGHT_NAMES: Record<number, string> = { 0: 'the right', 45: 'the upper right', 90: 'above', 135: 'the upper left', 180: 'the left', 225: 'the lower left', 270: 'below', 315: 'the lower right', 360: 'the right' };

export const greenChannel: SceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(0, 1.25, 2.9);
  controls.target.set(0, 1.15, 0);
  const sun = sunlight(scene, new THREE.Vector3(0, 3, 2), 0.25, 3);
  sun.target.position.set(0, 1.1, 0);
  scene.add(sun.target);

  const normalMap = studTexture();
  const material = new THREE.MeshStandardMaterial({ color: COLORS.gray, roughness: 0.45, metalness: 0.1, normalMap });
  const plate = new THREE.Mesh(new THREE.PlaneGeometry(2.4, 1.6), material);
  plate.position.y = 1.1;
  scene.add(plate);

  const readout = overlay(container, 'readout');
  const controlsBar = overlay(container, 'controls');
  let angle = 90;
  let setting = 0;
  const settings = [
    { html: '<code>normalScale.set(1, 1)</code>', code: 'material.normalScale.set(1, 1)', note: 'green read as up (+Y), as this map was made: raised studs' },
    {
      html: '<code>normalScale.set(1, -1)</code>',
      code: 'material.normalScale.set(1, -1)',
      note: 'green read as down (−Y): lit backward top to bottom, fine left to right',
    },
    { html: 'no normal map', code: 'material.normalMap = null', note: 'a flat plate: the studs were only ever in the lighting' },
  ];

  const update = () => {
    const a = THREE.MathUtils.degToRad(angle);
    sun.position.set(Math.cos(a) * 2.2, 1.1 + Math.sin(a) * 2.2, 1.6); // around the plate, a little in front
    material.normalMap = setting === 2 ? null : normalMap;
    material.normalScale.set(1, setting === 1 ? -1 : 1);
    material.needsUpdate = true; // adding or removing a map changes the shader
    readout.textContent = [settings[setting].code, `light from ${LIGHT_NAMES[angle] ?? `${angle}°`}`, settings[setting].note].join('\n');
  };

  choiceButtons(
    controlsBar,
    settings.map((item, i) => ({
      html: item.html,
      select: () => {
        setting = i;
        update();
      },
    })),
  );
  slider(controlsBar, 'Light from', { min: 0, max: 360, step: 45, value: angle }, (value) => {
    angle = value;
    update();
  });
};
