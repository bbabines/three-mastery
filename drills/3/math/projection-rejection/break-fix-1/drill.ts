import { Vector3 } from 'three';

export interface WallMotion { slide: Vector3; bounce: Vector3 }

// Split incoming movement into its along-wall slide and its reflected bounce.
export function slideAndBounce(incoming: Vector3, normal: Vector3): WallMotion {
  return {
    slide: incoming.clone().projectOnPlane(normal),
    bounce: incoming.clone().reflect(normal),
  };
}
