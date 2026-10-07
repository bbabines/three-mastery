import { buttonGroup, choiceButtons, COLORS, fitModel, hideFloorHelpers, label, overlay, slider } from '@harness/lesson';
import { gltfLoader } from '@harness/models';
import type { PageTool, SceneSetup } from '@harness/scene';
import { onLeave } from '@harness/teardown';
import * as THREE from 'three';
import { mergeVertices } from 'three/addons/utils/BufferGeometryUtils.js';
import { environment, isGem, jewelryStage, loadSpring, MISSING_REFERENCE, mirrorStandIn } from '../shared';
import { auditMesh, type MeshAudit } from './audit';

const count = (n: number) => n.toLocaleString('en-US');
const trianglesOf = (geometry: THREE.BufferGeometry) => (geometry.index ?? geometry.getAttribute('position')).count / 3;

// Calls `ready` once the page's assets have loaded, unless the page was left first. Shows the
// missing-files note in the readout when the reference files aren't on this machine.
function whenLoaded<T>(container: HTMLElement, readout: HTMLElement, load: Promise<T>, ready: (value: T) => void) {
  let left = false;
  onLeave(container, () => {
    left = true;
  });
  readout.textContent = 'Loading…';
  load.then(
    (value) => {
      if (!left) ready(value);
    },
    () => {
      readout.textContent = MISSING_REFERENCE;
    },
  );
}

// Evidence: the whole brooch, with buttons that show one kind of part at a time.
export const inventory: SceneSetup = (harness) => {
  const { scene, camera, controls, container, renderer } = harness;
  jewelryStage(harness);
  // From above and in front, like the playground's opening view: the flowers and butterfly face up.
  camera.position.set(-0.8, 5, -2.2);
  controls.target.set(0, 2.1, 0);
  const readout = overlay(container, 'readout');
  const bar = overlay(container, 'controls');

  whenLoaded(container, readout, Promise.all([loadSpring(), environment(renderer, 'metal')]), ([gltf, env]) => {
    scene.environment = env;
    const model = gltf.scene.clone(true);
    const kinds: Record<string, THREE.Mesh[]> = { gems: [], metal: [], other: [] };
    const gemMaterial = mirrorStandIn();
    const materials = new Set<THREE.MeshStandardMaterial>([gemMaterial]);
    model.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return;
      if (isGem(child)) {
        child.material = gemMaterial;
        kinds.gems.push(child);
        return;
      }
      child.material = (child.material as THREE.MeshStandardMaterial).clone(); // so wireframe stays on this page
      materials.add(child.material);
      kinds[child.material.metalness >= 0.99 ? 'metal' : 'other'].push(child);
    });
    scene.add(fitModel(model, 3));
    const all = Object.values(kinds).flat();
    const total = all.reduce((sum, mesh) => sum + trianglesOf(mesh.geometry), 0);

    const show = (name: string, meshes: THREE.Mesh[]) => {
      for (const mesh of all) mesh.visible = meshes.includes(mesh);
      const triangles = meshes.reduce((sum, mesh) => sum + trianglesOf(mesh.geometry), 0);
      const shapes = new Set(meshes.map((mesh) => mesh.geometry)).size;
      readout.innerHTML = [
        `showing: ${name}, ${meshes.length} of ${all.length} parts`,
        `triangles drawn: ${count(triangles)} of ${count(total)} (${Math.round((100 * triangles) / total)}%)`,
        `shapes in the file: ${shapes}`,
        name === 'gems' || name === 'everything' ? 'gems: a mirror stand-in until the gem shader unit' : '',
      ].filter(Boolean).join('<br>');
    };
    choiceButtons(buttonGroup(bar, 'show'), [
      { html: 'everything', select: () => show('everything', all) },
      { html: 'gems', select: () => show('gems', kinds.gems) },
      { html: 'metal', select: () => show('metal', kinds.metal) },
      { html: 'the rest', select: () => show('the rest', kinds.other) },
    ]);
    choiceButtons(buttonGroup(bar, 'draw'), [
      { html: 'shaded', select: () => materials.forEach((material) => (material.wireframe = false)) },
      { html: 'wireframe', select: () => materials.forEach((material) => (material.wireframe = true)) },
    ]);
  });
};

