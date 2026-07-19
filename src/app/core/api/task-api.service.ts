import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, map, tap } from 'rxjs/operators';
import { Task } from '../models/task.model';

@Injectable({
  providedIn: 'root'
})
export class TaskApiService {
  // PONTO DE MIGRAÇÃO FUTURA: Esse BehaviorSubject será migrado para um Signal (ou Signal Store) para gerenciar o estado das tarefas de forma simplificada e eficiente.
  private tasksSubject$ = new BehaviorSubject<Task[]>([
    {
      id: 'task-1',
      title: 'Configurar Roteamento Angular 15',
      description: 'Estruturar rotas filhas e lazy loading no arquivo app-routing.module.ts e tasks-routing.module.ts.',
      status: 'done',
      priority: 'high',
      dueDate: '2026-07-20'
    },
    {
      id: 'task-2',
      title: 'Gerenciar Estado com BehaviorSubject',
      description: 'Implementar o fluxo reativo usando BehaviorSubject na camada de API mockada para refletir mudanças em tempo real.',
      status: 'pending',
      priority: 'medium',
      dueDate: '2026-07-25'
    },
    {
      id: 'task-3',
      title: 'Criar Formulários Reativos',
      description: 'Construir os formulários de filtro e detalhes usando Reactive Forms com validações síncronas necessárias.',
      status: 'pending',
      priority: 'low',
      dueDate: '2026-07-28'
    }
  ]);

  // Exposto publicamente como Observable para ser consumido via async pipe no template
  // PONTO DE MIGRAÇÃO FUTURA: Converter para signal read-only (e.g., tasks = this.tasksSubject.asReadonly())
  public tasks$ = this.tasksSubject$.asObservable();

  constructor() {}

  /**
   * Obtém todas as tarefas cadastradas (simulando delay de rede).
   */
  getTasks(): Observable<Task[]> {
    return of(this.tasksSubject$.value).pipe(
      delay(500)
    );
  }

  /**
   * Obtém uma tarefa pelo ID.
   */
  getTaskById(id: string): Observable<Task | undefined> {
    const task = this.tasksSubject$.value.find(t => t.id === id);
    return of(task).pipe(
      delay(300)
    );
  }

  /**
   * Cria uma nova tarefa e emite uma nova lista pelo BehaviorSubject.
   */
  createTask(task: Omit<Task, 'id'>): Observable<Task> {
    const newTask: Task = {
      ...task,
      id: 'task-' + Math.random().toString(36).substring(2, 9)
    };

    return of(newTask).pipe(
      delay(600),
      tap(createdTask => {
        const currentTasks = this.tasksSubject$.value;
        this.tasksSubject$.next([...currentTasks, createdTask]);
      })
    );
  }

  /**
   * Atualiza os dados de uma tarefa existente e emite a lista atualizada pelo BehaviorSubject.
   */
  updateTask(task: Task): Observable<Task> {
    return of(task).pipe(
      delay(600),
      tap(updatedTask => {
        const currentTasks = this.tasksSubject$.value;
        const index = currentTasks.findIndex(t => t.id === updatedTask.id);
        if (index !== -1) {
          const newTasks = [...currentTasks];
          newTasks[index] = updatedTask;
          this.tasksSubject$.next(newTasks);
        }
      })
    );
  }
}
