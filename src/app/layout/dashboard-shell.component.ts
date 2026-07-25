import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../core/auth/auth.service';

@Component({
  selector: 'app-dashboard-shell',
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive
  ],
  template: `
    <div class="dashboard-container">
      <!-- Sidebar -->
      <aside class="sidebar">
        <div class="sidebar-brand">
          <div class="brand-logo">TF</div>
          <span class="brand-name">TaskFlow</span>
        </div>

        <nav class="sidebar-nav">
          <a 
            routerLink="/tasks" 
            routerLinkActive="active" 
            [routerLinkActiveOptions]="{ exact: true }"
            class="nav-link"
          >
            <i class="icon-tasks">📋</i>
            <span>Minhas Tarefas</span>
          </a>
          <a 
            routerLink="/tasks/new" 
            routerLinkActive="active" 
            class="nav-link"
          >
            <i class="icon-add">➕</i>
            <span>Nova Tarefa</span>
          </a>
        </nav>

        @if (authService.currentUser(); as user) {
          <div class="sidebar-user">
            <div class="user-avatar">
              {{ user.name.charAt(0) }}
            </div>
            <div class="user-info">
              <p class="user-name">{{ user.name }}</p>
              <p class="user-email">{{ user.email }}</p>
            </div>
          </div>
        }
      </aside>

      <!-- Main Layout Content -->
      <div class="main-content">
        <header class="topbar">
          <div class="topbar-left">
            <span class="page-title-badge">Espaço de Trabalho</span>
          </div>
          <div class="topbar-right">
            <button class="btn-logout" (click)="logout()">
              <span class="logout-icon">🚪</span> Sair
            </button>
          </div>
        </header>

        <main class="content-body">
          <!-- Onde as rotas filhas (TasksModule) serão injetadas -->
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      display: flex;
      min-height: 100vh;
      background-color: var(--bg-color);
      color: var(--text-color);
    }
    
    /* Sidebar styling */
    .sidebar {
      width: 260px;
      background: var(--card-bg);
      border-right: 1px solid var(--border-color);
      display: flex;
      flex-direction: column;
      padding: 1.5rem;
      box-sizing: border-box;
      flex-shrink: 0;
    }
    .sidebar-brand {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 2.5rem;
    }
    .brand-logo {
      width: 38px;
      height: 38px;
      background: linear-gradient(135deg, var(--primary-color), var(--primary-hover));
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 1.1rem;
      color: white;
      box-shadow: 0 4px 10px rgba(99, 102, 241, 0.3);
    }
    .brand-name {
      font-weight: 700;
      font-size: 1.25rem;
      letter-spacing: -0.025em;
    }
    .sidebar-nav {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      flex-grow: 1;
    }
    .nav-link {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.85rem 1rem;
      color: var(--text-muted);
      text-decoration: none;
      border-radius: 8px;
      font-weight: 500;
      font-size: 0.95rem;
      transition: all 0.2s ease;
    }
    .nav-link i {
      font-style: normal;
      font-size: 1.1rem;
    }
    .nav-link:hover {
      background: rgba(255, 255, 255, 0.03);
      color: var(--text-color);
    }
    .nav-link.active {
      background: rgba(99, 102, 241, 0.15);
      color: #a5b4fc;
      border-left: 3px solid var(--primary-color);
      padding-left: calc(1rem - 3px);
    }
    .sidebar-user {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding-top: 1.5rem;
      border-top: 1px solid var(--border-color);
      margin-top: auto;
    }
    .user-avatar {
      width: 40px;
      height: 40px;
      background: #475569;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      font-size: 1.1rem;
    }
    .user-info {
      overflow: hidden;
    }
    .user-name {
      font-weight: 600;
      font-size: 0.9rem;
      margin: 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .user-email {
      font-size: 0.75rem;
      color: var(--text-muted);
      margin: 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    /* Main content styling */
    .main-content {
      flex-grow: 1;
      display: flex;
      flex-direction: column;
      min-width: 0; /* Prevents flex children overflow */
    }
    .topbar {
      height: 70px;
      background: var(--card-bg);
      border-bottom: 1px solid var(--border-color);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 2rem;
    }
    .page-title-badge {
      background: rgba(255, 255, 255, 0.05);
      padding: 0.4rem 0.8rem;
      border-radius: 6px;
      font-size: 0.8rem;
      font-weight: 500;
      color: var(--text-muted);
      border: 1px solid var(--border-color);
    }
    .btn-logout {
      background: transparent;
      border: 1px solid rgba(239, 68, 68, 0.2);
      color: #f87171;
      padding: 0.5rem 1rem;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 500;
      font-size: 0.85rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      transition: all 0.2s;
    }
    .btn-logout:hover {
      background: rgba(239, 68, 68, 0.1);
      border-color: #ef4444;
      color: #ef4444;
    }
    .logout-icon {
      font-size: 1rem;
    }
    .content-body {
      flex-grow: 1;
      padding: 2rem;
      overflow-y: auto;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .dashboard-container {
        flex-direction: column;
      }
      .sidebar {
        width: 100%;
        border-right: none;
        border-bottom: 1px solid var(--border-color);
      }
      .sidebar-brand {
        margin-bottom: 1.5rem;
      }
      .sidebar-user {
        display: none;
      }
    }
  `]
})
export class DashboardShellComponent {
  
  // PONTO DE MIGRAÇÃO FUTURA: Mudará para functional inject() em vez de construtor
  constructor(
    public authService: AuthService,
    private router: Router
  ) {}

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
