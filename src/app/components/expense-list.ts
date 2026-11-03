import { Component, input, output } from '@angular/core';
import { Expense } from '../models';
import { ExpenseItemComponent } from './expense-item';

@Component({
  selector: 'app-expense-list',
  imports: [ExpenseItemComponent],
  template: `
    @if (expenses().length === 0) {
      <p class="py-6 text-center text-ink/70">{{ emptyText() }}</p>
    } @else {
      <ul class="divide-y divide-ink/10">
        @for (e of expenses(); track e.id) {
          <li app-expense-item [expense]="e" [deletable]="deletable()" (remove)="remove.emit($event)"></li>
        }
      </ul>
    }
  `,
})
export class ExpenseListComponent {
  expenses = input.required<Expense[]>();
  emptyText = input('No expenses yet.');
  deletable = input(false);
  remove = output<string>();
}
