// Reference repair for drills/3/camera/clip-ndc-screen/break-fix-1.
import * as THREE from 'three';

export function screenY(ndcY: number, height: number): number {
  return (1-ndcY)*height/2;
}
