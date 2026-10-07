import type { IncomingMessage, ServerResponse } from 'node:http';
import path from 'node:path';
import { playwright } from '@vitest/browser-playwright';
import { defineConfig, type Plugin } from 'vitest/config';
import { TRACKS } from './scripts/lib/domains';
import { appendLog, readLog } from './scripts/lib/log';

const ROOT = import.meta.dirname;
const SOLUTIONS = path.join(ROOT, 'solutions');

// Solution swaps let the same tests run against the learner's file or its reference. Loop 3
// also swaps `./check` independently, to prove a reference regression check rejects the bug.
function solutionsSwap(): Plugin {
  return {
    name: 'solutions-swap',
    enforce: 'pre',
    resolveId(source, importer) {
      if (!importer) return null;
      if (source !== './drill' && source !== './check') return null;
      const useSolution = source === './check'
        ? (process.env.CHECK_SOURCE ?? process.env.DRILL_SOURCE) === 'solutions'
        : process.env.DRILL_SOURCE === 'solutions';
      if (!useSolution) return null;
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

const isSlugList = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every((part) => typeof part === 'string' && /^[a-z0-9-]+$/.test(part));

async function readJson(request: IncomingMessage) {
  try {
    return JSON.parse(await readBody(request)) as Record<string, unknown>;
  } catch {
    return undefined;
  }
}

// The drill viewer can't write files, so the dev server does it: GET returns the practice log,
// POST /api/progress logs a finished page, and POST /api/track logs a track switch, all into the
// same progress/log.jsonl that pick.ts reads.
function progressApi(): Plugin {
  return {
    name: 'progress-api',
    configureServer(server) {
      server.middlewares.use('/api/progress', async (request, response) => {
        if (request.method === 'GET') return sendJson(response, 200, readLog());
        if (request.method !== 'POST') return sendJson(response, 405, { error: 'Use GET or POST' });

        const parsed = await readJson(request);
        if (!parsed) return sendJson(response, 400, { error: 'Body must be JSON' });
        const { id, failedParts, parts } = parsed;
        const score = parsed.score as { right?: unknown; total?: unknown } | undefined;
        const validScore = typeof score?.right === 'number' && typeof score?.total === 'number';
        // A checkpoint quiz sends the domains it covered and the ones its missed questions came from.
        if (
          typeof id !== 'string' ||
          !/^[a-z0-9.-]+$/.test(id) ||
          (score !== undefined && !validScore) ||
          (failedParts !== undefined && !isSlugList(failedParts)) ||
          (parts !== undefined && !isSlugList(parts))
        ) {
          return sendJson(response, 400, { error: 'Expected { id, score?: { right, total }, failedParts?: string[], parts?: string[] }' });
        }
        const at = new Date().toISOString();
        appendLog({
          type: 'done',
          id,
          at,
          passed: true,
          score: validScore ? { right: score.right as number, total: score.total as number } : undefined,
          failedParts: isSlugList(failedParts) ? failedParts : undefined,
          parts: isSlugList(parts) ? parts : undefined,
        });
        sendJson(response, 200, { at });
      });

      server.middlewares.use('/api/track', async (request, response) => {
        if (request.method !== 'POST') return sendJson(response, 405, { error: 'Use POST' });
        const track = (await readJson(request))?.track;
        if (!TRACKS.some((item) => item.slug === track)) {
          return sendJson(response, 400, { error: `Expected { track }, one of ${TRACKS.map((item) => item.slug).join(', ')}` });
        }
        const at = new Date().toISOString();
        appendLog({ type: 'track', track: track as string, at });
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
          include: ['{drills,placement,checkpoints,cross,electives}/**/*.test.ts'],
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
          include: ['{drills,placement,checkpoints,cross,electives}/**/*.browser.test.ts'],
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
