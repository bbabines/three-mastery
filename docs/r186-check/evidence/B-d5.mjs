// Domain 5 checks against three r186
import * as THREE from 'three';
const log = (k, v) => console.log(k.padEnd(48), typeof v === 'string' ? v : JSON.stringify(v));
log('REVISION', THREE.REVISION);

// BufferAttribute count and index semantics
const pos = new THREE.BufferAttribute(new Float32Array([0,0,0, 1,0,0, 0,1,0, 5,6,7]), 3);
log('count = length/itemSize', [pos.array.length, pos.itemSize, pos.count]);
log('getX(3) (vertex 3) vs array[3]', [pos.getX(3), pos.array[3]]);

// Interleaved
const ib = new THREE.InterleavedBuffer(new Float32Array([0,0,0, 0,0, 1,0,0, 1,0, 0,1,0, 0,1]), 5);
const ipos = new THREE.InterleavedBufferAttribute(ib, 3, 0);
const iuv = new THREE.InterleavedBufferAttribute(ib, 2, 3);
log('interleaved stride, pos.offset, uv.offset', [ib.stride, ipos.offset, iuv.offset]);
log('interleaved share buffer', ipos.data === iuv.data);
log('interleaved uv of vertex 1', [iuv.getX(1), iuv.getY(1)]);
log('interleaved has .array directly?', ipos.array === undefined ? 'no (.data.array)' : 'yes');

// Face normal formula vs Triangle.getNormal
const a = new THREE.Vector3(0.3,0.1,-2), b = new THREE.Vector3(2,0.5,1), c = new THREE.Vector3(-1,3,0.2);
const hand = b.clone().sub(a).cross(c.clone().sub(a)).normalize();
const tn = THREE.Triangle.getNormal(a,b,c,new THREE.Vector3());
log('normalize(cross(b-a,c-a)) == Triangle.getNormal', hand.distanceTo(tn) < 1e-9);

// computeVertexNormals is area-weighted (big tri + small tri share vertex 0)
{
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute([
    0,0,0,  10,0,0,  0,10,0,     // big tri in XY plane, normal +Z
    0,0,1,  // vertex 3
  ],3));
  // small tri sharing vertex 0 with normal +X-ish: (0,0,0),(0,1,0)... use vertices 0, 2? make tiny tri
  g.setAttribute('position', new THREE.Float32BufferAttribute([
    0,0,0, 10,0,0, 0,10,0,   0,0.1,0, 0,0,0.1 ], 3));
  g.setIndex([0,1,2, 0,3,4]); // second tri normal = +X, area tiny
  g.computeVertexNormals();
  const n0 = new THREE.Vector3().fromBufferAttribute(g.attributes.normal, 0);
  log('vertex0 normal (equal avg would be 0.707,0,0.707)', n0.toArray().map(x=>+x.toFixed(4)));
}
// non-indexed computeVertexNormals -> flat
{
  const g = new THREE.BoxGeometry().toNonIndexed(); g.deleteAttribute('normal'); g.computeVertexNormals();
  const n = new THREE.Vector3().fromBufferAttribute(g.attributes.normal, 0);
  log('non-indexed box vertex0 normal (flat)', n.toArray());
}
// indexed: one vertex => one normal
{
  const g = new THREE.BoxGeometry();
  log('BoxGeometry vertex count (24, not 8: hard edges duplicate)', g.attributes.position.count);
  const s = new THREE.SphereGeometry(1, 8, 6);
  log('SphereGeometry indexed?', s.index !== null);
}

// UV channel defaults
{
  const t = new THREE.Texture();
  log('Texture.channel default', t.channel);
  const m = new THREE.MeshStandardMaterial({ aoMap: t, lightMap: t });
  log('aoMap.channel, lightMap.channel', [m.aoMap.channel, m.lightMap.channel]);
}

