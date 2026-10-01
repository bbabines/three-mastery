import * as THREE from 'three';import {expect,it,vi} from 'vitest';import {addPulse} from './drill';
it('compiles the repaired Standard shader with a pulse',()=>{
 const errors=vi.spyOn(console,'error');const renderer=new THREE.WebGLRenderer({antialias:false});renderer.setSize(16,16);
 const base=new THREE.MeshStandardMaterial({color:'#507090'}),result=addPulse(base,.3);
 const geo=new THREE.PlaneGeometry(2,2),scene=new THREE.Scene();scene.add(new THREE.Mesh(geo,result));
 const ambient=new THREE.AmbientLight(0xffffff,.1);scene.add(ambient);
 const camera=new THREE.PerspectiveCamera(60,1,.1,10);camera.position.z=2;
 const target=new THREE.WebGLRenderTarget(16,16);renderer.setRenderTarget(target);
 const dim=new Uint8Array(4),lit=new Uint8Array(4);
 renderer.render(scene,camera);renderer.readRenderTargetPixels(target,8,8,1,1,dim);
 ambient.intensity=2;
 renderer.render(scene,camera);renderer.readRenderTargetPixels(target,8,8,1,1,lit);
 expect(lit[0]+lit[1]+lit[2]).toBeGreaterThan(dim[0]+dim[1]+dim[2]+10);
 expect(errors.mock.calls.flat().join(' ')).not.toMatch(/THREE.WebGLProgram: Shader Error|VALIDATE_STATUS false/);
 errors.mockRestore();target.dispose();geo.dispose();result.dispose();renderer.dispose();
});
