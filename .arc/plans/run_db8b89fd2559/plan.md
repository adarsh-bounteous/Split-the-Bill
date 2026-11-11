summary: |
  Turn the ADR-0002 performance NFR (settlement recompute for 50 people and 500 expenses must take under 100 ms) into a permanent automated gate. A pure budget-check function (strictly less than 100 ms passes; exactly 100 ms or more fails) is unit-tested at the boundary, a vitest benchmark builds a 50-person / 500-expense group and times the settlement recompute against that gate, and a GitHub Actions workflow runs the gate on every pull request and every push to main so the result is reported as its own named check.
scope:
  - description: |
      Add the pure budget check. Signature:
      ```ts
      export const RECOMPUTE_BUDGET_MS = 100;
      export function withinRecomputeBudget(elapsedMs: number, budgetMs: number = RECOMPUTE_BUDGET_MS): boolean {
        return elapsedMs < budgetMs;
      }
      ```
      Strict `<` is deliberate: AC4 says exactly 100 ms fails.
    files:
      - apps/web/src/perf/recomputeBudget.ts
      - apps/web/src/perf/recomputeBudget.test.ts
    rationale: |
      Isolates the threshold semantics so the boundary (99.9 pass, 100 fail, 100.1 fail) is testable deterministically without depending on machine speed.
  - description: |
      Add a deterministic fixture builder `buildGroup(people = 50, expenses = 500)` returning people and expenses in integer minor units (paise, per ADR-0005), using a seeded PRNG (no Math.random) so runs are reproducible. Expenses vary payer and participant subsets, including uneven splits.
    files:
      - apps/web/src/perf/fixture.ts
    rationale: Gives the benchmark the exact AC3 workload, stable across runs.
  - description: |
      Add the settlement recompute that the gate measures, only if no settlement module exists when implementing (none exists at planning time: `apps/web/src` holds only app.ts, main.ts, style.css and app.test.ts). Pure and deterministic, integer minor units, remainder rule for uneven splits, balances sum to zero, at most n-1 payments, per ADR-0005:
      ```ts
      export function computeSettlement(group: Group): { balances: Record<string, number>; payments: Payment[] }
      ```
      If another story has already added one, reuse it and skip this item.
    files:
      - apps/web/src/settlement.ts
    rationale: The gate needs a real recompute function in the web app component to time. Kept minimal; correctness tests belong to the settlement story.
  - description: |
      Add the benchmark gate test. It warms up, then times `computeSettlement` on the 50/500 fixture with `performance.now()`, takes the median of several runs to cut CI noise, and asserts `withinRecomputeBudget(median)`. Failure message prints the measured ms and the 100 ms budget.
    files:
      - apps/web/src/perf/recompute.gate.test.ts
    rationale: This is the automatically-checked gate itself (AC3, AC5). Lives under `src/**/*.test.ts` so the existing vitest include pattern and `npm test` pick it up.
  - description: |
      Add `.github/workflows/settlement-recompute-gate.yml` triggered on `pull_request` and on `push` to `branches: [main]`. One job named `settlement-recompute-gate` on ubuntu-latest: checkout, setup-node 22 (matches `engines.node`), `npm ci` in apps/web, then `npx vitest run src/perf` in apps/web. A non-zero exit fails the check. Add an npm script `"test:perf": "vitest run src/perf"` to apps/web/package.json and call it from the workflow.
    files:
      - .github/workflows/settlement-recompute-gate.yml
      - apps/web/package.json
    rationale: Satisfies AC1 and AC2, since the check result is reported on the PR and on pushes to the default branch.
