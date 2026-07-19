import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login.component';
import { DashboardShellComponent } from './layout/dashboard-shell.component';
import { AuthGuard } from './core/auth/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: 'tasks', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: 'tasks',
    component: DashboardShellComponent,
    canActivate: [AuthGuard],
    // PONTO DE MIGRAÇÃO FUTURA: A sintaxe do lazy loading é a mesma, mas no Angular moderno standalone não precisamos de TasksModule, mas sim de rotas diretas (loadChildren: () => import(...).then(m => m.TASKS_ROUTES))
    loadChildren: () => import('./features/tasks/tasks.module').then(m => m.TasksModule)
  },
  // Redireciona qualquer rota inválida de volta para tarefas (que direciona para login se não autenticado)
  { path: '**', redirectTo: 'tasks' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
