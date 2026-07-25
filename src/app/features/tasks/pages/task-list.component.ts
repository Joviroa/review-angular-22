import { Component, OnInit, OnDestroy, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TaskApiService } from '../../../core/api/task-api.service';
import { Task } from '../../../core/models/task.model';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { TaskFiltersComponent } from '../components/task-filters.component';
import { TaskCardComponent } from '../components/task-card.component';

@Component({
  selector: 'app-task-list',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TaskFiltersComponent,
    TaskCardComponent
  ],
  template: `
    <div class="list-container">
      <div class="list-header">
        <div>
          <h2>Painel de Tarefas</h2>
          <p class="subtitle">Acompanhe e organize suas atividades em tempo real</p>
        </div>
        <button class="btn btn-primary" (click)="navigateToCreate()">
          ➕ Nova Tarefa
        </button>
      </div>

      <!-- Filtros Reativos -->
      <app-task-filters (filterChanged)="onFilterChanged($event)" />

      <!-- Estado de Carregamento -->
      <!-- IMPORTANTE: Usando *ngIf tradicional em vez de @if -->
      <div *ngIf="isLoading" class="loading-state">
        <div class="spinner"></div>
        <p>Buscando tarefas do servidor fake...</p>
      </div>

      <!-- Grid de Tarefas -->
      <ng-container *ngIf="!isLoading">
        <div class="tasks-wrapper" *ngIf="filteredTasks as tasks; else emptyList">
          
          <div class="tasks-grid" *ngIf="tasks.length > 0; else noResults">
            <!-- IMPORTANTE: Usando *ngFor tradicional em vez de @for -->
            <app-task-card 
              *ngFor="let item of tasks(); trackBy: trackByTaskId" 
              [task]="item"
              (taskClick)="navigateToDetail($event)">
            </app-task-card>
          </div>

          <ng-template #noResults>
            <div class="empty-state">
              <span class="empty-icon">🔍</span>
              <h3>Nenhuma tarefa encontrada</h3>
              <p>Tente ajustar os termos de pesquisa ou o filtro de status.</p>
            </div>
          </ng-template>

        </div>
      </ng-container>

      <ng-template #emptyList>
        <div class="empty-state">
          <span class="empty-icon">📂</span>
          <h3>Sem tarefas cadastradas</h3>
          <p>Crie uma nova tarefa para começar a gerenciar seu fluxo de trabalho.</p>
          <button class="btn btn-primary btn-sm" (click)="navigateToCreate()">Criar Primeira Tarefa</button>
        </div>
      </ng-template>
    </div>
  `,
  styles: [`
    .list-container {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      box-sizing: border-box;
    }
    
    .list-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.5rem;
      gap: 1rem;
    }
    
    h2 {
      font-size: 1.75rem;
      font-weight: 700;
      color: var(--text-color);
      margin: 0;
      letter-spacing: -0.02em;
    }
    
    .subtitle {
      font-size: 0.95rem;
      color: var(--text-muted);
      margin: 0.25rem 0 0 0;
    }

    .tasks-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1.5rem;
    }

    .loading-state {
      text-align: center;
      padding: 4rem 2rem;
      background: rgba(30, 41, 59, 0.25);
      border: 1px solid var(--border-color);
      border-radius: 14px;
      color: var(--text-muted);
    }

    .spinner {
      border: 3px solid rgba(255, 255, 255, 0.05);
      width: 40px;
      height: 40px;
      border-radius: 50%;
      border-left-color: var(--primary-color);
      animation: spin 1s linear infinite;
      margin: 0 auto 1.25rem auto;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .empty-state {
      text-align: center;
      padding: 4rem 2rem;
      background: rgba(30, 41, 59, 0.2);
      border: 1px dashed var(--border-color);
      border-radius: 14px;
      color: var(--text-muted);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 0.75rem;
    }

    .empty-icon {
      font-size: 2.5rem;
      margin-bottom: 0.25rem;
    }

    .empty-state h3 {
      font-size: 1.2rem;
      font-weight: 600;
      color: var(--text-color);
      margin: 0;
    }

    .empty-state p {
      font-size: 0.9rem;
      color: var(--text-muted);
      margin: 0;
      max-width: 320px;
      line-height: 1.4;
    }

    .btn-sm {
      padding: 0.5rem 1.25rem;
      font-size: 0.85rem;
      margin-top: 0.5rem;
    }
  `]
})
export class TaskListComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  // Streams reativos de filtros locais
  private filterText = signal<string>('');
  private filterStatus = signal<string>('all');

  // Filtro combinado de tarefas, texto e status usando signals
  public filteredTasks = computed(() => {
    const tasks = this.taskApiService.tasks();
    const text = this.filterText();
    const status = this.filterStatus();

    return tasks.filter(task => {
      const matchesText = !text || 
        task.title.toLowerCase().includes(text.toLowerCase()) || 
        task.description.toLowerCase().includes(text.toLowerCase());
      
      const matchesStatus = status === 'all' || 
        (status === 'done' && task.status === 'done') ||
        (status === 'pending' && task.status === 'pending');

      return matchesText && matchesStatus;
    });
  });

  public isLoading = signal<boolean>(false);

  // PONTO DE MIGRAÇÃO FUTURA: Substituição por inject(TaskApiService) e inject(Router)
  constructor(
    private taskApiService: TaskApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.isLoading.set(true);

    // Dispara a busca inicial das tarefas na API
    this.taskApiService.getTasks().pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: () => {
        this.isLoading.set(false);
      },
      error: (err) => {
        this.isLoading.set(false);
        console.error('Erro ao buscar tarefas:', err);
      }
    });

  }

  onFilterChanged(filters: { text: string; status: string }): void {
    this.filterText.set(filters.text);
    this.filterStatus.set(filters.status);
  }

  navigateToDetail(taskId: string): void {
    this.router.navigate(['/tasks', taskId]);
  }

  navigateToCreate(): void {
    this.router.navigate(['/tasks/new']);
  }

  trackByTaskId(index: number, item: Task): string {
    return item.id || index.toString();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
