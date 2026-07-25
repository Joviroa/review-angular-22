import { Injectable, signal } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import { Task } from '../models/task.model';

@Injectable({
  providedIn: 'root'
})
export class TaskApiService {
  private tasksSignal= signal<Task[]>([
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
  public tasks = this.tasksSignal.asReadonly();

  /**
   * Obtém todas as tarefas cadastradas (simulando delay de rede).
   */
  getTasks(): Observable<Task[]> {
    return of(this.tasksSignal()).pipe(
      delay(500)
    );
  }

  /**
   * Obtém uma tarefa pelo ID.
   */
  getTaskById(id: string): Observable<Task | undefined> {
    const task = this.tasksSignal().find(t => t.id === id);
    return of(task).pipe(
      delay(300)
    );
  }

  /**
   * Cria uma nova tarefa e emite uma nova lista
   */
  createTask(task: Omit<Task, 'id'>): Observable<Task> {
    const newTask: Task = {
      ...task,
      id: 'task-' + Math.random().toString(36).substring(2, 9)
    };

    return of(newTask).pipe(
      delay(600),
      tap(createdTask => {
        this.tasksSignal.update(currentTasks => [...currentTasks, createdTask]);
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
        this.tasksSignal.update(taskList => 
          taskList.map(t => t.id === updatedTask.id ? updatedTask : t)
        );
      })
    );
  }

}
