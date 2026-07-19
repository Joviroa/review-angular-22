import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Task } from '../../../core/models/task.model';

@Component({
  selector: 'app-task-card',
  standalone: false,
  template: `
    <div class="task-card" [class.done]="task.status === 'done'" (click)="onCardClick()">
      <div class="card-header">
        <span class="priority-badge" [class]="task.priority">
          {{ task.priority === 'high' ? 'Alta' : task.priority === 'medium' ? 'Média' : 'Baixa' }}
        </span>
        <span class="status-badge" [class]="task.status">
          {{ task.status === 'done' ? 'Concluída' : 'Pendente' }}
        </span>
      </div>
      
      <h3 class="task-title">{{ task.title }}</h3>
      <p class="task-desc">{{ task.description }}</p>
      
      <!-- IMPORTANTE: Usando *ngIf tradicional em vez de @if -->
      <div class="card-footer" *ngIf="task.dueDate">
        <span class="due-date">
          📅 Prazo: {{ task.dueDate | date:'dd/MM/yyyy':'UTC' }}
        </span>
      </div>
    </div>
  `,
  styles: [`
    .task-card {
      background: rgba(30, 41, 59, 0.45);
      border: 1px solid var(--border-color);
      border-radius: 14px;
      padding: 1.5rem;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      display: flex;
      flex-direction: column;
      gap: 1rem;
      position: relative;
      overflow: hidden;
      box-sizing: border-box;
    }
    
    .task-card:hover {
      transform: translateY(-4px);
      background: rgba(30, 41, 59, 0.7);
      border-color: rgba(99, 102, 241, 0.45);
      box-shadow: 0 12px 24px -10px rgba(0, 0, 0, 0.6);
    }
    
    /* Indicador visual de status lateral */
    .task-card::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 4px;
      transition: background-color 0.2s;
    }
    
    .task-card.done::before {
      background-color: var(--success-color);
    }
    
    .task-card:not(.done)::before {
      background-color: var(--warning-color);
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .priority-badge {
      font-size: 0.7rem;
      font-weight: 700;
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    
    .priority-badge.high {
      background: rgba(239, 68, 68, 0.15);
      color: #f87171;
    }
    
    .priority-badge.medium {
      background: rgba(245, 158, 11, 0.15);
      color: #fbbf24;
    }
    
    .priority-badge.low {
      background: rgba(59, 130, 246, 0.15);
      color: #60a5fa;
    }

    .status-badge {
      font-size: 0.75rem;
      font-weight: 600;
      padding: 0.25rem 0.6rem;
      border-radius: 20px;
    }
    
    .status-badge.done {
      background: rgba(16, 185, 129, 0.15);
      color: #34d399;
    }
    
    .status-badge.pending {
      background: rgba(245, 158, 11, 0.1);
      color: #fbbf24;
    }

    .task-title {
      font-size: 1.15rem;
      font-weight: 600;
      margin: 0;
      color: var(--text-color);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .task-desc {
      font-size: 0.88rem;
      color: var(--text-muted);
      margin: 0;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      line-height: 1.5;
      flex-grow: 1;
    }

    .card-footer {
      border-top: 1px solid rgba(255, 255, 255, 0.05);
      padding-top: 0.75rem;
      margin-top: 0.25rem;
      font-size: 0.8rem;
      color: var(--text-muted);
    }
  `]
})
export class TaskCardComponent {
  @Input() task!: Task;
  @Output() taskClick = new EventEmitter<string>();

  onCardClick(): void {
    if (this.task && this.task.id) {
      this.taskClick.emit(this.task.id);
    }
  }
}
