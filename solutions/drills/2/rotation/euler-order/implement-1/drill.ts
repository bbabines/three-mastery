// Reference answer for drills/2/rotation/euler-order/implement-1.
import type { Answer } from '@harness/drill';
import { Euler } from 'three';

export function lookRotation(yaw: number, pitch: number): Answer<Euler> {
  // Heading first, around the upright Y, then the tilt around the camera's own side axis.
  return new Euler(pitch, yaw, 0, 'YXZ');
}