// Why it works: the same round diamond twice, as authored and with its normals smoothed.
export const facets: SceneSetup = (harness) => {
  const { scene, camera, controls, container, renderer, onFrame } = harness;
  jewelryStage(harness);
  camera.position.set(0, 1.9, 3.6);
  controls.target.set(0, 1, 0);
  const readout = overlay(container, 'readout');

  whenLoaded(container, readout, Promise.all([loadSpring(), environment(renderer, 'gem')]), ([gltf, env]) => {
    scene.environment = env;
    let source: THREE.BufferGeometry | undefined;
    gltf.scene.traverse((child) => {
      if (child instanceof THREE.Mesh && child.name === 'Brillant_1') source = child.geometry;
    });
    // iJewel's gem library stores stones thousands of units across with the table facing +Z. Center
    // it, shrink it to 0.8 across, and stand it table-up.
    const authored = source!.clone().center();
    authored.computeBoundingSphere();
    authored.scale(0.8 / authored.boundingSphere!.radius, 0.8 / authored.boundingSphere!.radius, 0.8 / authored.boundingSphere!.radius);
    authored.rotateX(-Math.PI / 2);
    const smoothed = mergeVertices(authored.clone().deleteAttribute('normal'));
    smoothed.computeVertexNormals();

    const material = mirrorStandIn();
    const stones = [authored, smoothed].map((geometry, index) => {
      const stone = new THREE.Mesh(geometry, material);
      stone.position.set(index === 0 ? -1 : 1, 1, 0);
      stone.rotation.x = 0.45;
      const tag = label(index === 0 ? 'as authored' : 'smoothed', index === 0 ? COLORS.green : COLORS.orange);
      (tag.material as THREE.SpriteMaterial).toneMapped = false;
      tag.position.set(stone.position.x, 0.35, 0); // under the stone, clear of the readout
      scene.add(stone, tag);
      return stone;
    });
    onFrame((delta) => {
      for (const stone of stones) stone.rotation.y += delta * 0.35;
    });
    readout.innerHTML = [
      `as authored: ${count(authored.getAttribute('position').count)} corners, flat facets`,
      `smoothed: mergeVertices, then computeVertexNormals: ${count(smoothed.getAttribute('position').count)} corners`,
      `both: ${count(trianglesOf(authored))} triangles, the same mirror material`,
    ].join('<br>');
  });
};

// Why it works: a ring band whose triangle count you choose, in Spring's polished rose gold.
const DETAIL: [number, number][] = [[4, 12], [6, 24], [8, 48], [12, 64], [16, 128], [32, 256], [64, 360]];

export const band: SceneSetup = (harness) => {
  const { scene, camera, controls, container, renderer, onFrame } = harness;
  jewelryStage(harness);
  camera.position.set(0, 1.4, 4.4);
  controls.target.set(0, 1.2, 0);
  const readout = overlay(container, 'readout');
  const bar = overlay(container, 'controls');

  whenLoaded(container, readout, environment(renderer, 'metal'), (env) => {
    scene.environment = env;
    // Spring's "Metal 01": its base color as stored in the file (linear), metalness 1, roughness 0.
    const gold = new THREE.MeshStandardMaterial({ metalness: 1, roughness: 0 });
    gold.color.setRGB(0.784, 0.451, 0.184);
    const ring = new THREE.Mesh(new THREE.TorusGeometry(1, 0.16), gold);
    ring.position.y = 1.2;
    scene.add(ring);
    onFrame((delta) => {
      ring.rotation.y += delta * 0.3;
    });

    const build = (level: number) => {
      const [around, along] = DETAIL[level];
      ring.geometry.dispose();
      ring.geometry = new THREE.TorusGeometry(1, 0.16, around, along);
      const triangles = trianglesOf(ring.geometry);
      readout.innerHTML = [
        `new THREE.TorusGeometry(1, 0.16, ${around}, ${along})`,
        `triangles: ${count(triangles)} (Spring's frame: 45,440)`,
        triangles < 2000
          ? 'the outline is a polygon, and reflections wobble'
          : triangles < 20000
            ? 'smooth from here, but corners show up close'
            : 'smooth: the outline and reflections hold up close',
      ].join('<br>');
    };
    slider(bar, 'detail', { min: 0, max: DETAIL.length - 1, step: 1, value: 1 }, build);
    build(1);
  });
};

// Why it works: light inside a round diamond, cut in half. The outline is the stone's surface, and
// the inside is empty; the back facets bounce the light because it hits them too steeply to leave.
const IOR = 2.42; // how strongly a diamond bends light
const TABLE = 0.57; // the flat top, as a share of the stone's width
const CROWN = 0.43 * Math.tan(THREE.MathUtils.degToRad(34.5)); // how far the table sits above the widest point
const PAVILION = Math.tan(THREE.MathUtils.degToRad(40.75)); // how far the point sits below it
type Facet = { from: THREE.Vector2; to: THREE.Vector2; hole?: boolean };

