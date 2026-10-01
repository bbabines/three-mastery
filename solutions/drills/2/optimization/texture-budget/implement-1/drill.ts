// Texture budget: count the full mip chain. Write the functions, save, and run: npm run drill -- drills/2/optimization/texture-budget/implement-1
// The three.js docs and source are fine to use; AI tools and /solutions are not.
import type { Answer } from '@harness/drill';
import * as THREE from 'three';
// Decoded RGBA8 bytes including the full mip chain.
export function rgbaMipBytes(width: number, height: number): Answer<number> {
  let total=0; while(true){total+=width*height*4; if(width===1 && height===1)break; width=Math.max(1,Math.floor(width/2)); height=Math.max(1,Math.floor(height/2));} return total;
}
