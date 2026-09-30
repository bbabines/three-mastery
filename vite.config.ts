import type { IncomingMessage, ServerResponse } from 'node:http';
import path from 'node:path';
import { playwright } from '@vitest/browser-playwright';
import { defineConfig, type Plugin } from 'vitest/config';
import { appendLog, readLog } from './scripts/lib/log';

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

function sendJson(response: ServerResponse, status: number, body: unknown) {
  response.statusCode = status;
  response.setHeader('Content-Type', 'application/json');
  response.end(JSON.stringify(body));
}

async function readBody(request: IncomingMessage) {
  let body = '';
  for await (const chunk of request) body += chunk;
  return body;
}

// The drill viewer can't write files, so the dev server does it: GET returns the practice log,
// and POST logs a finished page into the same progress/log.jsonl that pick.ts reads.
function progressApi(): Plugin {
  return {
    name: 'progress-api',
    configureServer(server) {
      server.middlewares.use('/api/progress', async (request, response) => {
        if (request.method === 'GET') return sendJson(response, 200, readLog());
        if (request.method !== 'POST') return sendJson(response, 405, { error: 'Use GET or POST' });

        let parsed: { id?: unknown; score?: { right?: unknown; total?: unknown }; failedParts?: unknown };
        try {
          parsed = JSON.parse(await readBody(request));
        } catch {
          return sendJson(response, 400, { error: 'Body must be JSON' });
        }
        const { id, score, failedParts } = parsed;
        const validScore = typeof score?.right === 'number' && typeof score?.total === 'number';
        // A checkpoint quiz sends the domains its missed questions came from.
        const validParts = Array.isArray(failedParts) && failedParts.every((part) => typeof part === 'string' && /^[a-z0-9-]+$/.test(part));
        if (
          typeof id !== 'string' ||
          !/^[a-z0-9.-]+$/.test(id) ||
          (score !== undefined && !validScore) ||
          (failedParts !== undefined && !validParts)
        ) {
          return sendJson(response, 400, { error: 'Expected { id, score?: { right, total }, failedParts?: string[] }' });
        }
        const at = new Date().toISOString();
        appendLog({
          type: 'done',
          id,
          at,
          passed: true,
          score: validScore ? { right: score.right as number, total: score.total as number } : undefined,
          failedParts: validParts ? (failedParts as string[]) : undefined,
        });
        sendJson(response, 200, { at });
      });
    },
  };
}

export default defineConfig({
  resolve: {
    alias: { '@harness': path.join(ROOT, 'harness') },
  },
  plugins: [solutionsSwap(), progressApi()],
  test: {
    // Loop 1 is all read-the-code pages; code drills with tests start in Loop 2.
    passWithNoTests: true,
    projects: [
      {
        extends: true,
        test: {
          name: 'node',
          include: ['{drills,placement,checkpoints,cross}/**/*.test.ts'],
          exclude: ['**/*.browser.test.ts', '**/node_modules/**'],
          environment: 'node',
        },
      },
      {
        // Checks that need WebGL (draw counts, shader compiles, pixels, GPU memory) run in headless
        // Chromium through Playwright. Name those files *.browser.test.ts.
        extends: true,
        test: {
          name: 'browser',
          include: ['{drills,placement,checkpoints,cross}/**/*.browser.test.ts'],
          browser: {
            enabled: true,
            headless: true,
            provider: playwright(),
            instances: [{ browser: 'chromium' }],
          },
        },
      },
    ],
  },
});
