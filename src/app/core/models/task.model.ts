/**
 * Interface representing the Task structure.
 * Este modelo define o formato padrão de tarefas no TaskFlow.
 */
export interface Task {
  id?: string;
  title: string;
  description: string;
  status: 'pending' | 'done';
  priority: 'low' | 'medium' | 'high';
  dueDate?: string; // Formato 'YYYY-MM-DD' para bind fácil com input[type="date"]
}
