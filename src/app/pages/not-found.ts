import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  imports: [RouterLink],
  template: `
    <div class="panel text-center">
      <h2 class="text-2xl font-bold">Page not found</h2>
      <p class="my-3 text-ink/70">That address doesn't exist in this app.</p>
      <a routerLink="/" class="text-pine-dark underline">Back to overview</a>
    </div>
  `,
})
export class NotFoundComponent {}
