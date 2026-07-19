import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthModule } from './features/auth/auth.module';
import { DashboardShellComponent } from './layout/dashboard-shell.component';

// PONTO DE MIGRAÇÃO FUTURA: Este AppModule será deletado por completo durante a migração para standalone components (Angular moderno bootstreia o AppComponent diretamente)
@NgModule({
  declarations: [
    AppComponent,
    DashboardShellComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AuthModule // Módulo de autenticação pré-carregado no root
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
