export interface Expense {
  id: string;
  title: string;
  amount: number;
  paidBy: string;
  splitAmong: string[];
  category: string;
  date: string; // yyyy-mm-dd
}

export interface Payment {
  from: string;
  to: string;
  amount: number;
}

export const CATEGORIES = ['Food', 'Travel', 'Rent', 'Utilities', 'Fun', 'Other'];
