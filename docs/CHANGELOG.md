# 📝 Changelog - PsicoBienestar

Todos los cambios notables del proyecto documentados en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/),
y este proyecto sigue [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Planeado para v2.0
- Sistema de contenido de cursos (módulos, lecciones, videos)
- Seguimiento de progreso granular
- Certificados automáticos con PDF
- Chat en tiempo real entre usuario y terapeuta
- Notificaciones push
- Filtros avanzados en catálogo de cursos
- Búsqueda de cursos por keywords
- Sistema de reseñas y ratings
- Recordatorios de citas por email (24h antes)
- Dashboard de analíticas avanzado
- Exportación de reportes (CSV, PDF)
- Integración con calendarios (Google, Outlook)

### Planeado para v3.0
- App móvil nativa (React Native)
- Recomendaciones con IA
- Comunidad de estudiantes
- Gamificación y badges
- Multi-idioma (i18n)
- Portal para terapeutas
- Videoconferencia integrada (opcional)

---

## [1.0.0] - 2025-11-09

### 🎉 Primera Versión Estable

Lanzamiento inicial de la plataforma PsicoBienestar con funcionalidades core completas.

### Added

#### Autenticación y Usuarios
- Sistema de registro con validación de email
- Login con JWT almacenado en cookies httpOnly
- Logout con invalidación de sesión
- Middleware de autenticación para rutas protegidas
- Sistema de roles (student, therapist, admin)
- Hash de contraseñas con bcrypt (10 rounds)
- Emails de bienvenida automáticos

#### Cursos
- Catálogo de cursos con grid responsive
- Vista detallada de cada curso
- Cursos destacados (featured) en home
- Filtro por publicación (isPublished)
- Campos: título, descripción, precio, duración, temas, imagen
- 6 cursos de ejemplo precargados

#### Sistema de Inscripciones
- Inscripción a cursos con un click
- Estados: pending, active, completed
- Tracking de pago: pending, paid, failed
- Relación usuario-curso en base de datos
- Vista de cursos inscritos en área de estudiante

#### Pagos con Stripe
- Integración completa con Stripe Checkout
- Creación de sesiones de pago
- Webhook para confirmación automática
- Soporte para modo test y producción
- Actualización automática de enrollment al pagar
- Email de confirmación post-pago

#### Citas Terapéuticas
- Sistema de reserva de citas
- Selección de fecha y hora
- Notas opcionales del usuario
- Estados: pending, confirmed, completed, cancelled
- Campo para enlace de videollamada (Google Meet, Zoom)
- Lista de citas del usuario

#### Área de Estudiante
- Dashboard personal del estudiante
- Lista de cursos activos (pagados)
- Acceso a contenido de cursos
- Próximamente: progreso y certificados

#### Panel de Administración
- Dashboard con 6 métricas clave:
  - Total de usuarios
  - Cursos publicados vs. totales
  - Citas esta semana
  - Ingresos totales
  - Total de citas
  - Inscripciones completadas
- Gestión de usuarios:
  - Listar todos los usuarios
  - Cambiar roles (student, therapist, admin)
  - Eliminar usuarios
  - Protección: admin no puede auto-eliminarse
- API para gestión de cursos (publicar, destacar)
- API para gestión de citas (cambiar estado, agregar video link)
- API para gestión de inscripciones
- Protección por middleware: solo admins

#### Emails Transaccionales (Resend)
- Email de bienvenida al registrarse
- Email de confirmación de inscripción
- Templates con branding de la plataforma
- Configuración para desarrollo y producción

#### Interfaz de Usuario
- Design system con Tailwind CSS
- Componentes de shadcn/ui (Button, Card, Form, etc.)
- Paleta de colores cálida:
  - Crema (#FDFBF5) - Fondo
  - Dorado (#C6A969) - Acentos
  - Marrón (#4E443A) - Texto
- Tipografía: Inter font
- Totalmente responsive (mobile-first)
- Navegación con Wouter (SPA)
- Header con menú de usuario
- Footer informativo

#### Base de Datos
- PostgreSQL con Drizzle ORM
- 4 tablas principales:
  - users (usuarios)
  - courses (cursos)
  - enrollments (inscripciones)
  - appointments (citas)
- Relaciones con foreign keys
- Cascade delete configurado
- Índices en columnas frecuentes
- Migraciones con `drizzle-kit`

#### Infraestructura
- Arquitectura de 3 capas
- Patrón Repository para datos (IStorage)
- Validación con Zod en frontend y backend
- Type safety end-to-end con TypeScript
- Server state management con TanStack Query
- Build optimizado con Vite y esbuild
- Ready para despliegue en Replit

#### Seguridad
- XSS protection (httpOnly cookies)
- CSRF protection (SameSite cookies)
- SQL injection prevention (ORM parametrizado)
- Validación de datos en todos los endpoints
- CORS configurado
- Sanitización de respuestas (sin passwords)

#### Documentación
- README.md completo
- API.md con todos los endpoints
- ADMIN_MANUAL.md para administradores
- USER_MANUAL.md para estudiantes
- ARCHITECTURE.md con diagramas Mermaid
- DATABASE.md con esquema ERD
- SETUP.md para desarrolladores
- DEPLOYMENT.md para producción
- TROUBLESHOOTING.md con soluciones
- CHANGELOG.md (este archivo)

---

## [0.9.0] - 2025-11-08

### Added
- Implementación inicial del backend Express
- Configuración de Drizzle ORM
- Schemas de base de datos
- Autenticación con Passport.js
- Rutas de API básicas

### Changed
- Migración de almacenamiento en memoria a PostgreSQL

---

## [0.8.0] - 2025-11-07

### Added
- Integración de Stripe
- Checkout Session
- Webhook handler
- Flow completo de pago

---

## [0.7.0] - 2025-11-06

### Added
- Panel de administración
- Dashboard con estadísticas
- Gestión de usuarios

---

## [0.6.0] - 2025-11-05

### Added
- Área de estudiantes
- Lista de cursos inscritos
- Protección de rutas por autenticación

---

## [0.5.0] - 2025-11-04

### Added
- Sistema de citas
- Formulario de reserva
- Validación de fechas

---

## [0.4.0] - 2025-11-03

### Added
- Sistema de inscripciones
- Relación usuario-curso
- Estados de enrollment

---

## [0.3.0] - 2025-11-02

### Added
- Catálogo de cursos
- Vista detallada
- Cursos destacados en home

---

## [0.2.0] - 2025-11-01

### Added
- Sistema de autenticación
- Registro de usuarios
- Login con JWT
- Middleware de protección

### Changed
- Estructura de componentes React
- Organización de rutas

---

## [0.1.0] - 2025-10-31

### Added
- Setup inicial del proyecto
- Configuración de Vite
- React + TypeScript
- Tailwind CSS
- shadcn/ui components
- Estructura de carpetas
- Header y navegación
- Página de inicio básica

---

## Tipos de Cambios

- **Added**: Nuevas funcionalidades
- **Changed**: Cambios en funcionalidades existentes
- **Deprecated**: Funcionalidades marcadas como obsoletas
- **Removed**: Funcionalidades eliminadas
- **Fixed**: Corrección de bugs
- **Security**: Parches de seguridad

---

## Versionado

Este proyecto usa [Semantic Versioning](https://semver.org/):

- **MAJOR** (X.0.0): Cambios incompatibles en la API
- **MINOR** (0.X.0): Nuevas funcionalidades retrocompatibles
- **PATCH** (0.0.X): Correcciones de bugs retrocompatibles

---

## Enlaces

- [Repositorio GitHub](https://github.com/tu-usuario/psicobienestar)
- [Documentación](./README.md)
- [Issues](https://github.com/tu-usuario/psicobienestar/issues)
- [Releases](https://github.com/tu-usuario/psicobienestar/releases)
