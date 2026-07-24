import { computed, Injectable, signal } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSignal = signal<User | null>(null);
  public currentUser = this.currentUserSignal.asReadonly();

  public isLoggedIn = computed(() => this.currentUser() !== null);

  constructor() {
    // Restaurar sessão ao inicializar o app
    const savedUser = localStorage.getItem('taskflow_user');
    if (savedUser) {
      try {
        this.currentUserSignal.set(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('taskflow_user');
      }
    }
  }

  /**
   * Realiza login fake com delay de rede simulado.
   */
  login(email: string, password: string): Observable<User> {
    // Simula validação básica no frontend
    const mockUser: User = {
      id: Math.random().toString(36).substring(2, 9),
      email: email,
      name: 'Estudante de Angular'
    };

    return of(mockUser).pipe(
      delay(1000), // Simula delay da rede (RxJS of + delay)
      tap(user => {
        localStorage.setItem('taskflow_user', JSON.stringify(user));
        this.currentUserSignal.set(user);
      })
    );
  }

  /**
   * Limpa a sessão do usuário.
   */
  logout(): void {
    localStorage.removeItem('taskflow_user');
    this.currentUserSignal.set(null);
  }

}
