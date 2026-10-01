// The product viewer owns selection, mounting, animation, and teardown. Each effect drill supplies
// only the hook that builds its effect for one selected rack part.
import { disposeObject, type EffectSetup, type EffectViewer } from '@harness/exercise';
import type { Answer } from '@harness/drill';
import type { Node } from 'three/webgpu';
import * as THREE from 'three/webgpu';
import { uniform } from 'three/tsl';

export interface AnimatedEffect {
  object: THREE.Object3D;
  update?: (delta: number, elapsed: number) => void;
  dispose?: () => void;
}

export type EffectHook = (part: THREE.Object3D, camera: THREE.PerspectiveCamera) => Answer<AnimatedEffect>;

export function installAnimatedEffect(viewer: EffectViewer, hook: EffectHook) {
  let active: AnimatedEffect | null = null;
  viewer.onSelect((part) => {
    if (active) {
      viewer.scene.remove(active.object);
      active.dispose?.();
      disposeObject(active.object);
      active = null;
    }
    active = part ? hook(part, viewer.camera) : null;
    if (active) viewer.scene.add(active.object);
    return active?.object ?? null;
  });
  viewer.onFrame((delta, elapsed) => active?.update?.(delta, elapsed));
}

export type DissolveMaterialHook = (progress: Node<'float'>) => Answer<THREE.Material>;

// Dissolve is a material override on the selected part itself. Restore exact material references
// on the next selection so shared rack resources remain owned by the rack.
export function installDissolve(viewer: EffectViewer, hook: DissolveMaterialHook) {
  const progress = uniform(0);
  const original: { mesh: THREE.Mesh; material: THREE.Material | THREE.Material[] }[] = [];
  let replacement: THREE.Material | null = null;
  const restore = () => {
    for (const { mesh, material } of original) mesh.material = material;
    original.length = 0;
    replacement?.dispose();
    replacement = null;
  };
  viewer.onSelect((part) => {
    restore();
    if (!part) return null;
    progress.value = 0;
    replacement = hook(progress);
    if (!replacement) return null;
    part.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        original.push({ mesh: child, material: child.material });
        child.material = replacement!;
      }
    });
    if (!original.length) restore();
    return original.length ? part : null;
  });
  viewer.onFrame((delta) => {
    if (replacement) progress.value = Math.min(1, progress.value + Math.min(delta, 0.1) / 2.2);
  });
}

export type { EffectSetup };
