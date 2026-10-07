// The model audit the page shows and runs: for one mesh, its triangles, whether it has UVs, whether
// it's flat-shaded, whether it's closed, and whether the file tags it as a gem.
import * as THREE from 'three';
import { mergeVertices } from 'three/addons/utils/BufferGeometryUtils.js';

export interface MeshAudit {
  triangles: number;
  hasUVs: boolean;
  flatShaded: boolean; // every corner's normal is within 2° of its own triangle's facing
  closed: boolean; // no edge belongs to only one triangle, once corners at the same spot are joined
  gem: boolean; // iJewel's tag: a WEBGI_materials_diamond extension on the material
}

const FLAT = Math.cos(THREE.MathUtils.degToRad(2));

export function auditMesh(mesh: THREE.Mesh): MeshAudit {
  const geometry = mesh.geometry;
  const position = geometry.getAttribute('position');
  const normal = geometry.getAttribute('normal');
  const index = geometry.index;
  const corner = (i: number) => (index ? index.getX(i) : i);
  const triangles = (index ? index.count : position.count) / 3;

  // Flat-shaded: each triangle's own facing, against what each of its corners' normals says.
  const a = new THREE.Vector3();
  const b = new THREE.Vector3();
  const c = new THREE.Vector3();
  const facing = new THREE.Vector3();
  const cornerNormal = new THREE.Vector3();
  let flatShaded = Boolean(normal);
  for (let t = 0; t < triangles && flatShaded; t++) {
    const corners = [corner(3 * t), corner(3 * t + 1), corner(3 * t + 2)];
    a.fromBufferAttribute(position, corners[0]);
    b.fromBufferAttribute(position, corners[1]);
    c.fromBufferAttribute(position, corners[2]);
    THREE.Triangle.getNormal(a, b, c, facing);
    for (const i of corners) {
      if (cornerNormal.fromBufferAttribute(normal, i).normalize().dot(facing) < FLAT) flatShaded = false;
    }
  }

  // Closed: join corners at the same spot (on a copy holding only `position`), then count how many
  // triangles use each edge. An edge only one triangle uses is the rim of a hole.
  const shape = new THREE.BufferGeometry().setAttribute('position', position);
  if (index) shape.setIndex(index);
  const welded = mergeVertices(shape);
  const edges = new Map<string, number>();
  for (let t = 0; t < welded.index!.count / 3; t++) {
    const [p, q, r] = [0, 1, 2].map((k) => welded.index!.getX(3 * t + k));
    for (const [from, to] of [[p, q], [q, r], [r, p]]) {
      const key = from < to ? `${from}_${to}` : `${to}_${from}`;
      edges.set(key, (edges.get(key) ?? 0) + 1);
    }
  }
  const closed = [...edges.values()].every((count) => count !== 1);
  welded.dispose();

  // The gem tag: GLTFLoader keeps extensions it doesn't know in userData.gltfExtensions.
  const material = mesh.material as THREE.Material;
  const gem = Boolean(material.userData.gltfExtensions?.WEBGI_materials_diamond);

  return { triangles, hasUVs: Boolean(geometry.getAttribute('uv')), flatShaded, closed, gem };
}
