// Reference repair for drills/3/gpu/depth-early-z/break-fix-1.
import * as THREE from 'three';

export function depthWork(front: number, hidden: number, alphaTested: number): {fragmentCandidates:number;earlyRejected:number;lateShaded:number} {
  return {fragmentCandidates:front+hidden+alphaTested,earlyRejected:hidden,lateShaded:front+alphaTested};
}
