import type { Expense, Group, Person } from '../settlement';

/** mulberry32: small seeded PRNG so fixtures are reproducible (no Math.random). */
function seededRandom(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Deterministic group; amounts in integer paise, with uneven splits. */
export function buildGroup(people = 50, expenses = 500): Group {
  const rand = seededRandom(42);
  const ppl: Person[] = Array.from({ length: people }, (_, i) => ({ id: `p${i}` }));
  const exps: Expense[] = [];
  for (let i = 0; i < expenses; i++) {
    const payerId = ppl[Math.floor(rand() * people)].id;
    const count = 2 + Math.floor(rand() * Math.max(1, people - 1));
    const participantIds = ppl
      .map((p) => ({ id: p.id, k: rand() }))
      .sort((x, y) => x.k - y.k)
      .slice(0, count)
      .map((p) => p.id);
    exps.push({
      id: `e${i}`,
      payerId,
      amount: 100 + Math.floor(rand() * 500000),
      participantIds,
    });
  }
  return { people: ppl, expenses: exps };
}
