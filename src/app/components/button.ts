import { Component, computed, input } from '@angular/core';

const VARIANTS = {
  primary: 'bg-pine text-white hover:bg-pine-dark',
  accent: 'bg-amber text-ink hover:bg-amber-dark',
  ghost: 'bg-transparent text-ink ring-1 ring-ink/20 hover:bg-ink/5',
  danger: 'bg-transparent text-brick ring-1 ring-brick/40 hover:bg-brick/10',
};

@Component({
  selector: 'app-button',
  template: `<button [type]="type()" [class]="classes()"><ng-content /></button>`,
})
export class ButtonComponent {
  variant = input<keyof typeof VARIANTS>('primary');
  type = input<'button' | 'submit'>('button');

  classes = computed(
    () => `cursor-pointer rounded-lg px-4 py-2 text-sm font-medium transition-colors ${VARIANTS[this.variant()]}`,
  );
}
