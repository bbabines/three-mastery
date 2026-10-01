import { describe, it } from 'vitest';
import { productFinish } from './drill';
import { checkRepair } from './check';
describe('regression check', () => { it('rejects the original bug', () => checkRepair(productFinish)); });
