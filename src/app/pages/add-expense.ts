import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ExpenseStore } from '../expense-store';
import { Expense } from '../models';
import { ExpenseFormComponent } from '../components/expense-form';

@Component({
  selector: 'app-add-expense',
  imports: [ExpenseFormComponent],
  template: `
    @if (store.members().length === 0) {
      <p class="panel">Add at least one member on the Overview page first.</p>
    } @else {
      <h2 class="mb-4 text-2xl font-bold">Add an expense</h2>
      <app-expense-form [members]="store.members()" (save)="onSave($event)" />
    }
  `,
})
export class AddExpenseComponent {
  store = inject(ExpenseStore);
  private router = inject(Router);

  onSave(expense: Expense) {
    this.store.addExpense(expense);
    this.router.navigate(['/expenses']); // programmatic routing
  }
}
