import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, tap, map } from 'rxjs/operators';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // PONTO DE MIGRAÇÃO FUTURA: Substituir o BehaviorSubject por WritableSignal para gerenciar o estado do usuário.
  private currentUserSubject$ = new BehaviorSubject<User | null>(null);
  
  // Exposto como Observable para componentes subscreverem (ou usar async pipe)
  public currentUser$ = this.currentUserSubject$.asObservable();

  // Exposto como Observable para saber se está logado de forma reativa
  public isLoggedIn$ = this.currentUser$.pipe(
    map(user => user !== null)
  );

  constructor() {
    // Restaurar sessão ao inicializar o app
    const savedUser = localStorage.getItem('taskflow_user');
    if (savedUser) {
      try {
        this.currentUserSubject$.next(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('taskflow_user');
      }
    }
  }

  /**
   * Obtém o valor atual síncrono do usuário logado.
   * PONTO DE MIGRAÇÃO FUTURA: Em Angular moderno, isso seria lido diretamente do signal read-only.
   */
  public get currentUserValue(): User | null {
    return this.currentUserSubject$.value;
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
        this.currentUserSubject$.next(user);
      })
    );
  }

  /**
   * Limpa a sessão do usuário.
   */
  logout(): void {
    localStorage.removeItem('taskflow_user');
    this.currentUserSubject$.next(null);
  }

  /**
   * Método síncrono para verificar se o usuário está logado (usado por guards).
   */
  isLoggedIn(): boolean {
    return this.currentUserSubject$.value !== null;
  }
}
