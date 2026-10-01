// Reference repair for drills/3/gpu/multi-pass/break-fix-1.
import * as THREE from 'three';

export function passCost(width: number, height: number, passes: number): {fullScreenFragments:number;needsOutputPass:boolean} {
  return {fullScreenFragments:width*height*passes,needsOutputPass:true};
}
