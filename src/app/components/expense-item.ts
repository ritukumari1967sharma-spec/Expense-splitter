import { Component, input, output } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { Expense } from '../models';
import { ButtonComponent } from './button';

@Component({
  selector: 'li[app-expense-item]',
  imports: [CurrencyPipe, ButtonComponent],
  host: { class: 'flex flex-col gap-2 py-4 sm:flex-row sm:items-center sm:justify-between' },
  template: `
    <div>
      <p class="font-medium">{{ expense().title }}</p>
      <p class="text-sm text-ink/70">
        {{ expense().paidBy }} paid · split between {{ expense().splitAmong.length }} · {{ expense().date }}
      </p>
      <span class="mt-1 inline-block rounded-full bg-pine-light px-2 py-0.5 text-xs text-pine-dark">
        {{ expense().category }}
      </span>
    </div>
    <div class="flex items-center gap-3">
      <span class="font-display text-xl font-bold">{{ expense().amount | currency }}</span>
      @if (deletable()) {
        <app-button variant="danger" (click)="remove.emit(expense().id)">Delete</app-button>
      }
    </div>
  `,
})
export class ExpenseItemComponent {
  expense = input.required<Expense>();
  deletable = input(false);
  remove = output<string>();
}
