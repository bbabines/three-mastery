import { answered, expectExact, expectNumber, expectVector, expectUnchanged } from '@harness/check';
import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { batchMatchingParts } from './drill';

describe('batchMatchingParts', () => {
it('keeps unlike materials apart and preserves every instance matrix', () => {
    const geometry=new THREE.BoxGeometry(), blue=new THREE.MeshBasicMaterial({color:'blue'}), red=new THREE.MeshBasicMaterial({color:'red'});
    const at=(x:number)=>new THREE.Matrix4().makeTranslation(x,0,0);
    const batches=answered(batchMatchingParts([{geometry,material:blue,world:at(1)},{geometry,material:blue,world:at(2)},{geometry,material:red,world:at(3)}]));
    expect(batches).toHaveLength(2); expect(batches.map(b=>b.count)).toEqual([2,1]);
    const matrix=new THREE.Matrix4(); batches[0].getMatrixAt(1,matrix); expect(matrix.elements).toEqual(at(2).elements);
    geometry.dispose(); blue.dispose(); red.dispose();
  });
});
