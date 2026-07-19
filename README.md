# ReviewAngular22

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 22.0.6.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Folder organization

src/
├── app/
│   ├── core/               # Serviços singleton, guards, interceptors e configs
│   ├── shared/             # Dumb-components, directives and pipes
│   ├── features/           # Funcionalidades isoladas (Módulos de Domínio)
│   ├── layout/             # Componentes de estrutura (Header, Footer, Sidebar)
│   ├── app.config.ts       # Configurações globais (rotas, provideHttpClient)
│   ├── app.routes.ts       # Roteamento principal
│   └── app.component.ts    # Componente raiz
├── assets/                 # Imagens, fontes e ícones
└── environments/           # Variáveis de ambiente


## My guide:

src/
├── app/
│   ├── core/                    # Serviços globais de infraestrutura
│   │   ├── auth/
│   │   │   └── auth.service.ts  # Gerencia login/logout com Signals
│   │   └── api/
│   │       └── task-api.service.ts
│   │
│   ├── features/                # Suas duas telas/fluxos principais
│   │   ├── auth/
│   │   │   └── login.component.ts
│   │   │
│   │   └── tasks/               # Módulo de domínio de tarefas
│   │       ├── components/      # Mini-componentes reutilizáveis só aqui dentro
│   │       │   ├── task-card.component.ts
│   │       │   └── task-filters.component.ts
│   │       ├── pages/           # Seus componentes que representam páginas (rotas)
│   │       │   ├── task-list.component.ts
│   │       │   └── task-detail.component.ts
│   │       └── tasks.routes.ts  # Roteamento interno da feature
│   │
│   ├── layout/                  # Esqueleto visual do app
│   │   └── dashboard-shell.component.ts # Contém o Menu Lateral + <router-outlet>
│   │
│   ├── app.component.ts         # Componente raiz básico apenas com <router-outlet>
│   ├── app.config.ts            # Onde você colocou o provideRouter e withComponentInputBinding
│   └── app.routes.ts            # Rotas raiz (carrega /login e faz lazy load de tasks.routes)
│
├── assets/                      # Imagens e ícones estáticos
└── main.ts                      # Ponto de entrada do app (chama o appConfig)

