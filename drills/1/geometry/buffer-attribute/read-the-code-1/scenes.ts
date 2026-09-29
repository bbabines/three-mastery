// Scenes for the BufferAttribute and itemSize page. The README places each one with <div data-scene="name">.
import { ball, choiceButtons, COLORS, formatNumber, formatVector, label, overlay, slider } from '@harness/lesson';
import type { SceneSetup } from '@harness/scene';
import * as THREE from 'three';

// A zigzag ribbon of 8 vertices, standing up just behind the origin: even vertices along the
// bottom, odd ones along the top.
function ribbon() {
  const numbers: number[] = [];
  for (let i = 0; i < 8; i++) numbers.push(-1.75 + 0.5 * i, i % 2 === 0 ? 0.5 : 1.5, 0);
  const index: number[] = [];
  for (let k = 0; k < 6; k++) index.push(...(k % 2 === 0 ? [k, k + 2, k + 1] : [k, k + 1, k + 2]));
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(numbers), 3));
  geometry.setIndex(index);
  geometry.computeVertexNormals();
  return geometry;
}

export const readVertex: SceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(0.9, 1.9, 3.6);
  controls.target.set(0, 0.85, 0);

  const geometry = ribbon();
  const position = geometry.attributes.position as THREE.BufferAttribute;
  const mesh = new THREE.Mesh(
    geometry,
    new THREE.MeshStandardMaterial({ color: COLORS.blue, side: THREE.DoubleSide, transparent: true, opacity: 0.6 }),
  );
  // Every triangle's edges, so the triangles between the vertices show.
  const edges = new THREE.LineSegments(new THREE.WireframeGeometry(geometry), new THREE.LineBasicMaterial({ color: COLORS.gray }));
  scene.add(mesh, edges);

  const corner = new THREE.Vector3();
  for (let i = 0; i < position.count; i++) {
    corner.fromBufferAttribute(position, i);
    const tag = label(String(i), COLORS.white);
    tag.position.copy(corner).add(new THREE.Vector3(0, i % 2 === 0 ? -0.25 : 0.25, 0));
    scene.add(tag);
  }

  const wanted = ball(COLORS.white, 0.5, 0.12); // the vertex you picked
  const read = ball(COLORS.yellow, 1, 0.09); // where the code's three numbers put it
  scene.add(wanted, read);

  const readout = overlay(container, 'readout');
  const controlsBar = overlay(container, 'controls');
  let useGetters = true;
  let vertex = 3;

  const update = () => {
    wanted.position.fromBufferAttribute(position, vertex);
    const start = useGetters ? vertex * 3 : vertex;
    read.position.set(position.array[start], position.array[start + 1], position.array[start + 2]);

    let found = 'not any vertex';
    for (let i = 0; i < position.count; i++) {
      if (corner.fromBufferAttribute(position, i).distanceTo(read.position) < 1e-6) found = i === vertex ? `vertex ${i}` : `vertex ${i}, not ${vertex}`;
    }
    readout.textContent = [
      useGetters
        ? `new Vector3().fromBufferAttribute(position, ${vertex})`
        : `new Vector3(position.array[${vertex}], position.array[${vertex + 1}], position.array[${vertex + 2}])`,
      `reads array[${start}], [${start + 1}], [${start + 2}]  →  ${formatVector(read.position, 2)}  ${found}`,
      `position.count ${position.count}  (${position.array.length} numbers ÷ itemSize ${position.itemSize})`,
    ].join('\n');
  };

  choiceButtons(controlsBar, [
    {
      html: '<code>fromBufferAttribute(position, i)</code>',
      select: () => {
        useGetters = true;
        update();
      },
    },
    {
      html: '<code>position.array[i]</code>, <code>[i + 1]</code>, <code>[i + 2]</code>',
      select: () => {
        useGetters = false;
        update();
      },
    },
  ]);
  slider(controlsBar, 'Vertex i', { min: 0, max: 7, step: 1, value: vertex }, (value) => {
    vertex = value;
    update();
  });
};

const BASE = new THREE.Color(0.03, 0.035, 0.05); // a dark slate, so the white numbers stay readable
const HOT = new THREE.Color(COLORS.orange);

export const paint: SceneSetup = ({ scene, camera, controls, container }) => {
  camera.position.set(0, 1.4, 3.8);
  controls.target.set(0, 1.1, 0);

  // A flat panel standing up: 6 vertices across and 3 down, numbered left to right from the top.
  const geometry = new THREE.PlaneGeometry(3.5, 1.4, 5, 2);
  const position = geometry.attributes.position as THREE.BufferAttribute;
  const colors = new THREE.BufferAttribute(new Float32Array(position.count * 3), 3);
  geometry.setAttribute('color', colors);
  const panel = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ vertexColors: true }));
  panel.position.y = 0.95;
  scene.add(panel);

  const corner = new THREE.Vector3();
  for (let i = 0; i < position.count; i++) {
    const tag = label(String(i), COLORS.white);
    tag.position.copy(corner.fromBufferAttribute(position, i)).add(panel.position).add(new THREE.Vector3(0, 0.12, 0.05));
    tag.scale.multiplyScalar(0.8);
    scene.add(tag);
  }

  const readout = overlay(container, 'readout');
  const controlsBar = overlay(container, 'controls');
  let useSetter = true;
  let vertex = 8;

  const update = () => {
    for (let i = 0; i < colors.count; i++) colors.setXYZ(i, BASE.r, BASE.g, BASE.b);
    if (useSetter) {
      colors.setXYZ(vertex, HOT.r, HOT.g, HOT.b);
    } else {
      colors.array[vertex] = HOT.r;
      colors.array[vertex + 1] = HOT.g;
      colors.array[vertex + 2] = HOT.b;
    }
    colors.needsUpdate = true;

    const first = Math.floor(vertex / 3);
    const last = Math.floor((vertex + 2) / 3);
    const touched =
      useSetter || vertex === 0
        ? `vertex ${vertex}`
        : first === last
          ? `vertex ${first}, not ${vertex}`
          : `parts of vertices ${first} and ${last}, not ${vertex}`;
    readout.textContent = [
      useSetter
        ? `colors.setXYZ(${vertex}, hot.r, hot.g, hot.b)`
        : `colors.array[${vertex}] = hot.r; [${vertex + 1}] = hot.g; [${vertex + 2}] = hot.b`,
      `colors.needsUpdate = true`,
      `paints ${touched}   hot = (${formatNumber(HOT.r)}, ${formatNumber(HOT.g)}, ${formatNumber(HOT.b)})`,
      `colors.count ${colors.count}  (${colors.array.length} numbers ÷ itemSize ${colors.itemSize})`,
    ].join('\n');
  };

  choiceButtons(controlsBar, [
    {
      html: '<code>colors.setXYZ(i, …)</code>',
      select: () => {
        useSetter = true;
        update();
      },
    },
    {
      html: '<code>colors.array[i] = …</code>',
      select: () => {
        useSetter = false;
        update();
      },
    },
  ]);
  slider(controlsBar, 'Vertex i', { min: 0, max: position.count - 1, step: 1, value: vertex }, (value) => {
    vertex = value;
    update();
  });
};
