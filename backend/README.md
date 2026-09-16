# 🚀 Nitro Type — Backend API

**NT** é uma plataforma integrada de aprendizagem de programação, focada em treino técnico, prática competitiva e colaboração comunitária.

> **Stack**: NestJS 11 · TypeScript · PostgreSQL · Prisma · Redis · BullMQ · Socket.io · Nginx

---

## 📑 Índice

- [Arquitetura](#️-arquitetura)
- [Infraestrutura Docker](#-infraestrutura-docker)
- [Quick Start](#-quick-start)
- [Comandos Make](#-comandos-make)
- [Scripts NPM](#-scripts-npm)
- [Variáveis de Ambiente](#-variáveis-de-ambiente)
- [API — Endpoints](#-api--endpoints)
- [WebSockets](#-websockets)
- [Sistema de Progressão](#-sistema-de-progressão)
- [Estrutura do Projeto](#-estrutura-do-projeto)

---

## 🏗️ Arquitetura

O backend segue a arquitetura **Ports & Adapters (Hexagonal)** com princípios de **Domain-Driven Design**.

```
┌──────────────────────────────────────────────────────┐
│               PRESENTATION LAYER                     │
│        Controllers (REST) · Gateways (WS)            │
└─────────────────────┬────────────────────────────────┘
                      │
┌─────────────────────┴────────────────────────────────┐
│               APPLICATION LAYER                      │
│      Services · Use Cases · Event Publishing         │
└─────────────────────┬────────────────────────────────┘
                      │
┌─────────────────────┴────────────────────────────────┐
│                 DOMAIN LAYER                         │
│    Entities · Enums · Events · Repository (Ports)    │
└─────────────────────┬────────────────────────────────┘
                      │
┌─────────────────────┴────────────────────────────────┐
│              INFRASTRUCTURE LAYER                    │
│   Prisma Repos · Hash · Token · Email · EventBus    │
└──────────────────────────────────────────────────────┘
```

### Módulos de Domínio

| Módulo           | Descrição                                                          |
| ---------------- | ------------------------------------------------------------------ |
| **Auth**         | Autenticação (email, OAuth), verificação OTP, gestão de sessão JWT |
| **User**         | Perfis, progressão XP/nível, moderação (ban/suspend)               |
| **Typing**       | Sessões de typing, resultados (WPM/accuracy), modo learning        |
| **Events**       | Competições de typing, rodadas, rankings, medalhas                 |
| **Community**    | Canais, mensagens, DMs, membros, convites, presença                |
| **Notification** | Notificações in-app com paginação e marcação de leitura            |

### Adapters Partilhados (`shared/adapters/`)

| Adapter  | Port           | Implementação              |
| -------- | -------------- | -------------------------- |
| Hash     | `HashPort`     | bcryptjs                   |
| Token    | `TokenPort`    | JWT (`@nestjs/jwt`)        |
| Email    | `EmailPort`    | Resend / SMTP (Nodemailer) |
| EventBus | `EventBusPort` | `@nestjs/event-emitter`    |
| UUID     | `UuidPort`     | `crypto.randomUUID`        |

---

## 🐳 Infraestrutura Docker

```yaml
# docker-compose.yml — 5 serviços
┌──────────┬────────────────────────────────────────────────┐
│ nginx    │ Reverse proxy SSL (port 5000:443)              │
│ api      │ NestJS app (port 5000 interno, hot-reload dev) │
│ postgres │ PostgreSQL 16 Alpine (port 5432:5432)          │
│ redis    │ Redis Alpine (port 6380:6379)                  │
│ adminer  │ DB admin UI (port 8000:8080)                   │
└──────────┴────────────────────────────────────────────────┘
```

**Nginx** termina SSL com certificados auto-assinados (gerados pelo `make build`) e faz proxy reverso:

- `/backend/*` → `http://api:5000/` (REST + WebSocket upgrade)

**API Entrypoint** (`entrypoint.sh`):

- **Dev**: `prisma migrate reset` → `prisma migrate dev` → `npm run dev`
- **Prod**: `prisma migrate deploy` → `npm run build` → `npm run prod`

---

## ⚡ Quick Start

### Pré-requisitos

- Docker & Docker Compose
- Node.js v20+
- OpenSSL (para gerar certs)

### Setup

```bash
# 1. Clonar e configurar
git clone <repo-url> && cd backend
cp .env.example .env.local

# 2. Build + gerar SSL certs + subir tudo
make all

# 3. Ver logs da API
make logs
```

### Acessos

| Serviço               | URL                                      |
| --------------------- | ---------------------------------------- |
| API (via Nginx HTTPS) | `https://localhost:5000/backend/`        |
| Swagger / Scalar Docs | `https://localhost:5000/backend/swagger` |
| Health Check          | `https://localhost:5000/backend/health`  |
| Adminer (DB GUI)      | `http://localhost:8000`                  |
| PostgreSQL directo    | `localhost:5432`                         |
| Redis directo         | `localhost:6380`                         |

---

## 🔧 Comandos Make

```bash
make all            # build + up (gera certs SSL automaticamente)
make build          # docker compose build (gera certs antes)
make up             # docker compose up -d
make clean          # docker compose down
make mata           # alias → docker compose down
make fclean         # down -v + remove imagens + prune
make re             # mata + build + up (rebuild completo)

make logs           # logs -f api
make logs-api       # logs -f api
make logs-postgres  # logs -f postgres
make logs-redis     # logs -f redis
make logs-adminer   # logs -f adminer
make logs-nginx     # logs -f nginx

make db             # abre Prisma Studio dentro do container
```

---

## 📦 Scripts NPM

Executar dentro de `api/` ou via `docker compose exec api <cmd>`:

```bash
# Desenvolvimento
npm run dev              # nest start --watch
npm run start            # nest start
npm run prod             # node dist/main
npm run build            # nest build

# Base de Dados (Prisma)
npm run db:generate      # prisma generate
npm run db:migrate       # prisma migrate dev
npm run db:migrate:prod  # prisma migrate deploy
npm run db:reset         # prisma migrate reset --force
npm run db:studio        # prisma studio
npm run db:format        # prisma format

# Qualidade
npm run lint             # eslint --fix
npm run format           # prettier --write

# Testes
npm test                 # jest
npm run test:watch       # jest --watch
npm run test:cov         # jest --coverage
```

---

## 🔐 Variáveis de Ambiente

Copiar `.env.example` → `.env.local`. Variáveis principais:

| Variável                    | Descrição                             | Exemplo                                            |
| --------------------------- | ------------------------------------- | -------------------------------------------------- |
| `NODE_ENV`                  | Ambiente                              | `development`                                      |
| `PORT`                      | Porta da API                          | `5000`                                             |
| `DATABASE_URL`              | Connection string PostgreSQL          | `postgresql://postgres:postgres@postgres:5432/app` |
| `POSTGRES_DB/USER/PASSWORD` | Credenciais do container Postgres     | `app` / `postgres` / `postgres`                    |
| `JWT_ACCESS_SECRET`         | Secret do access token (min 256 bits) | —                                                  |
| `JWT_ACCESS_EXPIRES_IN`     | TTL access token                      | `15m`                                              |
| `JWT_REFRESH_SECRET`        | Secret do refresh token               | —                                                  |
| `JWT_REFRESH_EXPIRES_IN`    | TTL refresh token                     | `7d`                                               |
| `REDIS_HOST` / `REDIS_PORT` | Conexão Redis                         | `redis` / `6379`                                   |
| `EMAIL_PROVIDER`            | `smtp` ou `resend`                    | `smtp`                                             |
| `SMTP_HOST/PORT/USER/PASS`  | Config SMTP                           | `smtp.gmail.com` / `465`                           |
| `RESEND_API_KEY`            | API key Resend                        | `re_xxx`                                           |
| `OTP_EXPIRES_SECONDS`       | TTL do código OTP                     | `300`                                              |
| `ADMIN_EMAIL/PASSWORD/NAME` | Seed do admin                         | —                                                  |

---

## 🌐 API — Endpoints

> **Base URL**: `https://localhost:5000/backend`
>
> **Autenticação**: JWT Bearer token no header `Authorization` ou cookie `access_token`. Refresh token no cookie HTTP-only `refresh_token`.
>
> **Guard global**: `JwtAuthGuard` — todas as rotas protegidas por defeito. Usar `@Public()` para rotas abertas.

---

### 1️⃣ Auth — Email

| Método | Endpoint              | Descrição                     | Auth |
| ------ | --------------------- | ----------------------------- | ---- |
| `POST` | `/auth/sign-up/email` | Registar com email + password | ❌   |
| `POST` | `/auth/sign-in/email` | Login com email + password    | ❌   |
| `POST` | `/auth/verify/email`  | Verificar email com OTP       | ❌   |
| `POST` | `/auth/verify/resend` | Reenviar OTP de verificação   | ❌   |

### Auth — Password

| Método | Endpoint                | Descrição                   | Auth |
| ------ | ----------------------- | --------------------------- | ---- |
| `POST` | `/auth/password/forgot` | Solicitar reset de password | ❌   |
| `POST` | `/auth/password/reset`  | Redefinir password com OTP  | ❌   |

### Auth — Provider (OAuth)

| Método | Endpoint         | Descrição                                 | Auth |
| ------ | ---------------- | ----------------------------------------- | ---- |
| `POST` | `/auth/provider` | Login/Registo via Google, GitHub, 42Intra | ❌   |

### Auth — Session

| Método | Endpoint         | Descrição                                 | Auth |
| ------ | ---------------- | ----------------------------------------- | ---- |
| `POST` | `/auth/refresh`  | Renovar access token (via refresh cookie) | 🍪   |
| `POST` | `/auth/sign-out` | Terminar sessão (limpa cookies)           | ❌   |

**Fluxo de Autenticação**:

```
SignUp → OTP enviado por email → VerifyOTP → Cookies (access + refresh) → Autenticado
SignIn → Cookies (access + refresh) → Autenticado
Refresh → Novo par de tokens via cookie refresh_token
```

---

### 2️⃣ Users

| Método   | Endpoint                    | Descrição                         | Auth | Role  |
| -------- | --------------------------- | --------------------------------- | ---- | ----- |
| `GET`    | `/users/me`                 | Meu perfil                        | ✅   | —     |
| `PATCH`  | `/users/me`                 | Atualizar perfil                  | ✅   | —     |
| `GET`    | `/users/me/progress`        | Meu progresso (nível, XP)         | ✅   | —     |
| `GET`    | `/users/me/xp-transactions` | Histórico de XP (`?limit=N`)      | ✅   | —     |
| `GET`    | `/users/search/:q`          | Pesquisar utilizadores            | ✅   | —     |
| `POST`   | `/users/sign-up/email`      | Registar utilizador (admin)       | ✅   | —     |
| `DELETE` | `/users/:id`                | Apagar utilizador                 | ✅   | ADMIN |
| `POST`   | `/users/:id/block`          | Bloquear utilizador (`?reason=`)  | ✅   | ADMIN |
| `POST`   | `/users/:id/suspend`        | Suspender utilizador (`?reason=`) | ✅   | ADMIN |

---

### 3️⃣ Typing

| Método  | Endpoint                        | Descrição                     | Auth |
| ------- | ------------------------------- | ----------------------------- | ---- |
| `POST`  | `/typing/sessions`              | Criar nova sessão             | ✅   |
| `GET`   | `/typing/sessions/:id`          | Detalhes da sessão            | ✅   |
| `PATCH` | `/typing/sessions/:id/activate` | Ativar sessão (iniciar timer) | ✅   |
| `POST`  | `/typing/sessions/result`       | Submeter resultado            | ✅   |
| `GET`   | `/typing/sessions/:id/results`  | Resultados da sessão          | ✅   |
| `GET`   | `/typing/me/results`            | Meus resultados recentes      | ✅   |
| `GET`   | `/typing/results/:id`           | Detalhes de um resultado      | ✅   |
| `POST`  | `/typing/learning/start`        | Iniciar trilha de aprendizado | ✅   |
| `POST`  | `/typing/learning/submit`       | Submeter resultado learning   | ✅   |

**Categorias**: `BEGINNER` · `ANIME` · `FUNCTIONS` · `ALGORITHMS`
**Dificuldades**: `EASY` · `MEDIUM` · `HARD` · `EXTREME`
**Estágios Learning**: `STAGE_1_HOME_ROW` → `STAGE_2_ROW` → `STAGE_3_WORD` → `STAGE_4_SENTENCE` → `STAGE_5_PARAGRAPH`

---

### 4️⃣ Events (Competições)

| Método  | Endpoint                         | Descrição                            | Auth |
| ------- | -------------------------------- | ------------------------------------ | ---- |
| `POST`  | `/events`                        | Criar evento                         | ✅   |
| `GET`   | `/events`                        | Listar eventos (`?status=&type=`)    | ✅   |
| `GET`   | `/events/public`                 | Listar eventos públicos              | ✅   |
| `GET`   | `/events/:eventId`               | Detalhes do evento                   | ✅   |
| `POST`  | `/events/:eventId/rounds`        | Adicionar rodada                     | ✅   |
| `POST`  | `/events/:eventId/rounds/submit` | Submeter resultado da rodada         | ✅   |
| `PATCH` | `/events/:eventId/schedule`      | Agendar evento (WAITING → SCHEDULED) | ✅   |
| `PATCH` | `/events/:eventId/start`         | Iniciar evento                       | ✅   |
| `POST`  | `/events/:eventId/invite`        | Convidar participante                | ✅   |
| `PATCH` | `/events/:eventId/accept`        | Aceitar convite                      | ✅   |
| `GET`   | `/events/:eventId/ranking`       | Ranking final com medalhas           | ✅   |
| `GET`   | `/events/:eventId/total-win`     | Total de vitórias do participante    | ✅   |

**Status do Evento**: `WAITING` → `SCHEDULED` → `ACTIVE` → `BETWEEN_ROUNDS` → `FINISHED`
**Medalhas**: 🥇 `GOLD` · 🥈 `SILVER` · 🥉 `BRONZE`

---

### 5️⃣ Community

#### Channels

| Método | Endpoint                         | Descrição         | Auth |
| ------ | -------------------------------- | ----------------- | ---- |
| `POST` | `/community/channels`            | Criar canal       | ✅   |
| `GET`  | `/community/channels`            | Listar canais     | ✅   |
| `GET`  | `/community/channels/:channelId` | Detalhes do canal | ✅   |

#### Messages

| Método   | Endpoint                                  | Descrição                      | Auth |
| -------- | ----------------------------------------- | ------------------------------ | ---- |
| `GET`    | `/community/channels/:channelId/messages` | Listar mensagens (`?limit=50`) | ✅   |
| `POST`   | `/community/channels/:channelId/messages` | Enviar mensagem                | ✅   |
| `GET`    | `/community/messages/:messageId`          | Detalhes da mensagem           | ✅   |
| `PATCH`  | `/community/messages/:messageId`          | Editar mensagem                | ✅   |
| `DELETE` | `/community/messages/:messageId`          | Apagar mensagem                | ✅   |

#### Reactions

| Método   | Endpoint                                          | Descrição        | Auth |
| -------- | ------------------------------------------------- | ---------------- | ---- |
| `PUT`    | `/community/messages/:messageId/reactions`        | Adicionar reação | ✅   |
| `DELETE` | `/community/messages/:messageId/reactions/:emoji` | Remover reação   | ✅   |

#### Members

| Método   | Endpoint                                              | Descrição        | Auth |
| -------- | ----------------------------------------------------- | ---------------- | ---- |
| `POST`   | `/community/channels/:channelId/members`              | Adicionar membro | ✅   |
| `DELETE` | `/community/channels/:channelId/members/:userId`      | Remover membro   | ✅   |
| `POST`   | `/community/channels/:channelId/members/:userId/ban`  | Banir membro     | ✅   |
| `PATCH`  | `/community/channels/:channelId/members/:userId/role` | Alterar role     | ✅   |

**Roles de Membro**: `MASTER_ADMIN` · `GROUP_OWNER` · `GROUP_ADMIN` · `GROUP_MEMBER` · `GROUP_VIEWER`

#### Direct Messages

| Método | Endpoint                        | Descrição                           | Auth |
| ------ | ------------------------------- | ----------------------------------- | ---- |
| `GET`  | `/community/dms`                | Listar conversas DM                 | ✅   |
| `POST` | `/community/dms`                | Criar/abrir conversa DM             | ✅   |
| `GET`  | `/community/dms/:dmId/messages` | Mensagens da conversa (`?limit=50`) | ✅   |
| `POST` | `/community/dms/:dmId/messages` | Enviar DM                           | ✅   |

#### Invites

| Método | Endpoint                                 | Descrição               | Auth |
| ------ | ---------------------------------------- | ----------------------- | ---- |
| `POST` | `/community/channels/:channelId/invites` | Criar convite           | ✅   |
| `GET`  | `/community/invites`                     | Meus convites pendentes | ✅   |
| `POST` | `/community/invites/:code/accept`        | Aceitar convite         | ✅   |

#### Presence

| Método  | Endpoint                      | Descrição          | Auth |
| ------- | ----------------------------- | ------------------ | ---- |
| `PATCH` | `/community/presence`         | Atualizar presença | ✅   |
| `GET`   | `/community/presence/:userId` | Status de presença | ✅   |

**Status de Presença**: `ONLINE` · `OFFLINE` · `IDLE`

---

### 6️⃣ Notifications

| Método  | Endpoint                  | Descrição                      | Auth |
| ------- | ------------------------- | ------------------------------ | ---- |
| `GET`   | `/notifications`          | Listar notificações (paginado) | ✅   |
| `PATCH` | `/notifications/:id/read` | Marcar como lida               | ✅   |
| `PATCH` | `/notifications/read-all` | Marcar todas como lidas        | ✅   |

**Tipos**: `SYSTEM` · `COMMUNITY` · `EVENT` · `DIRECT_MESSAGE`

---

## 🔌 WebSockets

| Gateway                   | Namespace        | Descrição                                                     |
| ------------------------- | ---------------- | ------------------------------------------------------------- |
| `EventGateway`            | `/events`        | Competições em tempo real (rodadas, resultados, ranking live) |
| `UserNotificationGateway` | `/notifications` | Notificações push em tempo real                               |

---

## 📈 Sistema de Progressão

**Curva de XP**: `XP necessário = 100 × (nível ^ 1.2)`

| Rank | Nível  | Título            |
| ---- | ------ | ----------------- |
| 1    | 91–100 | Arquiteto Supremo |
| 2    | 81–90  | Mestre            |
| 3    | 71–80  | Especialista      |
| 4    | 61–70  | Competidor        |
| 5    | 51–60  | Estrategista      |
| 6    | 41–50  | Desafiador        |
| 7    | 31–40  | Programador       |
| 8    | 21–30  | Aprendiz          |
| 9    | 11–20  | Explorador        |
| 10   | 1–10   | Novato            |

---

## 📂 Estrutura do Projeto

```
backend/
├── docker-compose.yml        # Orquestração dos 5 serviços
├── Makefile                   # Atalhos de desenvolvimento
├── .env.example               # Template de variáveis de ambiente
├── .env.local                 # Variáveis locais (git ignored)
│
├── nginx/
│   ├── conf/nginx.conf        # Reverse proxy + SSL termination
│   ├── certs/                 # Certificados auto-assinados (gerados)
│   └── tools/generate-certs.sh
│
└── api/                       # Aplicação NestJS
    ├── Dockerfile
    ├── entrypoint.sh          # Bootstrap (migrate + start)
    ├── package.json
    ├── tsconfig.json
    ├── prisma/
    │   ├── schema.prisma      # Schema da base de dados
    │   └── migrations/
    │
    └── src/
        ├── main.ts            # Bootstrap NestJS + Swagger
        ├── app.module.ts      # Módulo raiz
        │
        ├── config/            # Configurações (app, jwt, bull, cache, logger)
        │
        ├── common/            # Cross-cutting concerns
        │   ├── decorators/    # @Public, @CurrentUser, @Roles, @Optional
        │   ├── guards/        # JwtAuthGuard, RolesGuard
        │   ├── filters/       # HttpExceptionFilter
        │   ├── interceptors/  # ResponseInterceptor
        │   ├── pipes/         # AppValidationPipe
        │   └── responses/     # Envelope (SuccessResponse, ErrorResponse)
        │
        ├── shared/
        │   ├── adapters/      # Hash, Token, Email, EventBus, UUID
        │   ├── database/      # PrismaService, PrismaModule
        │   ├── entities/      # BaseEntity, DomainEvent
        │   ├── helpers/
        │   └── modules/       # RedisModule
        │
        └── modules/
            ├── auth/
            │   ├── auth.module.ts
            │   ├── domain/        # entities, events, repo (ports)
            │   ├── app/           # services (use cases)
            │   ├── infra/         # Prisma repository adapters
            │   └── presentation/  # controllers, inputs, responses
            │
            ├── user/          # (mesma estrutura)
            ├── typing/        # (mesma estrutura)
            ├── events/        # (mesma estrutura) + gateways/
            ├── community/     # (mesma estrutura)
            └── notification/  # (mesma estrutura)
```

### Padrão de cada Módulo

```
módulo/
├── módulo.module.ts       # NestJS module (providers, imports, exports)
├── domain/
│   ├── entities/          # Entidades de domínio + enums
│   ├── events/            # Eventos de domínio (DomainEvent)
│   └── repository/        # Ports abstratos (abstract class)
├── app/
│   ├── services/          # Application services / Use cases
│   ├── helpers/           # Utilitários do módulo
│   └── listeners/         # Event listeners (@EventHandler)
├── infra/
│   └── prisma/            # Adaptadores concretos (PrismaXxxRepository)
└── presentation/
    ├── controllers/       # REST endpoints
    ├── gateways/          # WebSocket gateways (onde aplicável)
    ├── inputs/            # DTOs de entrada (class-validator)
    └── responses/         # DTOs de resposta (Swagger)
```

---

## 📝 Documentação Interativa

Em ambiente de desenvolvimento, a documentação interativa está disponível via **Scalar** em:

```
https://localhost:5000/backend/swagger
```

---

_Built with ❤️ by Nitro Type_