tests:
  - |
    AC4 (write first, in apps/web/src/perf/recomputeBudget.test.ts):
    ```ts
    expect(withinRecomputeBudget(100)).toBe(false);
    ```
  - |
    AC5 (same file):
    ```ts
    expect(withinRecomputeBudget(100.01)).toBe(false);
    expect(withinRecomputeBudget(250)).toBe(false);
    ```
  - |
    AC3 boundary (same file):
    ```ts
    expect(withinRecomputeBudget(99.99)).toBe(true);
    expect(withinRecomputeBudget(0)).toBe(true);
    ```
  - |
    AC3 end to end (apps/web/src/perf/recompute.gate.test.ts), fails until fixture and recompute exist and run fast enough:
    ```ts
    const group = buildGroup(50, 500);
    expect(group.people).toHaveLength(50);
    expect(group.expenses).toHaveLength(500);
    const median = medianMs(() => computeSettlement(group), 7);
    expect(withinRecomputeBudget(median), `recompute took ${median.toFixed(1)} ms, budget ${RECOMPUTE_BUDGET_MS} ms`).toBe(true);
    ```
  - |
    Gate sensitivity (AC4/AC5 wired to the real measurement path): inject a slow recompute that busy-waits 100 ms and assert the same gate helper reports failure:
    ```ts
    expect(withinRecomputeBudget(medianMs(() => busyWait(100), 3))).toBe(false);
    ```
  - |
    AC1 and AC2 are verified by the workflow itself: open a PR and push to main, then confirm the `settlement-recompute-gate` check appears. Run locally with `cd apps/web && npx vitest run src/perf/recomputeBudget.test.ts` for the unit file and `cd apps/web && npx vitest run src/perf/recompute.gate.test.ts` for the benchmark.
assumptions_or_open_questions:
  - |
    No settlement module exists in apps/web/src today (I listed the directory), although ADR-0005 and the stack notes say settlement logic is a pure TypeScript module. I plan a minimal `settlement.ts` so there is something to time; if a separate story owns it, this plan should instead depend on it. Reviewer to confirm.
  - |
    No `.github/` directory exists (Glob returned nothing), so I assume GitHub Actions is the CI, based on the repo's PR-numbered commit history. Confirm the host. Making the check required for merge is a repository setting outside the code and is not planned here.
  - |
    Measured in vitest on the node environment, not in a browser. The "web app component" is read as the apps/web TypeScript module, since the stack states logic is pure TS with no backend. A Playwright browser measurement would be slower and noisier, so it is not planned.
  - |
    Timing on shared CI runners is noisy. I use the median of 7 runs after a warm-up and the fixed 100 ms threshold from ADR-0002, with no tolerance added. Expected real recompute time is far below 100 ms, so flakiness should be low.
estimated_points: 3
package_dependencies: []
notes: |
  ### Data & rollout

  None — test and CI configuration only, with no stored data, schema, or runtime settings. Rollback is deleting the workflow and the perf tests.

  Context: ADR-0002 sets the metric and threshold, ADR-0005 requires integer minor units and pure logic. Existing conventions: vitest `include: ['src/**/*.test.ts']` in apps/web/vite.config.ts, `"test": "vitest run"` in package.json, Node 22.

  ```mermaid
  flowchart TD
    wf[".github/workflows/settlement-recompute-gate.yml"] -->|runs npm run test:perf| gate["perf/recompute.gate.test.ts"]
    gate --> fx["perf/fixture.ts"]
    gate --> bud["perf/recomputeBudget.ts"]
    gate --> st["settlement.ts"]
    pkg["apps/web/package.json"] -.->|adds test:perf script| wf
    vite["vite.config.ts include pattern"] -.->|picks up tests, unchanged| gate
    classDef touched fill:#f96,color:#000
    class wf,gate,fx,bud,st,pkg touched
  ```
review_focus: |
  IN scope: the strict less-than 100 ms budget check, the 50-person / 500-expense benchmark test, and a CI workflow on pull_request and push to main. OUT: settlement correctness beyond what is needed to time it, making the check merge-required, and browser-based timing. Riskiest parts are the `<` versus `<=` boundary (exactly 100 ms must fail) and benchmark flakiness on CI, so the median-of-runs approach is deliberate. The minimal `settlement.ts` exists only because no recompute function exists yet.
