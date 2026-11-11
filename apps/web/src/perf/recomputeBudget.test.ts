import { describe, expect, it } from 'vitest';
import { RECOMPUTE_BUDGET_MS, withinRecomputeBudget } from './recomputeBudget';

describe('withinRecomputeBudget', () => {
  it('budget is 100 ms', () => {
    expect(RECOMPUTE_BUDGET_MS).toBe(100);
  });

  it('passes when strictly under the budget', () => {
    expect(withinRecomputeBudget(99.99)).toBe(true);
    expect(withinRecomputeBudget(0)).toBe(true);
  });

  it('fails at exactly the budget', () => {
    expect(withinRecomputeBudget(100)).toBe(false);
  });

  it('fails above the budget', () => {
    expect(withinRecomputeBudget(100.01)).toBe(false);
    expect(withinRecomputeBudget(250)).toBe(false);
  });
});
