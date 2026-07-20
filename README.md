<p align="center">
  <img src="https://img.shields.io/badge/status-en%20desarrollo-yellow?style=for-the-badge" alt="Status" />
  <img src="https://img.shields.io/badge/docker-ready-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker" />
  <img src="https://img.shields.io/badge/flask-backend-000000?style=for-the-badge&logo=flask&logoColor=white" alt="Flask" />
  <img src="https://img.shields.io/badge/react-frontend-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
</p>

# 📚 PasaLibro — Microservicios

Plataforma web para la compra y venta de libros de inglés de segunda mano entre estudiantes. Permite publicar textos, buscar por nivel (A1–C2) y negociar directamente dentro de la plataforma mediante chat en tiempo real.

> **Segundo Bimestre** — Migración de arquitectura monolítica a microservicios.

---

## 🏗️ Arquitectura

El sistema se compone de microservicios independientes, cada uno con su propia base de datos (esquema aislado en Azure PostgreSQL), orquestados mediante Docker Compose y expuestos a través de un API Gateway (Nginx).

```
                    ┌─────────────────┐
                    │   Cloudflare    │
                    │    Tunnel       │
                    └────────┬────────┘
                             │ HTTPS
                    ┌────────▼────────┐
                    │   Nginx         │
                    │   API Gateway   │
                    └──┬──────┬───┬───┘
          ┌────────────┤      │   ├────────────┐
          ▼            ▼      ▼   ▼            ▼
   ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐
   │ Frontend │ │ MS-Users │ │ MS-Books │ │ MS-Chat  │
   │ React    │ │ Flask    │ │ Flask    │ │ Flask+WS │
   └──────────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘
                     │            │            │
              schema_users  schema_books  schema_chats
                     │            │            │
                     └────────────┼────────────┘
                          ┌───────▼───────┐
                          │ Azure         │
                          │ PostgreSQL    │
                          └───────────────┘
```

---

## ⚙️ Stack Tecnológico

| Capa | Tecnología |
|---|---|
| Frontend | React 18 + Vite + Bun |
| Backend | Flask 3 (Python) × 3 microservicios |
| Base de datos | Azure Database for PostgreSQL |
| ORM | SQLAlchemy + Flask-Migrate |
| Autenticación | JWT (JSON Web Tokens) |
| WebSocket | Flask-SocketIO + Socket.IO Client |
| API Gateway | Nginx (Reverse Proxy) |
| Contenedores | Docker + Docker Compose |
| CI/CD | GitHub Actions |
| Monitoreo | Prometheus + Grafana |
| Logs | ELK Stack (Elasticsearch, Logstash, Kibana) |
| Túnel | Cloudflare Tunnel |

---

## 📁 Estructura del Proyecto

```
pasalibro-microservices/
├── .github/workflows/          # Pipelines de CI/CD
│   ├── ci.yml
│   └── cd.yml
├── nginx/                      # API Gateway
│   ├── Dockerfile
│   └── nginx.conf
├── frontend/                   # React + Vite + Bun
│   ├── Dockerfile
│   ├── Dockerfile.dev
│   └── src/
├── services/                   # Microservicios Flask
│   ├── ms-users/
│   ├── ms-books/
│   └── ms-chat/
├── monitoring/                 # Observabilidad
│   ├── prometheus/
│   ├── grafana/
│   └── elk/
├── docker-compose.yml          # Producción
├── docker-compose.dev.yml      # Desarrollo local
└── .env.example
```

---

## 🚀 Inicio Rápido (Desarrollo Local)

### Prerrequisitos

- [Docker](https://docs.docker.com/get-docker/) y Docker Compose
- [Bun](https://bun.sh/) (opcional, solo si trabajas en el frontend fuera de Docker)
- Archivo `.env` configurado (copiar desde `.env.example`)

### 1. Clonar el repositorio

```bash
git clone https://github.com/OmniDevs/pasalibro-microservices.git
cd pasalibro-microservices
```

### 2. Configurar variables de entorno

```bash
cp .env.example .env
# Editar .env con las credenciales de Azure y claves JWT
```

### 3. Levantar el entorno de desarrollo

```bash
docker compose -f docker-compose.dev.yml up --build
```

La aplicación estará disponible en `http://localhost`.

---

## 📡 Endpoints de la API

| Servicio | Base Path | Descripción |
|---|---|---|
| MS-Users | `/api/users` | Registro, login, perfil, recuperación de clave |
| MS-Books | `/api/books` | CRUD de libros, búsqueda y filtros |
| MS-Chat | `/api/chat` | Salas de chat, historial, WebSocket |

Cada microservicio expone un endpoint de salud: `GET /api/{service}/health`

---

## 🧪 Ejecutar Tests

```bash
# Tests de un microservicio específico
docker compose -f docker-compose.dev.yml exec ms-users pytest

# Tests del frontend
docker compose -f docker-compose.dev.yml exec frontend bun test
```

---

## 👥 Equipo OmniDevs

| Integrante | Responsabilidad |
|---|---|
| Tumbaco Oscar | Infraestructura, Azure DB, MS-Users |
| Pantoja César | DevOps, CI/CD, Docker, Nginx, MS-Books |
| Naranjo Juan | Monitoreo, Logs, MS-Chat + WebSocket |
| Guachamin Emilia | Frontend Lead, Layout, Componentes, UX |

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver [LICENSE.md](LICENSE.md) para más detalles.
