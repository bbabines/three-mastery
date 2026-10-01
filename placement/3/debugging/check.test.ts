import { answered, expectExact, expectNumber, expectVector, expectUnchanged } from '@harness/check';
import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { firstFailure, inCameraView, boundsHelper, worldArrowDirection, matrixTranslation, finiteOrZero, showOnlyBranch, captureFrameCounts, authoredShaderLine, debugViewMaterial } from './check';

describe('debugging.triage', () => {
it('uses the first failed stage instead of blaming the shader', () => {
    const ready = {inScene:true,inView:true,hasVertices:true,hasMaterial:true,shaderLinked:true};
    expectExact(firstFailure({...ready,inScene:false,shaderLinked:false}),'scene');
    expectExact(firstFailure({...ready,inView:false}),'camera');
    expectExact(firstFailure({...ready,hasVertices:false}),'geometry');
    expectExact(firstFailure({...ready,hasMaterial:false}),'material');
    expectExact(firstFailure({...ready,shaderLinked:false}),'pipeline');
    expectExact(firstFailure(ready),'ready');
  });
});

describe('debugging.nothing-renders', () => {
it('uses world bounds and current camera matrices', () => {
    const camera = new THREE.PerspectiveCamera(60,1,0.1,100); camera.position.z=5; camera.lookAt(0,0,0); camera.updateMatrixWorld();
    const near = new THREE.Mesh(new THREE.BoxGeometry()); expectExact(inCameraView(near,camera),true);
    near.position.x=500; expectExact(inCameraView(near,camera),false);
  });
});

describe('debugging.helpers', () => {
it('creates a helper around the supplied object', () => {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry()); mesh.position.set(2,1,-3);
    const helper = answered(boundsHelper(mesh)); expect(helper).toBeInstanceOf(THREE.BoxHelper);
    expect(helper.visible).toBe(true); helper.dispose();
  });
});

describe('debugging.visualizing-vectors', () => {
it('uses the full world transform and leaves the local vector alone', () => {
    const parent = new THREE.Group(); parent.rotation.y=0.6; parent.scale.set(2,1,.5); const child = new THREE.Group(); child.rotation.z=0.3; parent.add(child);
    const local = new THREE.Vector3(2,0,0); const before=local.clone();
    child.updateWorldMatrix(true,false);
    expectVector(worldArrowDirection(child,local),local.clone().transformDirection(child.matrixWorld));
    expectUnchanged(local,before,'local direction');
  });
});

describe('debugging.reading-matrices', () => {
it('reads translation after rotation and scale are present', () => {
    const matrix = new THREE.Matrix4().compose(new THREE.Vector3(3,-2,7),new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0),0.7),new THREE.Vector3(2,3,4));
    const before=matrix.clone(); expectVector(matrixTranslation(matrix),new THREE.Vector3().setFromMatrixPosition(matrix));
    expect(matrix.elements).toEqual(before.elements);
  });
});

describe('debugging.nan-degenerate', () => {
it('does not let a NaN spread into helper geometry', () => {
    const bad = new THREE.Vector3(Number.NaN,2,3); expectVector(finiteOrZero(bad),new THREE.Vector3());
    const good = new THREE.Vector3(1,2,3); expectVector(finiteOrZero(good),good); expect(good.toArray()).toEqual([1,2,3]);
  });
});

describe('debugging.isolation', () => {
it('hides siblings without deleting or mutating the chosen subtree', () => {
    const root = new THREE.Group(); const a=new THREE.Group(), b=new THREE.Group(), c=new THREE.Group(); const nested=new THREE.Mesh(); b.add(nested); root.add(a,b,c);
    expectNumber(showOnlyBranch(root,b),2); expect(root.children).toEqual([a,b,c]);
    expect([a.visible,b.visible,c.visible,nested.visible]).toEqual([false,true,false,true]);
  });
});

describe('debugging.frame-capture', () => {
it('reads the counters after rendering, not before', () => {
    const scene=new THREE.Scene(), camera=new THREE.PerspectiveCamera();
    const info={render:{calls:0,triangles:0}}; const renderer={render:()=>{info.render.calls=3; info.render.triangles=12;},info} as unknown as Pick<THREE.WebGLRenderer,'render'|'info'>;
    expect(answered(captureFrameCounts(renderer,scene,camera))).toEqual({calls:3,triangles:12});
  });
});

describe('debugging.shader-errors', () => {
it('reads the compiled line and accounts for injected lines', () => {
    expectNumber(authoredShaderLine('ERROR: 0:137: undeclared identifier',120),17);
    expectNumber(authoredShaderLine('no line number',120),-1);
  });
});

describe('debugging.debug-views', () => {
it('uses dedicated normal and depth views and a wireframe fallback', () => {
    const normal=answered(debugViewMaterial('normal')); expect(normal).toBeInstanceOf(THREE.MeshNormalMaterial);
    const depth=answered(debugViewMaterial('depth')); expect(depth).toBeInstanceOf(THREE.MeshDepthMaterial);
    const wire=answered(debugViewMaterial('wireframe')) as THREE.MeshBasicMaterial; expect(wire.wireframe).toBe(true);
    normal.dispose(); depth.dispose(); wire.dispose();
  });
});
