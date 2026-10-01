import { answered, expectExact, expectNumber, expectVector, expectUnchanged } from '@harness/check';
import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { pointAhead, pointerNdc, worldHitNormal, firstTargetName, planeDragPoint, hotspotPoint, frontFacePoint, rayTouchesBox, positiveSide, worldAabbSize, snapToEdge, candidateLeafIds } from './check';

describe('queries.ray', () => {
it('uses the ray direction and origin without moving either', () => {
    const ray = new THREE.Ray(new THREE.Vector3(2, 1, -4), new THREE.Vector3(0.6, 0, 0.8));
    const before = ray.clone(); expectVector(pointAhead(ray, 3), ray.at(3, new THREE.Vector3()));
    expectUnchanged(ray.origin, before.origin, 'origin'); expectUnchanged(ray.direction, before.direction, 'direction');
  });
});

describe('queries.ray-from-pointer', () => {
it('uses the canvas rectangle, including its offset and non-square size', () => {
    const rect = { left: 120, top: 70, width: 640, height: 320 };
    const center = answered(pointerNdc(440, 230, rect)); expect(center.x).toBeCloseTo(0); expect(center.y).toBeCloseTo(0);
    const corner = answered(pointerNdc(120, 70, rect)); expect(corner.x).toBeCloseTo(-1); expect(corner.y).toBeCloseTo(1);
  });
});

describe('queries.intersection-anatomy', () => {
it('uses the normal matrix under rotation and non-uniform scale', () => {
    const parent = new THREE.Group(); parent.scale.set(3, 1, 0.4); parent.rotation.y = 0.47;
    const mesh = new THREE.Mesh(); mesh.rotation.x = 0.3; parent.add(mesh);
    const local = new THREE.Vector3(1, 1, 1).normalize(); const before = local.clone();
    parent.updateMatrixWorld(true);
    const expected = local.clone().applyNormalMatrix(new THREE.Matrix3().getNormalMatrix(mesh.matrixWorld));
    expectVector(worldHitNormal(local, mesh), expected); expectUnchanged(local, before, 'normal');
  });
});

describe('queries.filtering', () => {
it('ignores an unlisted helper even when it is closer', () => {
    const helper = new THREE.Mesh(new THREE.BoxGeometry()); helper.name = 'helper'; helper.position.z = 2;
    const target = new THREE.Mesh(new THREE.BoxGeometry()); target.name = 'part';
    helper.updateMatrixWorld(); target.updateMatrixWorld();
    const ray = new THREE.Ray(new THREE.Vector3(0, 0, 5), new THREE.Vector3(0, 0, -1));
    expectExact(firstTargetName(ray, [target]), 'part');
  });
});

describe('queries.ray-plane', () => {
it('hits an angled plane and leaves the ray unchanged', () => {
    const ray = new THREE.Ray(new THREE.Vector3(1, 5, 2), new THREE.Vector3(0.2, -1, 0.1).normalize());
    const plane = new THREE.Plane(new THREE.Vector3(0, 1, 1).normalize(), -1); const before = ray.clone();
    expectVector(planeDragPoint(ray, plane), ray.intersectPlane(plane, new THREE.Vector3())!);
    expectUnchanged(ray.origin, before.origin, 'origin'); expectUnchanged(ray.direction, before.direction, 'direction');
  });
  it('uses the origin when a parallel ray misses', () => {
    const ray = new THREE.Ray(new THREE.Vector3(0, 2, 0), new THREE.Vector3(1, 0, 0));
    expectVector(planeDragPoint(ray, new THREE.Plane(new THREE.Vector3(0, 1, 0), 0)), ray.origin);
  });
});

describe('queries.ray-sphere', () => {
it('hits the exit surface from inside and uses the origin on a miss', () => {
    const sphere = new THREE.Sphere(new THREE.Vector3(1, 0, 0), 2);
    const inside = new THREE.Ray(new THREE.Vector3(1, 0, 0), new THREE.Vector3(1, 0, 0));
    expectVector(hotspotPoint(inside, sphere), inside.intersectSphere(sphere, new THREE.Vector3())!);
    const miss = new THREE.Ray(new THREE.Vector3(0, 5, 0), new THREE.Vector3(1, 0, 0));
    expectVector(hotspotPoint(miss, sphere), miss.origin);
  });
});

