import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard';
import { AddExpenseComponent } from './pages/add-expense';
import { ExpensesComponent } from './pages/expenses';
import { SettleComponent } from './pages/settle';
import { NotFoundComponent } from './pages/not-found';

export const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'add', component: AddExpenseComponent },
  { path: 'expenses', component: ExpensesComponent },
  { path: 'settle', component: SettleComponent },
  { path: '**', component: NotFoundComponent },
];
