import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskApiService } from '../../../core/api/task-api.service';
import { Task } from '../../../core/models/task.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-task-detail',
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  template: `
    <div class="detail-container">
      <div class="detail-header">
        <div>
          <h2>{{ isEditMode ? 'Editar Tarefa' : 'Nova Tarefa' }}</h2>
          <p class="subtitle">{{ isEditMode ? 'Altere as informações da sua tarefa abaixo' : 'Adicione uma nova tarefa ao seu painel' }}</p>
        </div>
        <button class="btn btn-secondary" (click)="goBack()">
          Voltar para a Lista
        </button>
      </div>

      <div class="form-card">
        <!-- IMPORTANTE: Usando *ngIf tradicional em vez de @if -->
        <div *ngIf="isLoading" class="loading-state">
          <div class="spinner"></div>
          <p>Carregando dados da tarefa...</p>
        </div>

        <form *ngIf="!isLoading" [formGroup]="taskForm" (ngSubmit)="onSubmit()" class="detail-form">
          <div class="form-group">
            <label for="title">Título *</label>
            <input 
              id="title"
              type="text" 
              formControlName="title" 
              class="form-control"
              placeholder="Digite o título da tarefa (Ex: Estudar Angular)"
              [class.is-invalid]="taskForm.get('title')?.touched && taskForm.get('title')?.invalid"
            />
            <div *ngIf="taskForm.get('title')?.touched && taskForm.get('title')?.invalid" class="error-text">
              O título da tarefa é obrigatório.
            </div>
          </div>

          <div class="form-group">
            <label for="description">Descrição</label>
            <textarea 
              id="description"
              formControlName="description" 
              class="form-control" 
              rows="5"
              placeholder="Descreva detalhadamente o que precisa ser feito..."
            ></textarea>
          </div>

          <div class="form-row">
            <div class="form-group flex-1">
              <label for="priority">Prioridade</label>
              <select id="priority" formControlName="priority" class="form-control">
                <option value="low">Baixa</option>
                <option value="medium">Média</option>
                <option value="high">Alta</option>
              </select>
            </div>

            <div class="form-group flex-1">
              <label for="status">Status</label>
              <select id="status" formControlName="status" class="form-control">
                <option value="pending">Pendente</option>
                <option value="done">Concluída</option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label for="dueDate">Prazo limite</label>
            <input 
              id="dueDate"
              type="date" 
              formControlName="dueDate" 
              class="form-control"
            />
          </div>

          <div class="form-actions">
            <button type="button" class="btn btn-secondary" (click)="goBack()" [disabled]="isSaving">
              Cancelar
            </button>
            <button type="submit" class="btn btn-primary" [disabled]="taskForm.invalid || isSaving">
              <span *ngIf="!isSaving">Salvar</span>
              <span *ngIf="isSaving" class="spinner-small"></span>
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .detail-container {
      max-width: 750px;
      margin: 0 auto;
      box-sizing: border-box;
    }
    
    .detail-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      gap: 1.5rem;
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

    .form-card {
      background: rgba(30, 41, 59, 0.45);
      border: 1px solid var(--border-color);
      border-radius: 16px;
      padding: 2.25rem;
      box-sizing: border-box;
    }

    .detail-form {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    
    .form-row {
      display: flex;
      gap: 1.5rem;
    }
    
    .flex-1 {
      flex: 1;
      min-width: 0;
    }

    label {
      font-size: 0.85rem;
      font-weight: 600;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .form-control {
      background: rgba(15, 23, 42, 0.6);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 8px;
      padding: 0.85rem 1rem;
      color: var(--text-color);
      font-size: 0.95rem;
      outline: none;
      transition: all 0.2s;
      box-sizing: border-box;
      width: 100%;
    }

    .form-control:focus {
      border-color: var(--primary-color);
      box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
    }
    
    .form-control.is-invalid {
      border-color: var(--error-color);
    }

    textarea.form-control {
      resize: vertical;
      font-family: inherit;
    }

    .error-text {
      font-size: 0.75rem;
      color: #f87171;
      margin-top: 0.15rem;
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
      margin-top: 1.5rem;
      border-top: 1px solid rgba(255, 255, 255, 0.05);
      padding-top: 1.5rem;
    }

    .loading-state {
      text-align: center;
      padding: 3rem 0;
      color: var(--text-muted);
    }

    .spinner {
      border: 3px solid rgba(255, 255, 255, 0.05);
      width: 36px;
      height: 36px;
      border-radius: 50%;
      border-left-color: var(--primary-color);
      animation: spin 1s linear infinite;
      margin: 0 auto 1rem auto;
    }

    .spinner-small {
      width: 18px;
      height: 18px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-radius: 50%;
      border-left-color: white;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    @media (max-width: 576px) {
      .form-row {
        flex-direction: column;
        gap: 1.5rem;
      }
    }
  `]
})
export class TaskDetailComponent implements OnInit {
  taskForm!: FormGroup;
  isEditMode = false;
  isLoading = false;
  isSaving = false;
  taskId: string | null = null;

  // PONTO DE MIGRAÇÃO FUTURA: Substituição por inject() para ActivatedRoute, Router, TaskApiService, FormBuilder
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private taskApiService: TaskApiService
  ) {
    this.createForm();
  }

  ngOnInit(): void {
    // Detecta o parâmetro 'id' na rota para diferenciar Criar e Editar
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id && id !== 'new') {
        this.isEditMode = true;
        this.taskId = id;
        this.loadTask(id);
      } else {
        this.isEditMode = false;
        this.taskId = null;
        this.createForm(); // Limpa/Inicia formulário vazio
      }
    });
  }

  private createForm(task?: Task): void {
    this.taskForm = this.fb.group({
      title: [task?.title || '', [Validators.required]],
      description: [task?.description || ''],
      priority: [task?.priority || 'medium'],
      status: [task?.status || 'pending'],
      dueDate: [task?.dueDate || '']
    });
  }

  private loadTask(id: string): void {
    this.isLoading = true;
    this.taskApiService.getTaskById(id).subscribe({
      next: (task) => {
        if (task) {
          this.createForm(task);
        } else {
          // Se não encontrou a tarefa, retorna para listagem
          this.router.navigate(['/tasks']);
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.router.navigate(['/tasks']);
        this.isLoading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.taskForm.invalid) {
      return;
    }

    this.isSaving = true;
    const formValue = this.taskForm.value;

    if (this.isEditMode && this.taskId) {
      const updatedTask: Task = {
        ...formValue,
        id: this.taskId
      };

      this.taskApiService.updateTask(updatedTask).subscribe({
        next: () => {
          this.isSaving = false;
          this.router.navigate(['/tasks']);
        },
        error: (err) => {
          this.isSaving = false;
          console.error(err);
        }
      });
    } else {
      const newTask: Omit<Task, 'id'> = formValue;

      this.taskApiService.createTask(newTask).subscribe({
        next: () => {
          this.isSaving = false;
          this.router.navigate(['/tasks']);
        },
        error: (err) => {
          this.isSaving = false;
          console.error(err);
        }
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/tasks']);
  }
}
