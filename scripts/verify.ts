// Proves the two invariants a test can check: every code drill's starter fails its acceptance
// check, and every reference solution in /solutions passes it.
import { runVitest } from './lib/vitest';

const solutionResults = runVitest([], { env: { DRILL_SOURCE: 'solutions' }, quiet: true });
const starterResults = runVitest([], { quiet: true });

if (solutionResults.length === 0 && starterResults.length === 0) {
  console.log('No code drills yet. Read-the-code pages are checked on the page, not by tests.');
} else {
  const failingSolutions = solutionResults.filter((result) => !result.passed);
  const passingStarters = starterResults.filter((result) => result.passed);

  console.log(`Solutions: ${solutionResults.length - failingSolutions.length}/${solutionResults.length} pass`);
  for (const result of failingSolutions) console.log(`  ✗ ${result.file}`);

  console.log(`Starters:  ${starterResults.length - passingStarters.length}/${starterResults.length} fail as they should`);
  for (const result of passingStarters) console.log(`  ✗ ${result.file} passes before it's solved`);

  if (failingSolutions.length > 0 || passingStarters.length > 0) process.exitCode = 1;
}
