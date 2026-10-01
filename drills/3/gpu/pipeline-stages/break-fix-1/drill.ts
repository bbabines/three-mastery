// The scene runs this code. Fix the bug, then write the check.
import * as THREE from 'three';

export function frameWork(vertices: number, fragments: number, rejected: number, passes: number): {vertexRuns:number;fragmentRuns:number;pixelsWritten:number} {
  return {vertexRuns:vertices*passes,fragmentRuns:(fragments-rejected)*passes,pixelsWritten:(fragments-rejected)*passes};
}
