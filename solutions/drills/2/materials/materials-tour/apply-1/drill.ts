import type { Answer } from '@harness/drill';
import { FrontSide, MeshBasicMaterial, Texture } from 'three';
export function unlitCutout(color: string, mask: Texture): Answer<MeshBasicMaterial> {
 return new MeshBasicMaterial({ color, alphaMap: mask, side: FrontSide, alphaTest: .5, transparent: false, toneMapped: false });
}
