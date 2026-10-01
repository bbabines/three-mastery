// The scene runs this code. Fix the bug, then write the check.
import * as THREE from 'three';

export function depthWork(front: number, hidden: number, alphaTested: number): {fragmentCandidates:number;earlyRejected:number;lateShaded:number} {
  return {fragmentCandidates:front+hidden+alphaTested,earlyRejected:hidden+alphaTested,lateShaded:front};
}
