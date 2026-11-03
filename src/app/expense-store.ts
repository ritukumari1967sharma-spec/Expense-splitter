import { Injectable, effect, signal } from '@angular/core';
import { Expense } from './models';

const SEED_MEMBERS = ['Asha', 'Ravi', 'Meera', 'Dev'];
const SEED_EXPENSES: Expense[] = [
  { id: '1', title: 'Groceries', amount: 86.4, paidBy: 'Asha', splitAmong: SEED_MEMBERS, category: 'Food', date: '2026-10-28' },
  { id: '2', title: 'Cab to airport', amount: 42, paidBy: 'Ravi', splitAmong: ['Ravi', 'Meera'], category: 'Travel', date: '2026-10-30' },
  { id: '3', title: 'Electricity bill', amount: 120, paidBy: 'Dev', splitAmong: SEED_MEMBERS, category: 'Utilities', date: '2026-11-01' },
];

function load<T>(key: string, initial: T): T {
  try {
    const saved = localStorage.getItem(key);
    return saved ? (JSON.parse(saved) as T) : initial;
  } catch {
    return initial;
  }
}

/** One shared service holds the app state as signals; components inject it. */
@Injectable({ providedIn: 'root' })
export class ExpenseStore {
  readonly members = signal<string[]>(load('ng-es-members', SEED_MEMBERS));
  readonly expenses = signal<Expense[]>(load('ng-es-expenses', SEED_EXPENSES));

  constructor() {
    // Persist whenever the signals change
    effect(() => localStorage.setItem('ng-es-members', JSON.stringify(this.members())));
    effect(() => localStorage.setItem('ng-es-expenses', JSON.stringify(this.expenses())));
  }

  addExpense(expense: Expense) {
    this.expenses.update((list) => [expense, ...list]);
  }

  deleteExpense(id: string) {
    this.expenses.update((list) => list.filter((e) => e.id !== id));
  }

  addMember(name: string): boolean {
    const clean = name.trim();
    if (!clean || this.members().some((m) => m.toLowerCase() === clean.toLowerCase())) return false;
    this.members.update((list) => [...list, clean]);
    return true;
  }

  /** Returns false if the member still appears in an expense. */
  removeMember(name: string): boolean {
    const inUse = this.expenses().some((e) => e.paidBy === name || e.splitAmong.includes(name));
    if (inUse) return false;
    this.members.update((list) => list.filter((m) => m !== name));
    return true;
  }
}
