// Selection ring, guided build. The page's scene is your rack in a product viewer: clicking a part
// selects it, and `effect` below hands the selection to your hook, `selectionRing`. Fill in the
// hook by following the README's steps and save; the page reloads with your ring under the left
// rack and the reference ring under the right one.
//
// TSL functions come from 'three/tsl'. The three.js docs and source are fine to use; AI tools and
// /solutions are not.
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
  // Step 1. Measure the part in the world: its center, and a radius that surrounds its footprint.

  // Step 2. The ring mask: a soft ring from its distance field.

  // Step 3. Dashes that spin: the angle around the middle, slid along by time.

  // Step 4. A glowing material: the color times the mask, with additive blending.

  // Step 5. A flat square on the floor under the part, sized so the ring surrounds it. Return it.

  return null;
}
