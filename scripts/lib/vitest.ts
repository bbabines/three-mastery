// Runs Vitest once and reads its JSON report.
import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, rmSync } from 'node:fs';
import path from 'node:path';
import { ROOT } from './repo';

export interface FileResult {
  file: string;
  passed: boolean;
  // Top-level describe blocks with a failing test. Placement parts and checkpoint domains use these.
  failedSuites: string[];
}

interface JsonReport {
  testResults: {
    name: string;
    status: string;
    assertionResults: { status: string; ancestorTitles: string[] }[];
  }[];
}

// Vitest's own entry, run through Node: `node_modules/.bin/vitest` is a shell script that Windows
// can't spawn directly.
const VITEST = path.join(ROOT, 'node_modules', 'vitest', 'vitest.mjs');
const REPORT_FILE = path.join(ROOT, '.pick', 'vitest.json');

// Empty `targets` runs every test. `quiet` hides Vitest's own output.
export function runVitest(targets: string[], options: { env?: Record<string, string>; quiet?: boolean } = {}) {
  mkdirSync(path.dirname(REPORT_FILE), { recursive: true });
  rmSync(REPORT_FILE, { force: true });

  const reporters = options.quiet ? ['--reporter=json'] : ['--reporter=default', '--reporter=json'];
  spawnSync(process.execPath, [VITEST, 'run', ...targets, ...reporters, `--outputFile.json=${REPORT_FILE}`], {
    cwd: ROOT,
    env: { ...process.env, ...options.env },
    stdio: options.quiet ? 'ignore' : 'inherit',
  });

  if (!existsSync(REPORT_FILE)) return [];
  const report = JSON.parse(readFileSync(REPORT_FILE, 'utf8')) as JsonReport;
  return report.testResults.map((result): FileResult => {
    const failing = result.assertionResults.filter((assertion) => assertion.status === 'failed');
    return {
      file: path.relative(ROOT, result.name),
      passed: result.status === 'passed',
      failedSuites: [...new Set(failing.map((assertion) => assertion.ancestorTitles[0]).filter(Boolean))],
    };
  });
}
