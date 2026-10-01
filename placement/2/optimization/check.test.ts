import { answered, expectExact, expectNumber, expectVector, expectUnchanged } from '@harness/check';
import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { instanceHardware, pixelRatioFor, shouldDraw, closestInto, lodLevel, makeCutout, enabledPhysicalFeatures, rgbaMipBytes, precompileScene, swapMemoryDelta, qualityStep } from './check';

describe('optimization.draw-call-reduction', () => {
it('stores every transform but shares one geometry and material', () => {
    const geometry=new THREE.BoxGeometry(), material=new THREE.MeshBasicMaterial();
    const placements=[new THREE.Matrix4().makeTranslation(1,0,0),new THREE.Matrix4().makeTranslation(2,0,0),new THREE.Matrix4().makeTranslation(3,0,0)];
    const mesh=answered(instanceHardware(geometry,material,placements)); expect(mesh.count).toBe(3);
    expect(mesh.geometry).toBe(geometry); expect(mesh.material).toBe(material);
    for(let i=0;i<3;i++){const got=new THREE.Matrix4(); mesh.getMatrixAt(i,got); expect(got.elements).toEqual(placements[i].elements);}
    geometry.dispose(); material.dispose();
  });
});

describe('optimization.resolution-dpr', () => {
it('caps valid DPR and falls back to one for invalid values', () => {
      expectNumber(pixelRatioFor(3,2),2); expectNumber(pixelRatioFor(1.5,2),1.5);
      expectNumber(pixelRatioFor(Number.NaN,2),1); expectNumber(pixelRatioFor(0,2),1);
    });
});

describe('optimization.render-on-demand', () => {
it('skips static and hidden-tab frames', () => {
    expectExact(shouldDraw(true,true),true); expectExact(shouldDraw(false,true),false);
    expectExact(shouldDraw(true,false),false);
  });
});

describe('optimization.allocation-hygiene', () => {
it('uses the caller scratch object on repeated queries', () => {
    const ray=new THREE.Ray(new THREE.Vector3(1,2,3),new THREE.Vector3(1,0,0)); const point=new THREE.Vector3(4,5,6), scratch=new THREE.Vector3();
    const result=answered(closestInto(ray,point,scratch)); expect(result).toBe(scratch);
    expectVector(result,ray.closestPointToPoint(point,new THREE.Vector3()));
    expect(answered(closestInto(ray,new THREE.Vector3(0,0,0),scratch))).toBe(scratch);
    expectUnchanged(point,new THREE.Vector3(4,5,6),'point');
  });
});

describe('optimization.culling-lod', () => {
it('steps through distance thresholds at their boundaries', () => {
    const thresholds=[5,15,40]; expectNumber(lodLevel(4.9,thresholds),0); expectNumber(lodLevel(5,thresholds),1);
    expectNumber(lodLevel(20,thresholds),2); expectNumber(lodLevel(80,thresholds),3); expect(thresholds).toEqual([5,15,40]);
  });
});

describe('optimization.overdraw', () => {
it('keeps surviving cutout pixels in the depth buffer', () => {
    const material=new THREE.MeshBasicMaterial({transparent:true,depthWrite:false});
    const result=answered(makeCutout(material,0.5)); expect(result).toBe(material);
    expect(material.alphaTest).toBeCloseTo(0.5); expect(material.transparent).toBe(false); expect(material.depthWrite).toBe(true);
  });
});

describe('optimization.shader-cost', () => {
it('counts enabled features, not the material class name', () => {
    const material=new THREE.MeshPhysicalMaterial(); expectNumber(enabledPhysicalFeatures(material),0);
    material.clearcoat=1; material.transmission=0.6; expectNumber(enabledPhysicalFeatures(material),2); material.dispose();
  });
});

describe('optimization.texture-budget', () => {
it('counts each mip level down to one pixel', () => {
    expectNumber(rgbaMipBytes(4,4),(16+4+1)*4); expectNumber(rgbaMipBytes(8,2),(16+4+2+1)*4);
    expect(answered(rgbaMipBytes(8,8))).toBeGreaterThan(8*8*4);
  });
});

describe('optimization.hitch-avoidance', () => {
it('returns the renderer pre-compile Promise for this scene', async () => {
    const scene=new THREE.Scene(), camera=new THREE.PerspectiveCamera(); let calls=0; const pending=Promise.resolve(scene as THREE.Object3D);
    const renderer={compileAsync:(s:THREE.Object3D,c:THREE.Camera)=>{expect(s).toBe(scene);expect(c).toBe(camera);calls++;return pending;}} as Pick<THREE.WebGLRenderer,'compileAsync'>;
    expect(answered(precompileScene(renderer,scene,camera))).toBe(pending); await pending; expect(calls).toBe(1);
  });
});

describe('optimization.leak-detection', () => {
it('measures after every swap and catches retained resources', () => {
    const memory={geometries:2,textures:1}; let renders=0,swaps=0;
    const renderer={info:{memory},render:()=>{renders++;}} as unknown as Pick<THREE.WebGLRenderer,'render'|'info'>;
    const result=answered(swapMemoryDelta(renderer,new THREE.Scene(),new THREE.PerspectiveCamera(),()=>{swaps++;memory.textures++;},20));
    expect(result).toEqual({geometries:0,textures:20}); expect(renders).toBe(21); expect(swaps).toBe(20);
  });
});

describe('optimization.adaptive-quality', () => {
it('uses a dead band so quality does not flap near target', () => {
    expectNumber(qualityStep(2,22,16,2),1); expectNumber(qualityStep(2,10,16,2),3);
    expectNumber(qualityStep(2,17,16,2),2); expectNumber(qualityStep(0,30,16,2),0);
  });
});
