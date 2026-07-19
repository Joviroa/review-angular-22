import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { TasksRoutingModule } from './tasks-routing.module';

// Components
import { TaskCardComponent } from './components/task-card.component';
import { TaskFiltersComponent } from './components/task-filters.component';

// Pages
import { TaskListComponent } from './pages/task-list.component';
import { TaskDetailComponent } from './pages/task-detail.component';

@NgModule({
  declarations: [
    TaskCardComponent,
    TaskFiltersComponent,
    TaskListComponent,
    TaskDetailComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TasksRoutingModule
  ]
})
export class TasksModule { }
