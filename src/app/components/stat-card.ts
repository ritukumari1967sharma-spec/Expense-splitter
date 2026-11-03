import { Component, input } from '@angular/core';

@Component({
  selector: 'app-stat-card',
  template: `
    <div class="panel">
      <p class="text-sm text-ink/70">{{ label() }}</p>
      <p class="mt-1 font-display text-3xl font-bold">{{ value() }}</p>
      @if (hint()) {
        <p class="mt-1 text-xs text-ink/60">{{ hint() }}</p>
      }
    </div>
  `,
})
export class StatCardComponent {
  label = input.required<string>();
  value = input.required<string | null>();
  hint = input<string | null>('');
}
