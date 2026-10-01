// The scene runs this code. Fix the bug, then write the check.
import * as THREE from 'three';

export function passCost(width: number, height: number, passes: number): {fullScreenFragments:number;needsOutputPass:boolean} {
  return {fullScreenFragments:width*height,needsOutputPass:false};
}
