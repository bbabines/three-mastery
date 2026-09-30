# Checkpoints

One no-docs set per loop, sampling every domain. Nothing is timed. It's a self-check, not a gate: once you've taken it, `pick.ts` moves on to the next loop, whatever the score.

The viewer shows each loop's checkpoint at the end of that loop in the sidebar.

**Loop 1's checkpoint is a read-the-code quiz,** like the Loop 1 pages, not a code test: `checkpoints/1/README.md` (frontmatter `id: 1.checkpoint`, `loop: 1`) and `questions.ts`, 2 questions per domain with each question's `domain` set to the domain slug. There's no pass bar (Brad's call). When the last question is answered, the page names the domains with misses and logs them as `failedParts`, which `pick.ts` uses to weight maintenance; `pick -- done` knows the page logs it. It has no `check.ts`, so `coverage` expects no reference answer.

**Loops 2–4 checkpoints** can be code tests: `checkpoints/<loop>/README.md` (frontmatter `id: <loop>.checkpoint`, `loop`), plus `check.ts` and `check.test.ts` with one `describe` block per domain slug, so `pick.ts` can log which domains missed. Reference answers go in `solutions/checkpoints/<loop>/check.ts`.
