import { answered } from '@harness/check';
import { Matrix3, Mesh, PerspectiveCamera, PlaneGeometry, Scene, Vector3, WebGLRenderTarget, WebGLRenderer } from 'three';
import { describe, expect, it } from 'vitest';
import { worldNormalMaterial } from './drill';

describe('world normal debug color', () => {
  it('stays tied to a stretched, turned surface as the camera moves', () => {
    const renderer = new WebGLRenderer({antialias:false});
    const target = new WebGLRenderTarget(1,1);
    const scene = new Scene();
    const material = answered(worldNormalMaterial());
    const geometry = new PlaneGeometry(4,4).rotateX(0.35).rotateY(0.25);
    const mesh = new Mesh(geometry,material);
    mesh.scale.set(2,1,0.5);
    mesh.rotation.y = 0.4;
    scene.add(mesh);
    const camera = new PerspectiveCamera(50,1,0.1,20);
    const sample = (x: number) => {
      camera.position.set(x,0,5);
      camera.lookAt(0,0,0);
      renderer.setRenderTarget(target);
      renderer.render(scene,camera);
      const pixel = new Uint8Array(4);
      renderer.readRenderTargetPixels(target,0,0,1,1,pixel);
      return [...pixel.slice(0,3)];
    };
    const first = sample(0), second = sample(1);
    mesh.updateMatrixWorld(true);
    const localNormal = new Vector3().fromBufferAttribute(geometry.getAttribute('normal'), 0);
    const normal = localNormal.applyMatrix3(new Matrix3().getNormalMatrix(mesh.matrixWorld)).normalize();
    const expected = [normal.x,normal.y,normal.z].map(value => (value*0.5+0.5)*255);
    for(let i=0;i<3;i++) {
      expect(first[i]).toBeCloseTo(expected[i],-1);
      expect(second[i]).toBeCloseTo(expected[i],-1);
    }
    renderer.dispose(); target.dispose(); material.dispose(); geometry.dispose();
  });
});
