import { answered, expectExact, expectNumber, expectVector, expectUnchanged } from '@harness/check';
import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { needsControlsUpdate, canvasNdc, wasDrag, partState, dollyChanges, planeDragLocal, railDelta, gizmoWorldAxis, setOrbitDragState, focusCenter, labelPosition, dampingFraction, focusEase } from './check';

describe('interaction.controls-tour', () => {
it('keeps updating for damping after input stops', () => {
    expectExact(needsControlsUpdate(true,false),true); expectExact(needsControlsUpdate(false,true),true);
    expectExact(needsControlsUpdate(false,false),false);
  });
});

describe('interaction.pointer-events', () => {
it('uses the canvas rectangle even when it starts away from the window origin', () => {
    const rect = {left:100,top:50,width:400,height:200}; const point = answered(canvasNdc(200,100,rect));
    expect(point.x).toBeCloseTo(-0.5); expect(point.y).toBeCloseTo(0.5);
  });
});

describe('interaction.click-vs-drag', () => {
it('uses a movement threshold in CSS pixels', () => {
    const down = new THREE.Vector2(100,100);
    expectExact(wasDrag(down,new THREE.Vector2(103,104),5),false);
    expectExact(wasDrag(down,new THREE.Vector2(106,105),5),true);
    expect(down.toArray()).toEqual([100,100]);
  });
});

describe('interaction.hover-selection', () => {
it('keeps selection when hover exits', () => {
    expectExact(partState(true,false),'selected'); expectExact(partState(true,true),'selected');
    expectExact(partState(false,true),'hover'); expectExact(partState(false,false),'none');
  });
});

describe('interaction.orbit-pan-dolly', () => {
it('uses zoom only for an orthographic camera', () => {
    expectExact(dollyChanges(new THREE.OrthographicCamera()),'zoom');
    expectExact(dollyChanges(new THREE.PerspectiveCamera()),'distance');
  });
});

describe('interaction.drag-on-plane', () => {
it('keeps the offset under a rotated and translated parent', () => {
    const parent = new THREE.Group(); parent.position.set(2,1,-1); parent.rotation.y = 0.5;
    const child = new THREE.Mesh(); child.position.set(0.4,0,0.2); parent.add(child); parent.updateMatrixWorld(true);
    const plane = new THREE.Plane(new THREE.Vector3(0,1,0),0);
    const ray = new THREE.Ray(new THREE.Vector3(3,4,2),new THREE.Vector3(0,-1,0));
    const offset = new THREE.Vector3(0.7,0,0.2); const before = offset.clone();
    const world = ray.intersectPlane(plane,new THREE.Vector3())!.add(offset);
    expectVector(planeDragLocal(ray,plane,offset,child),parent.worldToLocal(world));
    expectUnchanged(offset,before,'offset'); expectVector(child.position,new THREE.Vector3(0.4,0,0.2));
  });
});

describe('interaction.axis-drag', () => {
it('projects onto a tilted non-unit rail without changing inputs', () => {
    const start = new THREE.Vector3(1,2,3), end = new THREE.Vector3(4,1,5), axis = new THREE.Vector3(2,1,0);
    const before = [start.clone(),end.clone(),axis.clone()];
    expectVector(railDelta(start,end,axis),end.clone().sub(start).projectOnVector(axis));
    expectUnchanged(start,before[0],'start'); expectUnchanged(end,before[1],'end'); expectUnchanged(axis,before[2],'axis');
  });
});

describe('interaction.local-world-manipulation', () => {
it('changes local axes with a rotated parent but keeps world axes fixed', () => {
    const parent = new THREE.Group(); parent.rotation.y = 0.5; const object = new THREE.Group(); object.rotation.z=0.4; parent.add(object);
    const axis = new THREE.Vector3(2,0,0); const before=axis.clone();
    expectVector(gizmoWorldAxis(object,axis,'local'),axis.clone().normalize().applyQuaternion(object.getWorldQuaternion(new THREE.Quaternion())));
    expectVector(gizmoWorldAxis(object,axis,'world'),new THREE.Vector3(1,0,0)); expectUnchanged(axis,before,'axis');
  });
});

describe('interaction.controls-coexistence', () => {
it('disables orbit only during a custom drag', () => {
    const controls = {enabled:true}; expectExact(setOrbitDragState(controls,true),false); expect(controls.enabled).toBe(false);
    expectExact(setOrbitDragState(controls,false),true); expect(controls.enabled).toBe(true);
  });
});

describe('interaction.focus-on-object', () => {
it('uses the world box rather than the object origin', () => {
    const root = new THREE.Group(); root.position.set(3,1,-2); const mesh = new THREE.Mesh(new THREE.BoxGeometry(2,2,2)); mesh.position.x=2; root.add(mesh);
    root.updateMatrixWorld(true); expectVector(focusCenter(root),new THREE.Box3().setFromObject(root,true).getCenter(new THREE.Vector3()));
  });
});

describe('interaction.anchoring', () => {
it('places a front point in CSS pixels and hides one behind', () => {
    const camera = new THREE.PerspectiveCamera(60,2,0.1,100); camera.position.set(0,0,5); camera.lookAt(0,0,0); camera.updateMatrixWorld();
    const rect = {left:80,top:40,width:600,height:300}; const front = answered(labelPosition(new THREE.Vector3(0,0,0),camera,rect));
    expect(front.x).toBeCloseTo(380); expect(front.y).toBeCloseTo(190); expect(front.visible).toBe(true);
    expect(answered(labelPosition(new THREE.Vector3(0,0,10),camera,rect)).visible).toBe(false);
  });
});

describe('interaction.frame-rate-independence', () => {
it('composes across different frame lengths', () => {
    const one = answered(dampingFraction(4,1/30)); const half = answered(dampingFraction(4,1/60));
    expect(one).toBeCloseTo(1-(1-half)*(1-half));
    expectNumber(dampingFraction(4,0),0);
    expect(one).toBeGreaterThan(half);
  });
});

describe('interaction.interpolation-toolbox', () => {
it('clamps outside the interval and eases within it', () => {
    expectNumber(focusEase(-1,2),0); expectNumber(focusEase(3,2),1);
    expectNumber(focusEase(0.5,2),THREE.MathUtils.smoothstep(0.5,0,2));
    expect(answered(focusEase(0.5,2))).toBeLessThan(0.25);
  });
});
