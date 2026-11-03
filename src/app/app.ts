import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent],
  template: `
    <app-navbar groupName="Expense-splitter" />
    <main class="mx-auto max-w-5xl px-4 py-6">
      <router-outlet />
    </main>
  `,
})
export class App {}
