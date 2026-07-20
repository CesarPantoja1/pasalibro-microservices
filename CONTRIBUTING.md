# Guía de Contribución — PasaLibro Microservicios

¡Gracias por contribuir a PasaLibro! Este documento establece las reglas y convenciones que todos los miembros del equipo deben seguir para mantener un código limpio y un historial de Git ordenado.

---

## 📌 Flujo de Trabajo General

1. **Nunca** hagas push directamente a `main` o `develop`.
2. Crea una rama `feature/...` desde `develop`.
3. Haz commits pequeños y frecuentes siguiendo la convención de commits.
4. Abre un **Pull Request** hacia `develop`.
5. Espera a que el pipeline de CI pase ✅ y al menos un compañero revise tu PR.
6. Haz merge con **Squash and Merge** o **Merge Commit** (según el caso).

---

## 🌿 Estrategia de Ramas

```
main            ← Producción estable (protegida)
  └── develop   ← Integración y pruebas
        ├── feature/nombre-descriptivo
        ├── fix/nombre-del-bug
        └── hotfix/nombre-urgente
```

| Rama | Propósito | Merge hacia |
|---|---|---|
| `main` | Código en producción | — (solo recibe de `develop`) |
| `develop` | Integración continua del equipo | `main` |
| `feature/*` | Nuevas funcionalidades | `develop` |
| `fix/*` | Corrección de bugs no urgentes | `develop` |
| `hotfix/*` | Correcciones urgentes en producción | `main` y `develop` |

### Nombrado de ramas

```
feature/ms-users-login
feature/frontend-dashboard
fix/cors-nginx-config
hotfix/jwt-token-expiry
```

---

## 📝 Convención de Commits

Usamos [Conventional Commits](https://www.conventionalcommits.org/):

```
<tipo>(alcance): descripción breve
```

### Tipos permitidos

| Tipo | Uso |
|---|---|
| `feat` | Nueva funcionalidad |
| `fix` | Corrección de bug |
| `docs` | Cambios en documentación |
| `style` | Formato, espacios, punto y coma (sin cambio de lógica) |
| `refactor` | Reestructuración de código sin cambiar comportamiento |
| `test` | Agregar o modificar tests |
| `chore` | Tareas de mantenimiento (configs, dependencias, CI) |
| `ci` | Cambios en pipelines de CI/CD |
| `build` | Cambios en Docker, Dockerfiles, docker-compose |

### Alcances sugeridos

| Alcance | Componente |
|---|---|
| `ms-users` | Microservicio de usuarios |
| `ms-books` | Microservicio de libros |
| `ms-chat` | Microservicio de chat |
| `frontend` | Aplicación React |
| `nginx` | Configuración del API Gateway |
| `docker` | Docker Compose y Dockerfiles |
| `ci` | GitHub Actions |
| `monitoring` | Prometheus, Grafana, ELK |

### Ejemplos

```
feat(ms-users): add JWT login endpoint
fix(nginx): fix WebSocket upgrade headers
docs(readme): update installation instructions
chore(docker): add health check to ms-books
ci(ci): add lint step for frontend
build(ms-chat): update Flask-SocketIO to v5.4
test(ms-books): add unit tests for book creation
```

---

## 🔀 Pull Requests

### Antes de abrir un PR

- [ ] Tu rama está actualizada con `develop` (`git pull origin develop`)
- [ ] El código compila/corre sin errores
- [ ] Has probado tus cambios localmente con `docker compose -f docker-compose.dev.yml up`
- [ ] Los tests pasan
- [ ] Tu código sigue las convenciones de estilo del proyecto

### Título del PR

Sigue la misma convención de commits:

```
feat(ms-books): implement CRUD endpoints
```

### Descripción del PR

Incluye:
- **Qué** cambia
- **Por qué** se hizo el cambio
- **Cómo** probarlo
- Capturas de pantalla si es un cambio visual

---

## 🎨 Convenciones de Código

### Python (Backend — Flask)

- Seguir [PEP 8](https://peps.python.org/pep-0008/)
- Usar `snake_case` para variables y funciones
- Usar `PascalCase` para clases
- Docstrings en funciones públicas
- Máximo 120 caracteres por línea

### JavaScript/React (Frontend)

- Usar `camelCase` para variables y funciones
- Usar `PascalCase` para componentes React
- Preferir funciones flecha y componentes funcionales
- Usar hooks de React (no clases)

### General

- Archivos y carpetas en `kebab-case` o `snake_case`
- No subir archivos `.env` al repositorio
- No subir `node_modules/`, `__pycache__/`, `.venv/`

---

## 🐛 Reportar Problemas

Si encuentras un bug o tienes una sugerencia, abre un **Issue** en GitHub con:

1. Descripción clara del problema
2. Pasos para reproducirlo
3. Comportamiento esperado vs. actual
4. Capturas de pantalla si aplica
