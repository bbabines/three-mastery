import { describe, it } from 'vitest';
import { prepareStudio } from './drill';
import { checkRendererTour } from './check';

describe('regression check', () => {
  it('rejects the original bug', () => checkRendererTour(prepareStudio));
});
