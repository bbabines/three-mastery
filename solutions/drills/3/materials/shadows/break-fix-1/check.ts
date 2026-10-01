import { expect } from 'vitest';
import {DirectionalLight} from 'three';
import type { fitProductShadow } from './drill';
export function checkRepair(repair: typeof fitProductShadow): void {
 const light=new DirectionalLight();
 repair(light,2);expect(light.shadow.camera.right-light.shadow.camera.left).toBe(2);
}
