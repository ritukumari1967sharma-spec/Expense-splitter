import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ExpenseStore } from '../expense-store';
import { CATEGORIES } from '../models';
import { ExpenseListComponent } from '../components/expense-list';

@Component({
  selector: 'app-expenses',
  imports: [FormsModule, ExpenseListComponent],
  template: `
    <div class="space-y-4">
      <h2 class="text-2xl font-bold">All expenses</h2>
      <div class="flex flex-col gap-2 sm:flex-row">
        <input class="field" name="query" placeholder="Search by name" aria-label="Search expenses" [(ngModel)]="query" />
        <select class="field sm:w-48" name="category" aria-label="Filter by category" [(ngModel)]="category">
          <option value="All">All</option>
          @for (c of categories; track c) {
            <option [value]="c">{{ c }}</option>
          }
        </select>
      </div>
      <div class="panel">
        <app-expense-list
          [expenses]="visible()"
          [deletable]="true"
          emptyText="No expenses match. Try another search or category."
          (remove)="store.deleteExpense($event)"
        />
      </div>
    </div>
  `,
})
export class ExpensesComponent {
  store = inject(ExpenseStore);
  categories = CATEGORIES;

  query = signal('');
  category = signal('All');

  // filter + sort, recomputed only when an input signal changes
  visible = computed(() =>
    this.store
      .expenses()
      .filter((e) => e.title.toLowerCase().includes(this.query().toLowerCase()))
      .filter((e) => this.category() === 'All' || e.category === this.category())
      .sort((a, b) => b.date.localeCompare(a.date)),
  );
}
