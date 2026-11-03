import { Component, computed, input } from '@angular/core';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-balance-list',
  imports: [CurrencyPipe],
  template: `
    <ul class="space-y-4">
      @for (r of rows(); track r.name) {
        <li>
          <div class="mb-1 flex justify-between text-sm">
            <span class="font-medium">{{ r.name }}</span>
            <span [class]="r.cents >= 0 ? 'text-pine-dark' : 'text-brick'">
              @if (r.cents === 0) {
                All square
              } @else if (r.cents > 0) {
                is owed {{ r.amount | currency }}
              } @else {
                owes {{ r.amount | currency }}
              }
            </span>
          </div>
          <div class="rounded bg-ink/10">
            <!-- Styling approach 4: style bindings for values computed at runtime -->
            <div
              class="h-2 rounded transition-[width] duration-300"
              [style.width.%]="r.pct"
              [style.backgroundColor]="r.cents >= 0 ? '#2F6F5E' : '#B5453A'"
            ></div>
          </div>
        </li>
      }
    </ul>
  `,
})
export class BalanceListComponent {
  net = input.required<Record<string, number>>();

  rows = computed(() => {
    const entries = Object.entries(this.net());
    const max = Math.max(1, ...entries.map(([, v]) => Math.abs(v)));
    return entries.map(([name, cents]) => ({
      name,
      cents,
      amount: Math.abs(cents) / 100,
      pct: (Math.abs(cents) / max) * 100,
    }));
  });
}
