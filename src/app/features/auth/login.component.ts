import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrls: [] // Usará os estilos globais e estilos locais definidos no HTML ou centralizados
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  isLoading = false;
  errorMessage: string | null = null;

  // PONTO DE MIGRAÇÃO FUTURA: Substituição por inject(FormBuilder), inject(AuthService), inject(Router)
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Se já estiver logado, redireciona diretamente para tarefas
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/tasks']);
      return;
    }

    this.initForm();
  }

  private initForm(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;
    const { email, password } = this.loginForm.value;

    this.authService.login(email, password).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/tasks']);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = 'Falha ao realizar login. Tente novamente.';
        console.error(err);
      }
    });
  }
}