// Bounding box: null, local, stale
{
  const g = new THREE.BoxGeometry(2,2,2);
  log('boundingBox before compute', g.boundingBox);
  const mesh = new THREE.Mesh(g, new THREE.MeshBasicMaterial());
  mesh.position.set(100,0,0); mesh.updateMatrixWorld();
  g.computeBoundingBox();
  log('boundingBox with mesh at x=100 (local)', [g.boundingBox.min.x, g.boundingBox.max.x]);
  g.attributes.position.setX(0, 50); g.attributes.position.needsUpdate = true;
  log('after moving vertex to x=50, box.max.x (stale)', g.boundingBox.max.x);
  g.computeBoundingBox();
  log('after recompute', g.boundingBox.max.x);
  const bs = new THREE.Box3().setFromObject(mesh);
  log('setFromObject uses cached geometry box (world)', [bs.min.x, bs.max.x]);
}

// needsUpdate bumps version; setDrawRange
{
  const g = new THREE.BoxGeometry();
  const v0 = g.attributes.position.version;
  g.attributes.position.array[0] = 9;
  log('version after direct array edit', [v0, g.attributes.position.version]);
  g.attributes.position.needsUpdate = true;
  log('version after needsUpdate', g.attributes.position.version);
  g.setDrawRange(0, 6);
  log('drawRange', g.drawRange);
  log('addUpdateRange exists', typeof g.attributes.position.addUpdateRange);
}

// Groups and raycast materialIndex
{
  const g = new THREE.BoxGeometry(2,2,2);
  log('BoxGeometry groups', g.groups.length);
  const mats = Array.from({length:6}, () => new THREE.MeshBasicMaterial());
  const mesh = new THREE.Mesh(g, mats); mesh.updateMatrixWorld();
  const rc = new THREE.Raycaster(new THREE.Vector3(0,0,10), new THREE.Vector3(0,0,-1));
  const hits = rc.intersectObject(mesh);
  log('hit face.materialIndex (+Z face = group 4)', hits[0].face.materialIndex);
  const mesh1 = new THREE.Mesh(g, new THREE.MeshBasicMaterial()); mesh1.updateMatrixWorld();
  log('single material: materialIndex reported', rc.intersectObject(mesh1)[0].face.materialIndex);
  // non-indexed groups are vertex ranges
  const ni = g.toNonIndexed();
  log('toNonIndexed keeps groups (vertex ranges)', ni.groups.slice(0,2));
}

// InstancedMesh
{
  const im = new THREE.InstancedMesh(new THREE.BoxGeometry(), new THREE.MeshBasicMaterial(), 3);
  const m = new THREE.Matrix4();
  for (let i=0;i<3;i++){ m.makeTranslation(i*3,0,0); im.setMatrixAt(i,m); }
  im.setColorAt(1, new THREE.Color(1,0,0));
  im.updateMatrixWorld();
  const rc = new THREE.Raycaster(new THREE.Vector3(6,0,10), new THREE.Vector3(0,0,-1));
  const h = rc.intersectObject(im);
  log('InstancedMesh hit instanceId', h[0].instanceId);
  log('instanceColor created by setColorAt', im.instanceColor !== null);
  log('InstancedMesh accepts material array?', (() => { try { new THREE.InstancedMesh(new THREE.BoxGeometry(), [new THREE.MeshBasicMaterial()], 1); return 'constructs'; } catch(e){ return 'throws'; } })());
}

// Memory math
{
  log('pos+normal+uv float32 bytes/vertex', 3*4 + 3*4 + 2*4);
  const s = new THREE.SphereGeometry(1, 32, 16);
  log('SphereGeometry index array type', s.index.array.constructor.name);
}

// computeTangents requirements
{
  const g = new THREE.BoxGeometry();
  g.computeTangents();
  log('computeTangents -> tangent itemSize', g.attributes.tangent.itemSize);
  log('normalScale default', new THREE.MeshStandardMaterial().normalScale.toArray());
  log('normalMapType default is TangentSpace', new THREE.MeshStandardMaterial().normalMapType === THREE.TangentSpaceNormalMap);
}
