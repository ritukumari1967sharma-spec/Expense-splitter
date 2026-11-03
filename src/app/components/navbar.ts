import { Component, input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  styleUrl: './navbar.css',
  template: `
    <header class="bar">
      <nav class="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-2 px-4 py-3">
        <span class="font-display text-lg font-bold text-white">{{ groupName() }}</span>
        <div class="flex flex-wrap gap-1">
          @for (l of links; track l.to) {
            <a
              class="link"
              [routerLink]="l.to"
              routerLinkActive="active"
              [routerLinkActiveOptions]="{ exact: l.exact }"
              >{{ l.label }}</a
            >
          }
        </div>
      </nav>
    </header>
  `,
})
export class NavbarComponent {
  groupName = input.required<string>();

  links = [
    { to: '/', label: 'Overview', exact: true },
    { to: '/add', label: 'Add expense', exact: false },
    { to: '/expenses', label: 'Expenses', exact: false },
    { to: '/settle', label: 'Settle up', exact: false },
  ];
}
