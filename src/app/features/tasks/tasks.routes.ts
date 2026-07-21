import { Routes } from '@angular/router';
import { TaskListComponent } from './pages/task-list.component';
import { TaskDetailComponent } from './pages/task-detail.component';

export const TASKS_ROUTES: Routes = [
  { path: '', component: TaskListComponent },
  { path: 'new', component: TaskDetailComponent },
  { path: ':id', component: TaskDetailComponent }
];

