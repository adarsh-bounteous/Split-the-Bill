/** ADR-0002: settlement recompute for 50 people / 500 expenses must stay under this. */
export const RECOMPUTE_BUDGET_MS = 100;

/** Strictly less than the budget: exactly the budget counts as a failure. */
export function withinRecomputeBudget(
  elapsedMs: number,
  budgetMs: number = RECOMPUTE_BUDGET_MS,
): boolean {
  return elapsedMs < budgetMs;
}
