// The scene runs this code. Fix the bug, then write the check.
import * as THREE from 'three';

export function screenY(ndcY: number, height: number): number {
  return (ndcY+1)*height/2;
}
