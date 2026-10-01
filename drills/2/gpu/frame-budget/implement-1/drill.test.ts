import { answered, expectExact, expectNumber, expectVector, expectUnchanged } from '@harness/check';
import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { budgetForHz } from './drill';

describe('budgetForHz', () => {
it('shows that higher refresh rates leave less time per frame', () => {
    expectNumber(budgetForHz(60),1000/60); expectNumber(budgetForHz(120),1000/120);
    expect(answered(budgetForHz(120))).toBeLessThan(answered(budgetForHz(60)));
  });
});
