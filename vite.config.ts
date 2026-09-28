import path from 'node:path';
import { defineConfig, type Plugin } from 'vitest/config';

const ROOT = import.meta.dirname;
const SOLUTIONS = path.join(ROOT, 'solutions');

// With DRILL_SOURCE=solutions, a test's `./drill` or `./check` import resolves to the
// mirrored file under /solutions, so the same acceptance tests verify the reference answers.
function solutionsSwap(): Plugin {
  return {
    name: 'solutions-swap',
    enforce: 'pre',
    resolveId(source, importer) {
      if (process.env.DRILL_SOURCE !== 'solutions' || !importer) return null;
      if (source !== './drill' && source !== './check') return null;
      if (importer.startsWith(SOLUTIONS)) return null;
      const relativeDir = path.relative(ROOT, path.dirname(importer));
      return path.join(SOLUTIONS, relativeDir, `${source.slice(2)}.ts`);
    },
  };
}

export default defineConfig({
  resolve: {
    alias: { '@harness': path.join(ROOT, 'harness') },
  },
  plugins: [solutionsSwap()],
  test: {
    include: ['{drills,placement,checkpoints,cross}/**/*.test.ts'],
    environment: 'node',
    // Loop 1 is all read-the-code pages; code drills with tests start in Loop 2.
    passWithNoTests: true,
  },
});
