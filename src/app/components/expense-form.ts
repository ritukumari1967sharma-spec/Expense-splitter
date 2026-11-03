import { Component, OnInit, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CATEGORIES, Expense } from '../models';
import { ButtonComponent } from './button';

@Component({
  selector: 'app-expense-form',
  imports: [FormsModule, ButtonComponent],
  template: `
    <form (ngSubmit)="submit()" class="panel grid gap-4 sm:grid-cols-2">
      <div class="sm:col-span-2">
        <label class="label" for="title">What was it for?</label>
        <input id="title" name="title" class="field" placeholder="Dinner at the lake" [(ngModel)]="title" />
      </div>

      <div>
        <label class="label" for="amount">Amount</label>
        <input id="amount" name="amount" type="number" min="0" step="0.01" class="field" [(ngModel)]="amount" />
      </div>

      <div>
        <label class="label" for="paidBy">Paid by</label>
        <select id="paidBy" name="paidBy" class="field" [(ngModel)]="paidBy">
          @for (m of members(); track m) {
            <option [value]="m">{{ m }}</option>
          }
        </select>
      </div>

      <div>
        <label class="label" for="category">Category</label>
        <select id="category" name="category" class="field" [(ngModel)]="category">
          @for (c of categories; track c) {
            <option [value]="c">{{ c }}</option>
          }
        </select>
      </div>

      <div>
        <label class="label" for="date">Date</label>
        <input id="date" name="date" type="date" class="field" [(ngModel)]="date" />
      </div>

      <fieldset class="sm:col-span-2">
        <legend class="label">Split between</legend>
        <div class="flex flex-wrap gap-2">
          @for (m of members(); track m) {
            <label [class]="chipClass(m)">
              <input type="checkbox" class="sr-only" [checked]="splitAmong().includes(m)" (change)="toggle(m)" />
              {{ m }}
            </label>
          }
        </div>
      </fieldset>

      @if (error()) {
        <p role="alert" class="text-sm text-brick sm:col-span-2">{{ error() }}</p>
      }

      <div class="sm:col-span-2">
        <app-button type="submit">Save expense</app-button>
      </div>
    </form>
  `,
})
export class ExpenseFormComponent implements OnInit {
  members = input.required<string[]>();
  save = output<Expense>();

  categories = CATEGORIES;

  // Form state as signals
  title = signal('');
  amount = signal<number | null>(null);
  paidBy = signal('');
  category = signal(CATEGORIES[0]);
  date = signal(new Date().toISOString().slice(0, 10));
  splitAmong = signal<string[]>([]);
  error = signal('');

  ngOnInit() {
    this.paidBy.set(this.members()[0] ?? '');
    this.splitAmong.set([...this.members()]);
  }

  chipClass(name: string): string {
    const base = 'cursor-pointer rounded-full px-3 py-1 text-sm ring-1 ';
    return base + (this.splitAmong().includes(name) ? 'bg-pine text-white ring-pine' : 'bg-white ring-ink/20');
  }

  toggle(name: string) {
    this.splitAmong.update((list) => (list.includes(name) ? list.filter((m) => m !== name) : [...list, name]));
  }

  submit() {
    const value = Number(this.amount());

    if (!this.title().trim()) return this.error.set('Give the expense a name.');
    if (!(value > 0)) return this.error.set('Enter an amount greater than 0.');
    if (this.splitAmong().length === 0) return this.error.set('Pick at least one person to split with.');

    this.save.emit({
      id: crypto.randomUUID(),
      title: this.title().trim(),
      amount: value,
      paidBy: this.paidBy(),
      splitAmong: this.splitAmong(),
      category: this.category(),
      date: this.date(),
    });

    this.title.set('');
    this.amount.set(null);
    this.error.set('');
  }
}
