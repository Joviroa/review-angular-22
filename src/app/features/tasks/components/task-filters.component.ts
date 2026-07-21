import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-task-filters',
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  template: `
    <!-- IMPORTANTE: Usando Reactive Forms com formGroup e formControlName -->
    <form [formGroup]="filterForm" class="filters-container">
      <div class="form-group search-group">
        <label for="text">Buscar Tarefa</label>
        <input 
          id="text"
          type="text" 
          formControlName="text" 
          placeholder="Pesquisar por título ou descrição..." 
          class="form-control"
        />
      </div>
      
      <div class="form-group select-group">
        <label for="status">Filtrar por Status</label>
        <select id="status" formControlName="status" class="form-control">
          <option value="all">Todos os Status</option>
          <option value="pending">Pendentes</option>
          <option value="done">Concluídas</option>
        </select>
      </div>
    </form>
  `,
  styles: [`
    .filters-container {
      display: flex;
      gap: 1.5rem;
      background: rgba(30, 41, 59, 0.45);
      border: 1px solid var(--border-color);
      padding: 1.25rem 1.5rem;
      border-radius: 14px;
      margin-bottom: 2rem;
      flex-wrap: wrap;
      box-sizing: border-box;
    }
    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    .search-group {
      flex: 1;
      min-width: 280px;
    }
    .select-group {
      min-width: 200px;
    }
    label {
      font-size: 0.82rem;
      font-weight: 600;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .form-control {
      background: rgba(15, 23, 42, 0.6);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 8px;
      padding: 0.75rem 1rem;
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
    
    @media (max-width: 576px) {
      .filters-container {
        flex-direction: column;
        gap: 1rem;
      }
    }
  `]
})
export class TaskFiltersComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  @Output() filterChanged = new EventEmitter<{ text: string; status: string }>();
  
  filterForm: FormGroup;

  // PONTO DE MIGRAÇÃO FUTURA: Substituição por inject(FormBuilder)
  constructor(private fb: FormBuilder) {
    this.filterForm = this.fb.group({
      text: [''],
      status: ['all']
    });
  }

  ngOnInit(): void {
    // Escuta reativamente as alterações com debounce de 200ms para evitar chamadas excessivas
    this.filterForm.valueChanges.pipe(
      debounceTime(200),
      takeUntil(this.destroy$)
    ).subscribe(values => {
      this.filterChanged.emit(values);
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
