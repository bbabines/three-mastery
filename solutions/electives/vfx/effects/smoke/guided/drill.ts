import type { Answer } from '@harness/drill';
import { softParticleOpacity } from '../../../../../../electives/vfx/shared';
import { installAnimatedEffect, type AnimatedEffect, type EffectSetup } from '@harness/vfx-effects';
import { floor, mod, texture, uniform, uv, vec2 } from 'three/tsl';
import * as THREE from 'three/webgpu';

export const effect: EffectSetup = (viewer) => installAnimatedEffect(viewer, smoke);

function smokeAtlas() {
  const canvas = document.createElement('canvas');
  canvas.width = 256; canvas.height = 128;
  const ctx = canvas.getContext('2d')!;
  for (let frame = 0; frame < 8; frame++) {
    const x = (frame % 4) * 64 + 32;
    const y = (1 - Math.floor(frame / 4)) * 64 + 32;
    const radius = 14 + frame * 2;
    const gradient = ctx.createRadialGradient(x, y, 2, x, y, radius);
    gradient.addColorStop(0, 'rgba(255,255,255,0.88)');
    gradient.addColorStop(0.5, 'rgba(210,225,235,0.42)');
    gradient.addColorStop(1, 'rgba(180,205,225,0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(x - 32, y - 32, 64, 64);
  }
  const atlas = new THREE.CanvasTexture(canvas);
  atlas.colorSpace = THREE.SRGBColorSpace;
  return atlas;
}

export function smoke(part: THREE.Object3D, camera: THREE.PerspectiveCamera): Answer<AnimatedEffect> {
  const center = new THREE.Box3().setFromObject(part).getCenter(new THREE.Vector3());
  center.y = 0.24;
  const atlas = smokeAtlas();
  const group = new THREE.Group();
  const puffs: { mesh: THREE.Mesh; frame: ReturnType<typeof uniform>; fade: ReturnType<typeof uniform>; age: number; origin: THREE.Vector3 }[] = [];
  for (let i = 0; i < 6; i++) {
    const frame = uniform(0), fade = uniform(1);
    const cell = vec2(mod(frame, 4), floor(frame.div(4)));
    const sampled = texture(atlas, uv().add(cell).div(vec2(4, 2)));
    const material = new THREE.MeshBasicNodeMaterial({ transparent: true, depthWrite: false, side: THREE.DoubleSide, color: 0xb8d3e2 });
    material.opacityNode = softParticleOpacity(sampled.a.mul(fade), uniform(0.45));
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(0.75, 0.75), material);
    const origin = center.clone().add(new THREE.Vector3((i - 2.5) * 0.13, 0, (i % 2) * 0.08));
    mesh.position.copy(origin); group.add(mesh);
    puffs.push({ mesh, frame, fade, age: i * 0.22, origin });
  }
  return {
    object: group,
    update(delta) {
      const dt = Math.min(delta, 0.05);
      for (const puff of puffs) {
        puff.age = (puff.age + dt) % 1.6;
        puff.frame.value = Math.min(7, Math.floor((puff.age / 1.6) * 8));
        puff.fade.value = 1 - puff.age / 1.6;
        puff.mesh.position.copy(puff.origin).add(new THREE.Vector3(0, puff.age * 0.16, 0));
        puff.mesh.quaternion.copy(camera.quaternion);
      }
    },
    dispose: () => atlas.dispose(),
  };
}
