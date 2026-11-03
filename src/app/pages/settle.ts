import { Component, computed, inject } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { ExpenseStore } from '../expense-store';
import { computeBalances, suggestSettlements } from '../balances';
import { BalanceListComponent } from '../components/balance-list';

@Component({
  selector: 'app-settle',
  imports: [CurrencyPipe, BalanceListComponent],
  template: `
    <div class="grid gap-6 md:grid-cols-2">
      <section class="panel">
        <h2 class="mb-4 text-xl font-bold">Who owes what</h2>
        <app-balance-list [net]="net()" />
      </section>

      <section class="panel">
        <h2 class="mb-4 text-xl font-bold">
          Settle up in {{ payments().length }} {{ payments().length === 1 ? 'payment' : 'payments' }}
        </h2>
        @if (payments().length === 0) {
          <p class="text-ink/70">Everyone is square. Nothing to pay.</p>
        } @else {
          <ul class="space-y-3">
            @for (p of payments(); track $index) {
              <li class="flex items-center justify-between rounded-lg bg-amber/20 px-4 py-3">
                <span><strong>{{ p.from }}</strong> pays <strong>{{ p.to }}</strong></span>
                <span class="font-display text-lg font-bold">{{ p.amount | currency }}</span>
              </li>
            }
          </ul>
        }
      </section>
    </div>
  `,
})
export class SettleComponent {
  private store = inject(ExpenseStore);

  net = computed(() => computeBalances(this.store.members(), this.store.expenses()));
  payments = computed(() => suggestSettlements(this.net()));
}
