# 🧠 PsicoBienestar - Plataforma de Psicología y Bienestar

Plataforma web completa para servicios de psicología y bienestar mental que combina cursos online, sistema de citas terapéuticas, y gestión administrativa integral.

---

## 📋 Tabla de Contenidos

- [Descripción](#descripción)
- [Características Principales](#características-principales)
- [Stack Tecnológico](#stack-tecnológico)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Instalación](#instalación)
- [Variables de Entorno](#variables-de-entorno)
- [Comandos Disponibles](#comandos-disponibles)
- [Documentación](#documentación)

---

## 📖 Descripción

**PsicoBienestar** es una plataforma SaaS diseñada para profesionales de la salud mental que desean:

- 🎓 **Ofrecer cursos online** con contenido estructurado en módulos y lecciones
- 📅 **Gestionar citas terapéuticas** con sistema de reservas y videollamadas
- 💳 **Procesar pagos seguros** mediante integración con Stripe
- 👥 **Administrar usuarios** con sistema de roles (estudiantes, terapeutas, admins)
- 📧 **Enviar notificaciones** automáticas por email (bienvenida, confirmaciones)
- 📊 **Analizar métricas** con dashboard administrativo

### 🎯 Objetivo

Conectar profesionales de la salud mental con clientes a través de:
- Contenido educativo de calidad
- Sesiones terapéuticas personalizadas
- Experiencia de usuario cálida y accesible

---

## ✨ Características Principales

### Para Estudiantes/Usuarios

- ✅ **Registro y autenticación** segura con JWT
- ✅ **Catálogo de cursos** con búsqueda y filtros
- ✅ **Sistema de inscripciones** con checkout de Stripe
- ✅ **Área de estudiante** con acceso a cursos adquiridos
- ✅ **Seguimiento de progreso** en cada curso
- ✅ **Reserva de citas** terapéuticas
- ✅ **Notificaciones por email** automáticas
- ✅ **Interfaz responsive** (desktop y móvil)

### Para Administradores

- ✅ **Panel de administración** completo
- ✅ **Dashboard con estadísticas** en tiempo real
- ✅ **Gestión de usuarios** (crear, editar roles, eliminar)
- ✅ **Gestión de cursos** (publicar, destacar)
- ✅ **Gestión de citas** (confirmar, agregar video links)
- ✅ **Gestión de pagos** e inscripciones
- ✅ **Análisis de ingresos** y métricas clave

### Seguridad

- 🔒 **Contraseñas hasheadas** con bcrypt (10 rounds)
- 🔒 **JWT en cookies httpOnly** (previene XSS)
- 🔒 **Validación de datos** con Zod en todos los endpoints
- 🔒 **Roles de usuario** con middleware de autorización
- 🔒 **CORS configurado** para dominios específicos
- 🔒 **Protección CSRF** con cookies SameSite

---

## 🛠️ Stack Tecnológico

### Frontend

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **React** | 18.x | Biblioteca UI |
| **TypeScript** | 5.x | Type safety |
| **Vite** | 5.x | Build tool y dev server |
| **Wouter** | Latest | Routing SPA |
| **TanStack Query** | 5.x | Server state management |
| **Tailwind CSS** | 3.x | Utility-first CSS |
| **shadcn/ui** | Latest | Component library |
| **Radix UI** | Latest | Primitivos accesibles |
| **React Hook Form** | Latest | Gestión de formularios |
| **Zod** | Latest | Validación de schemas |

### Backend

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **Node.js** | 20.x | Runtime |
| **Express.js** | 4.x | Web framework |
| **TypeScript** | 5.x | Type safety |
| **Drizzle ORM** | Latest | ORM TypeScript-first |
| **PostgreSQL** | 14+ | Base de datos |
| **Passport.js** | Latest | Autenticación |
| **bcrypt** | Latest | Hashing de contraseñas |
| **jsonwebtoken** | Latest | JWT tokens |

### Integraciones

| Servicio | Propósito |
|----------|-----------|
| **Stripe** | Procesamiento de pagos |
| **Resend** | Envío de emails transaccionales |
| **Neon** | PostgreSQL serverless (Replit) |

### Tooling

- **esbuild** - Bundler producción (backend)
- **tsx** - TypeScript execution
- **drizzle-kit** - Migraciones de BD
- **Lucide React** - Iconos
- **date-fns** - Manipulación de fechas

---

## 📁 Estructura del Proyecto

```
psicobienestar/
├── client/                    # Frontend (React + Vite)
│   ├── src/
│   │   ├── components/        # Componentes reutilizables
│   │   │   ├── ui/            # shadcn/ui components
│   │   │   └── Header.tsx     # Header global
│   │   ├── contexts/          # React Context
│   │   │   └── AuthContext.tsx
│   │   ├── hooks/             # Custom hooks
│   │   │   └── use-toast.ts
│   │   ├── lib/               # Utilidades
│   │   │   ├── queryClient.ts # TanStack Query config
│   │   │   └── utils.ts
│   │   ├── pages/             # Páginas de la app
│   │   │   ├── Home.tsx
│   │   │   ├── Courses.tsx
│   │   │   ├── Booking.tsx
│   │   │   ├── Login.tsx
│   │   │   ├── Register.tsx
│   │   │   ├── Checkout.tsx
│   │   │   ├── StudentArea.tsx
│   │   │   ├── AdminDashboard.tsx
│   │   │   └── AdminUsers.tsx
│   │   ├── App.tsx            # Router principal
│   │   ├── main.tsx           # Entry point
│   │   └── index.css          # Estilos globales
│   └── index.html
│
├── server/                    # Backend (Express + TypeScript)
│   ├── auth.ts                # Configuración Passport.js
│   ├── db.ts                  # Cliente Drizzle
│   ├── email.ts               # Servicio de emails (Resend)
│   ├── index.ts               # Entry point del servidor
│   ├── routes.ts              # Endpoints de API
│   ├── storage.ts             # Abstracción de DB (IStorage)
│   └── vite.ts                # Middleware Vite en dev
│
├── shared/                    # Código compartido
│   └── schema.ts              # Drizzle schemas + Zod
│
├── docs/                      # Documentación
│   ├── README.md              # Este archivo
│   ├── API.md                 # Documentación de API
│   ├── ARCHITECTURE.md        # Arquitectura del sistema
│   ├── DATABASE.md            # Esquema de base de datos
│   ├── ADMIN_MANUAL.md        # Manual del administrador
│   ├── USER_MANUAL.md         # Manual del usuario
│   ├── SETUP.md               # Instalación para devs
│   ├── DEPLOYMENT.md          # Guías de despliegue
│   ├── TROUBLESHOOTING.md     # Solución de problemas
│   └── CHANGELOG.md           # Historial de cambios
│
├── drizzle.config.ts          # Configuración Drizzle ORM
├── vite.config.ts             # Configuración Vite
├── tailwind.config.ts         # Configuración Tailwind
├── tsconfig.json              # TypeScript config
└── package.json               # Dependencias
```

### Descripción de Carpetas Clave

#### `/client`
Aplicación React SPA con arquitectura basada en componentes.

- **`/components/ui`**: Componentes de shadcn/ui (Button, Card, Form, etc.)
- **`/pages`**: Vistas principales de la aplicación (una por ruta)
- **`/contexts`**: Context API para estado global (AuthContext)
- **`/lib`**: Configuración de librerías y utilidades

#### `/server`
API REST con Express.js y arquitectura en capas.

- **`routes.ts`**: Define todos los endpoints HTTP
- **`storage.ts`**: Capa de abstracción de datos (IStorage interface)
- **`auth.ts`**: Estrategias de autenticación con Passport.js
- **`email.ts`**: Templates y envío de emails

#### `/shared`
Tipos y schemas compartidos entre frontend y backend.

- **`schema.ts`**: Modelos de Drizzle + schemas de Zod

---

## 🚀 Instalación

### Requisitos Previos

- Node.js 18.0 o superior
- PostgreSQL 14 o superior
- npm o pnpm
- Cuenta de Stripe (modo test)
- API key de Resend (opcional para emails)

### Pasos

1. **Clonar el repositorio**
```bash
git clone https://github.com/tu-usuario/psicobienestar.git
cd psicobienestar
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno** (ver sección siguiente)

4. **Configurar base de datos**
```bash
# Ejecutar migraciones
npm run db:push

# Poblar datos de ejemplo (opcional)
npm run seed
```

5. **Iniciar desarrollo**
```bash
npm run dev
```

6. **Acceder a la aplicación**
```
http://localhost:5000
```

---

## 🔐 Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
# Base de Datos
DATABASE_URL="postgresql://user:password@localhost:5432/psicobienestar"

# PostgreSQL (valores individuales)
PGHOST="localhost"
PGUSER="postgres"
PGPASSWORD="tu_password"
PGDATABASE="psicobienestar"
PGPORT="5432"

# Autenticación
SESSION_SECRET="tu_secret_muy_seguro_aqui_min_32_caracteres"

# Stripe
STRIPE_SECRET_KEY="sk_test_..." # Test key
VITE_STRIPE_PUBLIC_KEY="pk_test_..." # Public key para frontend

# Opcional: Producción
TESTING_STRIPE_SECRET_KEY="sk_test_..."
TESTING_VITE_STRIPE_PUBLIC_KEY="pk_test_..."

# Resend (Emails)
RESEND_API_KEY="re_..."

# Entorno
NODE_ENV="development" # o "production"
```

### Obtener Claves

#### Stripe
1. Regístrate en [stripe.com](https://stripe.com)
2. Ve a Developers → API keys
3. Copia `Publishable key` y `Secret key` (modo test)

#### Resend
1. Regístrate en [resend.com](https://resend.com)
2. Ve a API Keys
3. Crea una nueva API key

---

## ⚡ Comandos Disponibles

### Desarrollo

```bash
# Iniciar servidor de desarrollo (frontend + backend)
npm run dev

# Solo build del frontend
npm run build

# Preview de build de producción
npm run preview
```

### Base de Datos

```bash
# Sincronizar schema con BD (sin pérdida de datos)
npm run db:push

# Forzar sincronización (⚠️ puede perder datos)
npm run db:push --force

# Abrir Drizzle Studio (GUI visual)
npx drizzle-kit studio
```

### Testing

```bash
# Ejecutar tests (cuando estén configurados)
npm test

# Tests con coverage
npm run test:coverage
```

### Producción

```bash
# Build completo (frontend + backend)
npm run build

# Iniciar servidor de producción
npm start
```

---

## 📚 Documentación

Esta documentación está organizada por audiencia y propósito:

### Para Usuarios

- **[Manual del Usuario](./USER_MANUAL.md)** - Guía completa para estudiantes
- [Preguntas Frecuentes](#) - FAQ y soluciones rápidas

### Para Administradores

- **[Manual del Administrador](./ADMIN_MANUAL.md)** - Gestión de la plataforma
- [Dashboard Analytics](#) - Interpretación de métricas

### Para Desarrolladores

- **[API Documentation](./API.md)** - Todos los endpoints con ejemplos
- **[Architecture](./ARCHITECTURE.md)** - Diseño y patrones del sistema
- **[Database Schema](./DATABASE.md)** - Modelos y relaciones
- **[Setup Guide](./SETUP.md)** - Instalación paso a paso
- **[Deployment](./DEPLOYMENT.md)** - Despliegue en producción
- **[Troubleshooting](./TROUBLESHOOTING.md)** - Solución de problemas
- **[Changelog](./CHANGELOG.md)** - Historial de versiones

---

## 🎨 Paleta de Colores

La plataforma usa una identidad visual cálida y accesible:

```css
--crema: #FDFBF5;      /* Fondo principal */
--beige: #F0EDE7;       /* Fondo secundario */
--dorado: #C6A969;      /* Acentos y CTAs */
--marron: #4E443A;      /* Texto principal */
--gris-oscuro: #6B6558; /* Texto secundario */
--gris-medio: #8C8579;  /* Texto terciario */
--gris-claro: #D4CEC3;  /* Bordes */
```

### Tipografía

- **Font family**: Inter (Google Fonts)
- **Pesos**: 400 (regular), 500 (medium), 600 (semibold), 700 (bold)

---

## 🔄 Flujos Principales

### Inscripción a Curso

```
Usuario explora catálogo
    ↓
Selecciona curso → Click "Inscribirse"
    ↓
Sistema crea enrollment (pending)
    ↓
Redirige a Stripe Checkout
    ↓
Usuario completa pago
    ↓
Webhook actualiza enrollment (active)
    ↓
Email de confirmación enviado
    ↓
Acceso inmediato en /alumnos
```

### Agendado de Cita

```
Usuario accede a /agendar
    ↓
Selecciona fecha y hora
    ↓
Completa formulario (notas opcionales)
    ↓
Sistema crea appointment (pending)
    ↓
Admin revisa → Confirma cita
    ↓
Admin agrega video link (Google Meet)
    ↓
Email con link enviado al usuario
    ↓
Usuario recibe recordatorio 24h antes
```

---

## 🤝 Contribuir

### Código de Conducta

Este proyecto sigue el [Contributor Covenant](https://www.contributor-covenant.org/).

### Proceso de Contribución

1. Fork el repositorio
2. Crea una rama: `git checkout -b feature/nueva-funcionalidad`
3. Realiza cambios y commits: `git commit -m 'Agrega nueva funcionalidad'`
4. Push a la rama: `git push origin feature/nueva-funcionalidad`
5. Abre un Pull Request

### Guías de Estilo

- **TypeScript**: Usa tipos explícitos, evita `any`
- **React**: Componentes funcionales con hooks
- **CSS**: Tailwind utility classes, evita CSS custom
- **Commits**: Conventional Commits format
- **Tests**: Cobertura mínima 80% para nuevas features

---

## 📄 Licencia

Este proyecto está bajo la licencia MIT. Ver archivo `LICENSE` para más detalles.

---

## 👥 Autores

- **Desarrollo Principal**: [Tu Nombre](https://github.com/tu-usuario)
- **Diseño UI/UX**: [Nombre Diseñador]
- **Consultoría Psicología**: [Nombre Psicólogo]

---

## 🙏 Agradecimientos

- [shadcn/ui](https://ui.shadcn.com/) - Component library
- [Lucide Icons](https://lucide.dev/) - Iconografía
- [Stripe](https://stripe.com/) - Procesamiento de pagos
- [Resend](https://resend.com/) - Servicio de emails
- [Neon](https://neon.tech/) - PostgreSQL serverless

---

## 📞 Soporte

- **Email**: soporte@psicobienestar.com
- **GitHub Issues**: [github.com/tu-usuario/psicobienestar/issues](https://github.com/tu-usuario/psicobienestar/issues)
- **Documentación**: [/docs](./docs)

---

## 🗺️ Roadmap

### v1.0 (Actual)
- ✅ Sistema de autenticación
- ✅ Catálogo de cursos
- ✅ Inscripciones con Stripe
- ✅ Reserva de citas
- ✅ Panel de administración básico
- ✅ Emails transaccionales

### v2.0 (Próximo)
- 🔲 Sistema de contenido de cursos (módulos, lecciones, videos)
- 🔲 Seguimiento de progreso detallado
- 🔲 Certificados automáticos
- 🔲 Chat en tiempo real
- 🔲 Notificaciones push
- 🔲 App móvil (React Native)

### v3.0 (Futuro)
- 🔲 Inteligencia artificial para recomendaciones
- 🔲 Comunidad de estudiantes
- 🔲 Gamificación y badges
- 🔲 Integración con calendarios (Google, Outlook)
- 🔲 Multi-idioma
- 🔲 Portal para terapeutas

---

**¡Gracias por usar PsicoBienestar!** 💚