describe('queries.ray-triangle', () => {
it('hits the front but rejects the back of a sloped triangle', () => {
    const a = new THREE.Vector3(-1, -1, 0), b = new THREE.Vector3(1, -1, 0), c = new THREE.Vector3(0, 1, 1);
    const front = new THREE.Ray(new THREE.Vector3(0, 0, 5), new THREE.Vector3(0, 0, -1));
    expectVector(frontFacePoint(front, a, b, c), front.intersectTriangle(a, b, c, true, new THREE.Vector3())!);
    const back = new THREE.Ray(new THREE.Vector3(0, 0, -5), new THREE.Vector3(0, 0, 1));
    expectVector(frontFacePoint(back, a, b, c), back.origin);
  });
});

describe('queries.ray-aabb', () => {
it('hits a box from inside and misses one behind the ray', () => {
    const box = new THREE.Box3(new THREE.Vector3(-1, -1, -1), new THREE.Vector3(1, 1, 1));
    expectExact(rayTouchesBox(new THREE.Ray(new THREE.Vector3(), new THREE.Vector3(1, 0, 0)), box), true);
    expectExact(rayTouchesBox(new THREE.Ray(new THREE.Vector3(4, 0, 0), new THREE.Vector3(1, 0, 0)), box), false);
  });
});

describe('queries.bounds-primitives', () => {
it('uses the sign of plane distance on both sides', () => {
    const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -2);
    expectExact(positiveSide(plane, new THREE.Vector3(0, 3, 0)), true);
    expectExact(positiveSide(plane, new THREE.Vector3(0, 1, 0)), false);
  });
});

describe('queries.aabb-vs-obb', () => {
it('expands the AABB around a turned box', () => {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(2, 1, 1)); mesh.rotation.y = Math.PI / 4; mesh.position.set(2, 0, -1);
    mesh.updateMatrixWorld(true);
    const expected = new THREE.Box3().setFromObject(mesh, true).getSize(new THREE.Vector3());
    expectVector(worldAabbSize(mesh), expected);
    expect(answered(worldAabbSize(mesh)).x).toBeGreaterThan(2);
  });
});

describe('queries.closest-point', () => {
it('clamps beyond both ends and finds an interior closest point', () => {
    const edge = new THREE.Line3(new THREE.Vector3(1, 0, 1), new THREE.Vector3(3, 2, 1));
    const points = [new THREE.Vector3(-5, 0, 0), new THREE.Vector3(8, 4, 0), new THREE.Vector3(2, 0, 3)];
    for (const point of points) expectVector(snapToEdge(point, edge), edge.closestPointToPoint(point, true, new THREE.Vector3()));
    expect(edge.start.toArray()).toEqual([1,0,1]);
  });
});

describe('queries.bvh', () => {
it('prunes a missed branch and keeps intersected leaves', () => {
    const make = (minX: number, maxX: number, id?: string) => { const n = new THREE.Group(); n.userData.bounds = new THREE.Box3(new THREE.Vector3(minX,-1,-1),new THREE.Vector3(maxX,1,1)); if (id) n.userData.leafId=id; return n; };
    const root = make(-5,5), near = make(-5,-1), far = make(1,5); root.add(near,far); near.add(make(-4,-2,'left')); far.add(make(2,4,'right'));
    const ray = new THREE.Ray(new THREE.Vector3(-6,0,0),new THREE.Vector3(1,0,0));
    expect(answered(candidateLeafIds(ray,root))).toEqual(['left','right']);
    const miss = new THREE.Ray(new THREE.Vector3(0,0,0),new THREE.Vector3(1,0,0));
    expect(answered(candidateLeafIds(miss,root))).toEqual(['right']);
  });
});
