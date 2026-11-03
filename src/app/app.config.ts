import { ApplicationConfig, DEFAULT_CURRENCY_CODE } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    // Change this to switch the currency used by the `currency` pipe everywhere.
    { provide: DEFAULT_CURRENCY_CODE, useValue: 'INR' },
  ],
};