function diamondOutline(hole: boolean): Facet[] {
  const v = (x: number, y: number) => new THREE.Vector2(x, y);
  const right = v(1, 0);
  const point = v(0, -PAVILION);
  // Where the starting ray first reaches the back, so clicking "hole" changes the path right away.
  const holeStart = right.clone().lerp(point, 0.4);
  const holeEnd = right.clone().lerp(point, 0.92);
  return [
    { from: v(-TABLE, CROWN), to: v(TABLE, CROWN) },
    { from: v(TABLE, CROWN), to: right },
    { from: right, to: holeStart },
    { from: holeStart, to: holeEnd, hole },
    { from: holeEnd, to: point },
    { from: point, to: v(-1, 0) },
    { from: v(-1, 0), to: v(-TABLE, CROWN) },
  ];
}

// GLSL's refract, in 2D: the direction after crossing into a material `eta` times less dense, or
// null when the light hits too steeply to cross and reflects instead.
function refract(direction: THREE.Vector2, normal: THREE.Vector2, eta: number) {
  const cos = normal.dot(direction);
  const k = 1 - eta * eta * (1 - cos * cos);
  if (k < 0) return null;
  return direction.clone().multiplyScalar(eta).sub(normal.clone().multiplyScalar(eta * cos + Math.sqrt(k)));
}

// The nearest facet a ray hits, ignoring a missing one, with the facet's outward normal.
function nearestHit(start: THREE.Vector2, direction: THREE.Vector2, facets: Facet[]) {
  let best: { distance: number; normal: THREE.Vector2; facet: Facet } | undefined;
  for (const facet of facets) {
    if (facet.hole) continue;
    const edge = facet.to.clone().sub(facet.from);
    const across = direction.cross(edge);
    if (Math.abs(across) < 1e-9) continue;
    const toFrom = facet.from.clone().sub(start);
    const distance = toFrom.cross(edge) / across;
    const along = toFrom.cross(direction) / across;
    if (distance > 1e-6 && along >= 0 && along <= 1 && (!best || distance < best.distance)) {
      const normal = new THREE.Vector2(edge.y, -edge.x).normalize();
      if (normal.dot(facet.from.clone().add(edge.clone().multiplyScalar(0.5)).sub(new THREE.Vector2(0, -0.2))) < 0) normal.negate();
      best = { distance, normal, facet };
    }
  }
  return best;
}

export const insideRay: SceneSetup = ({ scene, camera, controls, container }) => {
  hideFloorHelpers(scene);
  camera.position.set(0, 0.95, 2.7);
  controls.target.set(0, 0.95, 0);
  controls.enableRotate = false; // a flat cut through the stone, seen straight on
  const readout = overlay(container, 'readout');
  const bar = overlay(container, 'controls');
  const holder = new THREE.Group();
  holder.position.y = 1.15;
  scene.add(holder);

  const outline = new THREE.LineSegments(new THREE.BufferGeometry(), new THREE.LineBasicMaterial({ color: COLORS.white }));
  const inside = new THREE.Line(new THREE.BufferGeometry(), new THREE.LineBasicMaterial({ color: COLORS.yellow }));
  const out = new THREE.Line(new THREE.BufferGeometry(), new THREE.LineBasicMaterial({ color: COLORS.green }));
  for (const line of [outline, inside, out]) line.frustumCulled = false; // their points change
  holder.add(outline, inside, out);

  let hole = false;
  let rayX = 0.15;
  let tilt = 0;
  const update = () => {
    const facets = diamondOutline(hole);
    outline.geometry.setFromPoints(facets.filter((facet) => !facet.hole).flatMap((facet) => [facet.from, facet.to]));

    // In from above: bend through the surface it reaches first, then bounce until it gets out.
    // A hair off the slider's value, so a ray aimed straight at the bottom point never lands exactly
    // on the corner between two facets.
    let start = new THREE.Vector2(rayX + 0.002, 1.1);
    let direction = new THREE.Vector2(Math.sin(THREE.MathUtils.degToRad(tilt)), -Math.cos(THREE.MathUtils.degToRad(tilt)));
    const path = [start.clone()];
    let ending = 'misses the stone';
    let bounces = 0;
    const entry = nearestHit(start, direction, facets);
    if (entry) {
      start = start.clone().add(direction.clone().multiplyScalar(entry.distance));
      path.push(start.clone());
      direction = refract(direction, entry.normal, 1 / IOR)!;
      ending = 'is still bouncing after 40 tries';
      for (let step = 0; step < 40; step++) {
        const hit = nearestHit(start, direction, facets);
        if (!hit) {
          ending = 'escapes through the hole: no surface there, so nothing bounces it';
          break;
        }
        start = start.clone().add(direction.clone().multiplyScalar(hit.distance));
        path.push(start.clone());
        const inward = hit.normal.clone().negate();
        const leaving = refract(direction, inward, IOR);
        if (leaving) {
          direction = leaving;
          ending = hit.facet === facets[0] || hit.facet === facets[1] || hit.facet === facets[6] ? 'comes back out the top, toward you' : 'leaks out the bottom';
          break;
        }
        direction = direction.clone().sub(inward.clone().multiplyScalar(2 * direction.dot(inward))); // too steep: bounces
        bounces++;
      }
    }
    inside.geometry.setFromPoints(path);
    out.geometry.setFromPoints([start, start.clone().add(direction.clone().multiplyScalar(1.2))]);
    readout.innerHTML = [
      `bounces off the inside of the back facets: ${bounces}`,
      `then the light ${ending}`,
    ].join('<br>');
  };

  slider(bar, 'ray start', { min: -0.5, max: 0.5, step: 0.01, value: rayX }, (value) => {
    rayX = value;
    update();
  });
  slider(bar, 'tilt', { min: -25, max: 25, step: 1, value: tilt }, (value) => {
    tilt = value;
    update();
  });
  choiceButtons(buttonGroup(bar), [
    { html: 'closed', select: () => ((hole = false), update()) },
    { html: 'hole in the back', select: () => ((hole = true), update()) },
  ]);
};

