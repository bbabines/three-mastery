// Selection ring, from memory. The page's scene is your rack in a product viewer: clicking a part
// selects it, and `effect` below hands the selection to your hook, `selectionRing`. Build the ring
// the README describes and save; the page reloads with your ring under the left rack and the
// reference ring under the right one.
//
// TSL functions come from 'three/tsl'. The three.js docs and source are fine to use; AI tools,
// /solutions, and the guided build's steps are not.
import type { Answer } from '@harness/drill';
import { disposeObject, type EffectSetup } from '@harness/exercise';
import * as THREE from 'three/webgpu';

// The wiring, already done: whenever the selection changes, take the old ring out of the scene and
// free it, then add the ring your hook builds for the new part.
export const effect: EffectSetup = ({ scene, onSelect }) => {
  let ring: THREE.Object3D | null = null;
  onSelect((part) => {
    if (ring) {
      scene.remove(ring);
      disposeObject(ring);
    }
    ring = part ? selectionRing(part) : null;
    if (ring) scene.add(ring);
    return ring;
  });
};

// The hook: build the ring that lies on the floor under `part`, or return null for no ring. The
// floor is at y = 0.
export function selectionRing(part: THREE.Object3D): Answer<THREE.Object3D> {
  return null;
}
