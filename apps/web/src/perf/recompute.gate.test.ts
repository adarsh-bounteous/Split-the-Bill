import { describe, expect, it } from 'vitest';
import { computeSettlement } from '../settlement';
import { buildGroup } from './fixture';
import { RECOMPUTE_BUDGET_MS, withinRecomputeBudget } from './recomputeBudget';

function medianMs(fn: () => unknown, runs: number): number {
  fn(); // warm-up
  const samples: number[] = [];
  for (let i = 0; i < runs; i++) {
    const start = performance.now();
    fn();
    samples.push(performance.now() - start);
  }
  samples.sort((a, b) => a - b);
  return samples[Math.floor(samples.length / 2)];
}

function busyWait(ms: number): void {
  const end = performance.now() + ms;
  while (performance.now() < end) {
    // spin
  }
}

describe('settlement recompute gate (50 people, 500 expenses)', () => {
  it('builds the expected workload', () => {
    const group = buildGroup(50, 500);
    expect(group.people).toHaveLength(50);
    expect(group.expenses).toHaveLength(500);
  });

  it('recomputes in under the budget', () => {
    const group = buildGroup(50, 500);
    const median = medianMs(() => computeSettlement(group), 7);
    expect(
      withinRecomputeBudget(median),
      `recompute took ${median.toFixed(1)} ms, budget ${RECOMPUTE_BUDGET_MS} ms`,
    ).toBe(true);
  });

  it('settles to zero balances', () => {
    const { balances } = computeSettlement(buildGroup(50, 500));
    expect(Object.values(balances).reduce((a, b) => a + b, 0)).toBe(0);
  });

  it('gate fails for a recompute that takes the full budget', () => {
    expect(withinRecomputeBudget(medianMs(() => busyWait(100), 3))).toBe(false);
  });
});
