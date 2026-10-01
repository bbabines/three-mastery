import type { Answer } from '@harness/drill';
import { installAnimatedEffect, type AnimatedEffect, type EffectSetup } from '@harness/vfx-effects';
import * as THREE from 'three/webgpu';

export const effect: EffectSetup = (viewer) => installAnimatedEffect(viewer, sparks);

export function sparks(part: THREE.Object3D, camera: THREE.PerspectiveCamera): Answer<AnimatedEffect> {
  const center = new THREE.Box3().setFromObject(part).getCenter(new THREE.Vector3());
  const group = new THREE.Group();
  const streaks: { mesh: THREE.Mesh; velocity: THREE.Vector3; initialVelocity: THREE.Vector3; material: THREE.MeshBasicNodeMaterial }[] = [];
  for (let i = 0; i < 12; i++) {
    const angle = i * 2.39996;
    const material = new THREE.MeshBasicNodeMaterial({ color: 0xffbd63, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide });
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(0.045, 0.22), material);
    mesh.position.copy(center);
    group.add(mesh);
    const velocity = new THREE.Vector3(Math.cos(angle) * 1.2, 1.0 + (i % 4) * 0.17, Math.sin(angle) * 1.2);
    streaks.push({ mesh, material, velocity, initialVelocity: velocity.clone() });
  }
  const right = new THREE.Vector3(), up = new THREE.Vector3();
  let age = 0;
  return {
    object: group,
    update(delta) {
      const dt = Math.min(delta, 0.05);
      age += dt;
      if (age >= 1.8) {
        age = 0;
        for (const streak of streaks) {
          streak.mesh.position.copy(center);
          streak.velocity.copy(streak.initialVelocity);
        }
      }
      right.set(1, 0, 0).applyQuaternion(camera.quaternion);
      up.set(0, 1, 0).applyQuaternion(camera.quaternion);
      for (const streak of streaks) {
        streak.velocity.y -= 2.4 * dt;
        streak.mesh.position.addScaledVector(streak.velocity, dt);
        streak.mesh.quaternion.copy(camera.quaternion);
        streak.mesh.rotateZ(-Math.atan2(streak.velocity.dot(right), streak.velocity.dot(up)));
        streak.material.opacity = Math.max(0, 1 - age / 1.1);
      }
    },
  };
}
