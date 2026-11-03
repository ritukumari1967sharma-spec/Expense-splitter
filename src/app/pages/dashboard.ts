import { Component, computed, inject, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ExpenseStore } from '../expense-store';
import { StatCardComponent } from '../components/stat-card';
import { ExpenseListComponent } from '../components/expense-list';
import { ButtonComponent } from '../components/button';

@Component({
  selector: 'app-dashboard',
  imports: [CurrencyPipe, FormsModule, RouterLink, StatCardComponent, ExpenseListComponent, ButtonComponent],
  template: `
    <div class="space-y-6">
      <section class="grid gap-4 sm:grid-cols-3">
        <app-stat-card label="Total spent" [value]="total() | currency" [hint]="store.expenses().length + ' expenses'" />
        <app-stat-card
          label="Average per person"
          [value]="perPerson() | currency"
          [hint]="store.members().length + ' members'"
        />
        <app-stat-card
          label="Biggest category"
          [value]="topCategory()?.name ?? '—'"
          [hint]="topCategory() ? (topCategory()!.amount | currency) : 'Nothing logged yet'"
        />
      </section>

      <section class="panel">
        <h2 class="mb-3 text-xl font-bold">Members</h2>
        <ul class="mb-4 flex flex-wrap gap-2">
          @for (m of store.members(); track m) {
            <li class="flex items-center gap-2 rounded-full bg-pine-light px-3 py-1 text-sm">
              {{ m }}
              <button
                class="cursor-pointer text-pine-dark hover:text-brick"
                [attr.aria-label]="'Remove ' + m"
                (click)="removeMember(m)"
              >
                ×
              </button>
            </li>
          }
        </ul>
        <form (ngSubmit)="addMember()" class="flex gap-2">
          <input class="field" name="newName" placeholder="Add a member" aria-label="New member name" [(ngModel)]="newName" />
          <app-button type="submit" variant="accent">Add</app-button>
        </form>
      </section>

      <section class="panel">
        <div class="mb-2 flex items-center justify-between">
          <h2 class="text-xl font-bold">Latest expenses</h2>
          <a routerLink="/expenses" class="text-sm text-pine-dark underline">See all</a>
        </div>
        <app-expense-list [expenses]="recent()" emptyText="No expenses yet. Add your first one." />
      </section>
    </div>
  `,
})
export class DashboardComponent {
  store = inject(ExpenseStore);
  newName = signal('');

  // Derived values: computed() re-runs only when the signals it reads change
  total = computed(() => this.store.expenses().reduce((sum, e) => sum + e.amount, 0));

  perPerson = computed(() => {
    const count = this.store.members().length;
    return count ? this.total() / count : 0;
  });

  recent = computed(() => [...this.store.expenses()].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 3));

  topCategory = computed(() => {
    const byCategory: Record<string, number> = {};
    for (const e of this.store.expenses()) {
      byCategory[e.category] = (byCategory[e.category] ?? 0) + e.amount;
    }
    const top = Object.entries(byCategory).sort((a, b) => b[1] - a[1])[0];
    return top ? { name: top[0], amount: top[1] } : null;
  });

  addMember() {
    if (this.store.addMember(this.newName())) this.newName.set('');
  }

  removeMember(name: string) {
    if (!this.store.removeMember(name)) {
      alert(`${name} is part of existing expenses. Delete those expenses first.`);
    }
  }
}
