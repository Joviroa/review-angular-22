import { Component } from '@angular/core';
import { TaskApiService } from '../../../core/api/task-api.service';

@Component({
  selector: 'app-task-statistics',
  imports: [],
  template: `
    <section>
      <h2>Estatísticas</h2>

      <p>Total: {{ total }}</p>
      <p>Concluídas: {{ completed }}</p>
      <p>Pendentes: {{ pending }}</p>
    </section>
  `,
  styles: ``,
})
export class TaskStatistics {
  total = 0;
  completed = 0;
  pending = 0;

  // Usar inject()
  constructor(private taskApiService: TaskApiService) {
    this.total = taskApiService.tasks().length;
    this.completed = taskApiService.tasks().filter(task => task.status === 'done').length;
    this.pending = taskApiService.tasks().filter(task => task.status === 'pending').length;
  }

}
