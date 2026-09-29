// Reference for the selection ring build. The page runs this under the right-hand rack.
import type { Answer } from '@harness/drill';
import { disposeObject, type EffectSetup } from '@harness/exercise';
import { abs, atan, color, fract, length, oneMinus, smoothstep, time, TWO_PI, uv } from 'three/tsl';
import * as THREE from 'three/webgpu';

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

const RING_RADIUS = 0.4; // in the square's UV: the square is 1 across
const RING_WIDTH = 0.07;
const DASHES = 12; // a whole number, so there's no seam where the angle wraps around
const TURNS_PER_SECOND = 0.15;
const RING_COLOR = 0x38bdf8;

export function selectionRing(part: THREE.Object3D): Answer<THREE.Object3D> {
  // Step 1. Measure the part in the world. Thin parts still get a ring you can see.
  const bounds = new THREE.Box3().setFromObject(part);
  const center = bounds.getCenter(new THREE.Vector3());
  const size = bounds.getSize(new THREE.Vector3());
  const radius = Math.max(size.x, size.z) * 0.6 + 0.12;

  // Step 2. The ring mask, from the distance to a circle.
  const p = uv().sub(0.5);
  const d = length(p).sub(RING_RADIUS);
  const ring = oneMinus(smoothstep(0, RING_WIDTH, abs(d)));

  // Step 3. Dashes that spin: the angle around the middle, one unit per turn, slid along by time.
  const around = atan(p.y, p.x).div(TWO_PI);
  const spin = fract(time.mul(TURNS_PER_SECOND)); // wrapped, so it never grows large
  const segment = fract(around.add(spin).mul(DASHES));
  const dashes = oneMinus(smoothstep(0.2, 0.3, abs(segment.sub(0.5))));

  // Step 4. A glowing material: bright dashes on a dimmer ring, added onto what's behind it.
  const material = new THREE.MeshBasicNodeMaterial({
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  material.colorNode = color(RING_COLOR).mul(ring.mul(dashes.mul(0.75).add(0.25)));

  // Step 5. A flat square on the floor under the part, scaled so the ring lands at `radius`.
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(1, 1).rotateX(-Math.PI / 2), material);
  mesh.position.set(center.x, 0.01, center.z);
  mesh.scale.setScalar(radius / RING_RADIUS);
  return mesh;
}
