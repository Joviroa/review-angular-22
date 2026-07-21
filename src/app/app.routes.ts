import { Routes } from '@angular/router';
import { AuthGuard } from './core/auth/auth.guard';
import { LoginComponent } from './features/auth/login.component';
import { DashboardShellComponent } from './layout/dashboard-shell.component';

export const APP_ROUTES: Routes = [
  { path: '', redirectTo: 'tasks', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: 'tasks',
    component: DashboardShellComponent,
    canActivate: [AuthGuard],
    loadChildren: () => import('./features/tasks/tasks.routes').then(m => m.TASKS_ROUTES)
  },
  { path: '**', redirectTo: 'tasks' }
];