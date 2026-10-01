import { Vector3 } from 'three';

export interface WallMotion { slide: Vector3; bounce: Vector3 }

export function slideAndBounce(incoming: Vector3, normal: Vector3): WallMotion {
  const unitNormal = normal.clone().normalize();
  return {
    slide: incoming.clone().projectOnPlane(unitNormal),
    bounce: incoming.clone().reflect(unitNormal),
  };
}