// ---- The code: the audit, run on Spring and on any .glb you pick ----

const FIELDS: [keyof MeshAudit, string][] = [
  ['triangles', 'triangles'],
  ['hasUVs', 'UVs'],
  ['flatShaded', 'flat'],
  ['closed', 'closed'],
  ['gem', 'gem'],
];
const show = (value: boolean | number) => (typeof value === 'boolean' ? (value ? 'yes' : 'no') : count(value));

// One row per kind of part: the name without its trailing number, plus the material, split further
// when the audits differ (two "clasp" parts can be different shapes).
function auditTable(root: THREE.Object3D) {
  const rows = new Map<string, { name: string; copies: number; audit: MeshAudit }>();
  let parts = 0;
  root.traverse((child) => {
    if (!(child instanceof THREE.Mesh)) return;
    parts++;
    const audit = auditMesh(child);
    const material = child.material as THREE.Material;
    const name = `${child.name.replace(/[_.]?\d+$/, '') || 'unnamed'} · ${audit.gem ? 'gem' : material.name || 'unnamed material'}`;
    const key = `${name} ${JSON.stringify(audit)}`;
    const row = rows.get(key) ?? { name, copies: 0, audit };
    row.copies++;
    rows.set(key, row);
  });
  const table = document.createElement('table');
  table.innerHTML = `<thead><tr><th>Part · material</th><th>copies</th>${FIELDS.map(([, text]) => `<th>${text}</th>`).join('')}</tr></thead>`;
  const body = table.createTBody();
  for (const row of rows.values()) {
    body.insertRow().innerHTML = `<td>${row.name}</td><td>${row.copies}</td>${FIELDS.map(([key]) => `<td>${show(row.audit[key])}</td>`).join('')}`;
  }
  const scroller = document.createElement('div');
  scroller.style.overflowX = 'auto';
  scroller.append(table);
  return { scroller, parts };
}

export const audit: PageTool = (container) => {
  const status = document.createElement('p');
  const results = document.createElement('div');
  const picker = document.createElement('label');
  picker.innerHTML = 'Audit your own model: <input type="file" accept=".glb">';
  container.append(status, results, picker);

  const run = async (name: string, load: Promise<{ scene: THREE.Object3D }>) => {
    status.textContent = `Auditing ${name}…`;
    try {
      const { scroller, parts } = auditTable((await load).scene);
      status.textContent = `${name}: ${parts} parts.`;
      results.replaceChildren(scroller);
    } catch (error) {
      status.textContent = name === 'Spring.glb' ? MISSING_REFERENCE : `${name} didn't load: ${error instanceof Error ? error.message : String(error)}`;
    }
  };
  run('Spring.glb', loadSpring());
  picker.querySelector('input')!.addEventListener('change', async (event) => {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) run(file.name, gltfLoader().parseAsync(await file.arrayBuffer(), ''));
  });
};
