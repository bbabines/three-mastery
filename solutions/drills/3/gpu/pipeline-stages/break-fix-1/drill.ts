// Reference repair for drills/3/gpu/pipeline-stages/break-fix-1.
import * as THREE from 'three';

export function frameWork(vertices: number, fragments: number, rejected: number, passes: number): {vertexRuns:number;fragmentRuns:number;pixelsWritten:number} {
  return {vertexRuns:vertices*passes,fragmentRuns:fragments*passes,pixelsWritten:(fragments-rejected)*passes};
}
