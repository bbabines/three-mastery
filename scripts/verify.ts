// Proves starters fail, references pass, and reference regression checks reject the bug.
import { existsSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { runVitest } from './lib/vitest';
import { ROOT } from './lib/repo';

const regressionChecks = ['drills', 'cross'].flatMap((top) => {
  const dir = path.join(ROOT, top);
  if (!existsSync(dir)) return [];
  return readdirSync(dir, { recursive: true, withFileTypes: true })
    .filter((entry) => entry.isFile() && /^check(?:\.browser)?\.test\.ts$/.test(entry.name))
    .map((entry) => path.relative(ROOT, path.join(entry.parentPath, entry.name)).split(path.sep).join('/'));
});

const solutionResults = runVitest([], { env: { DRILL_SOURCE: 'solutions' }, quiet: true });
const starterResults = runVitest([], { quiet: true });
const brokenCheckResults = regressionChecks.length
  ? runVitest(regressionChecks, { env: { CHECK_SOURCE: 'solutions' }, quiet: true })
  : [];

if (solutionResults.length === 0 && starterResults.length === 0) {
  console.log('No code drills yet. Read-the-code pages are checked on the page, not by tests.');
} else {
  const failingSolutions = solutionResults.filter((result) => !result.passed);
  const passingStarters = starterResults.filter((result) => result.passed);

  console.log(`Solutions: ${solutionResults.length - failingSolutions.length}/${solutionResults.length} pass`);
  for (const result of failingSolutions) console.log(`  ✗ ${result.file}`);

  console.log(`Starters:  ${starterResults.length - passingStarters.length}/${starterResults.length} fail as they should`);
  for (const result of passingStarters) console.log(`  ✗ ${result.file} passes before it's solved`);

  const ineffectiveChecks = brokenCheckResults.filter((result) => result.passed || result.failedSuites.length === 0);
  const missingChecks = regressionChecks.filter((file) => !brokenCheckResults.some((result) => result.file.split(path.sep).join('/') === file));
  if (regressionChecks.length) {
    console.log(`Regression checks: ${brokenCheckResults.length - ineffectiveChecks.length}/${regressionChecks.length} reject the bug`);
    for (const result of ineffectiveChecks) console.log(`  ✗ ${result.file} did not fail a regression test on broken code`);
    for (const file of missingChecks) console.log(`  ✗ ${file} did not run`);
  }

  if (failingSolutions.length > 0 || passingStarters.length > 0 || ineffectiveChecks.length > 0 || missingChecks.length > 0) process.exitCode = 1;
}
