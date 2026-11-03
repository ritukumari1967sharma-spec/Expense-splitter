import { Expense, Payment } from './models';

// All maths is done in whole cents to avoid floating-point drift.
const toCents = (n: number) => Math.round(n * 100);

/**
 * Net balance per member, in cents.
 * Positive => the group owes this person. Negative => this person owes the group.
 */
export function computeBalances(members: string[], expenses: Expense[]): Record<string, number> {
  const net: Record<string, number> = Object.fromEntries(members.map((m) => [m, 0]));

  for (const exp of expenses) {
    const total = toCents(exp.amount);
    const people = exp.splitAmong.filter((p) => p in net);
    if (people.length === 0) continue;

    const share = Math.floor(total / people.length);
    let remainder = total - share * people.length; // spread leftover cents

    net[exp.paidBy] = (net[exp.paidBy] ?? 0) + total;
    for (const p of people) {
      const extra = remainder > 0 ? 1 : 0;
      remainder -= extra;
      net[p] -= share + extra;
    }
  }
  return net;
}

/** Greedy settlement: match the biggest debtor with the biggest creditor. */
export function suggestSettlements(net: Record<string, number>): Payment[] {
  const creditors = Object.entries(net)
    .filter(([, v]) => v > 0)
    .map(([name, v]) => ({ name, v }))
    .sort((a, b) => b.v - a.v);
  const debtors = Object.entries(net)
    .filter(([, v]) => v < 0)
    .map(([name, v]) => ({ name, v: -v }))
    .sort((a, b) => b.v - a.v);

  const payments: Payment[] = [];
  let i = 0;
  let j = 0;
  while (i < debtors.length && j < creditors.length) {
    const pay = Math.min(debtors[i].v, creditors[j].v);
    payments.push({ from: debtors[i].name, to: creditors[j].name, amount: pay / 100 });
    debtors[i].v -= pay;
    creditors[j].v -= pay;
    if (debtors[i].v === 0) i++;
    if (creditors[j].v === 0) j++;
  }
  return payments;
}
