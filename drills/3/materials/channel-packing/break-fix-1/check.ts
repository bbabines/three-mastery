import type { readOrm } from './drill';
export function checkRepair(_repair: typeof readOrm): void {
 throw new Error('Write the regression check in check.ts');
}
