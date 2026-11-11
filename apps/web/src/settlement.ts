/** Amounts are integer minor units (paise), per ADR-0005. */
export interface Person {
  id: string;
}

export interface Expense {
  id: string;
  payerId: string;
  amount: number;
  participantIds: string[];
}

export interface Group {
  people: Person[];
  expenses: Expense[];
}

export interface Payment {
  from: string;
  to: string;
  amount: number;
}

export interface Settlement {
  balances: Record<string, number>;
  payments: Payment[];
}

/**
 * Pure, deterministic settlement. Uneven splits: the remainder minor units go
 * one each to the first participants in list order. Positive balance = is owed.
 */
export function computeSettlement(group: Group): Settlement {
  const balances: Record<string, number> = {};
  for (const p of group.people) balances[p.id] = 0;

  for (const e of group.expenses) {
    const n = e.participantIds.length;
    if (n === 0) continue;
    const share = Math.floor(e.amount / n);
    const remainder = e.amount - share * n;
    balances[e.payerId] += e.amount;
    e.participantIds.forEach((id, i) => {
      balances[id] -= share + (i < remainder ? 1 : 0);
    });
  }

  const creditors = Object.entries(balances)
    .filter(([, b]) => b > 0)
    .map(([id, b]) => ({ id, b }))
    .sort((x, y) => y.b - x.b || x.id.localeCompare(y.id));
  const debtors = Object.entries(balances)
    .filter(([, b]) => b < 0)
    .map(([id, b]) => ({ id, b: -b }))
    .sort((x, y) => y.b - x.b || x.id.localeCompare(y.id));

  const payments: Payment[] = [];
  let ci = 0;
  let di = 0;
  while (ci < creditors.length && di < debtors.length) {
    const c = creditors[ci];
    const d = debtors[di];
    const amount = Math.min(c.b, d.b);
    payments.push({ from: d.id, to: c.id, amount });
    c.b -= amount;
    d.b -= amount;
    if (c.b === 0) ci++;
    if (d.b === 0) di++;
  }

  return { balances, payments };
}
