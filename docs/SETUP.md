# 🚀 Guía de Setup para Desarrolladores - PsicoBienestar

Instrucciones completas para configurar el entorno de desarrollo local.

---

## 📋 Requisitos Previos

### Software Necesario

| Software | Versión Mínima | Comando de Verificación |
|----------|----------------|------------------------|
| **Node.js** | 18.0.0 | `node --version` |
| **npm** | 9.0.0 | `npm --version` |
| **PostgreSQL** | 14.0 | `psql --version` |
| **Git** | 2.30.0 | `git --version` |

### Instalación de Requisitos

#### macOS (Homebrew)

```bash
# Node.js
brew install node@20

# PostgreSQL
brew install postgresql@14
brew services start postgresql@14

# Git (generalmente ya instalado)
brew install git
```

#### Ubuntu/Debian

```bash
# Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# PostgreSQL
sudo apt-get install postgresql postgresql-contrib

# Git
sudo apt-get install git
```

#### Windows

```powershell
# Instalar desde sitios oficiales:
# Node.js: https://nodejs.org
# PostgreSQL: https://www.postgresql.org/download/windows
# Git: https://git-scm.com/download/win
```

---

## 📦 Instalación del Proyecto

### 1. Clonar el Repositorio

```bash
# Clonar desde GitHub
git clone https://github.com/tu-usuario/psicobienestar.git

# Navegar a la carpeta
cd psicobienestar
```

### 2. Instalar Dependencias

```bash
# Instalar todas las dependencias
npm install

# Tiempo estimado: 2-3 minutos
```

**Dependencias instaladas:**
- Frontend: React, Vite, TanStack Query, Tailwind, shadcn/ui
- Backend: Express, Drizzle ORM, Passport.js
- Utilidades: TypeScript, Zod, bcrypt, JWT

---

## 🔐 Configuración de Variables de Entorno

### 1. Crear archivo `.env`

```bash
# Copiar template
cp .env.example .env

# O crear manualmente
touch .env
```

### 2. Configurar Variables

**`.env` completo:**

```env
# ===== BASE DE DATOS =====
DATABASE_URL="postgresql://postgres:password@localhost:5432/psicobienestar"

# Valores individuales (usados por Neon/Replit)
PGHOST="localhost"
PGUSER="postgres"
PGPASSWORD="password"
PGDATABASE="psicobienestar"
PGPORT="5432"

# ===== AUTENTICACIÓN =====
SESSION_SECRET="tu_secret_super_seguro_minimo_32_caracteres_aqui"

# ===== STRIPE (PAGOS) =====
# Claves de test (obtener en https://dashboard.stripe.com/test/apikeys)
STRIPE_SECRET_KEY="sk_test_51..."
VITE_STRIPE_PUBLIC_KEY="pk_test_51..."

# Claves de prueba para testing
TESTING_STRIPE_SECRET_KEY="sk_test_51..."
TESTING_VITE_STRIPE_PUBLIC_KEY="pk_test_51..."

# ===== RESEND (EMAILS) =====
# API key (obtener en https://resend.com/api-keys)
RESEND_API_KEY="re_..."

# ===== ENTORNO =====
NODE_ENV="development"
```

### 3. Obtener Claves Externas

#### Stripe (Procesamiento de Pagos)

1. Crear cuenta en [stripe.com](https://stripe.com)
2. Activar modo test
3. Ir a **Developers → API Keys**
4. Copiar:
   - `Publishable key` → `VITE_STRIPE_PUBLIC_KEY`
   - `Secret key` → `STRIPE_SECRET_KEY`

**⚠️ Importante:**
- Usa claves de **test** (comienzan con `pk_test_` y `sk_test_`)
- Nunca comitees claves reales en Git

#### Resend (Emails)

1. Crear cuenta en [resend.com](https://resend.com)
2. Verificar dominio (o usar dominio de prueba)
3. Ir a **API Keys**
4. Crear nueva key
5. Copiar → `RESEND_API_KEY`

**Opcional en desarrollo:**
- Emails no críticos para testing local
- Puedes comentar código de envío de emails temporalmente

---

## 🗄️ Configuración de Base de Datos

### 1. Crear Base de Datos

#### PostgreSQL Local

```bash
# Conectar a PostgreSQL
psql -U postgres

# Crear base de datos
CREATE DATABASE psicobienestar;

# Salir
\q
```

#### Verificar Conexión

```bash
# Probar conexión
psql -U postgres -d psicobienestar -c "SELECT version();"
```

### 2. Ejecutar Migraciones

```bash
# Sincronizar schema con BD
npm run db:push

# Deberías ver:
# ✅ Migrations applied successfully
```

**Tablas creadas:**
- ✅ `users` (usuarios)
- ✅ `courses` (cursos)
- ✅ `enrollments` (inscripciones)
- ✅ `appointments` (citas)

### 3. Poblar Datos de Ejemplo (Opcional)

**Crear archivo `server/seed.ts`:**

```typescript
import { db } from "./db";
import { users, courses } from "@shared/schema";
import bcrypt from "bcrypt";

async function seed() {
  console.log("🌱 Poblando base de datos...");

  // Admin
  const adminPass = await bcrypt.hash("Admin123!", 10);
  const [admin] = await db.insert(users).values({
    email: "admin@psicobienestar.com",
    fullName: "Admin Principal",
    passwordHash: adminPass,
    role: "admin",
  }).returning();
  console.log("✅ Admin creado");

  // Usuario de prueba
  const userPass = await bcrypt.hash("User123!", 10);
  await db.insert(users).values({
    email: "estudiante@example.com",
    fullName: "Estudiante de Prueba",
    passwordHash: userPass,
    role: "student",
  });
  console.log("✅ Usuario de prueba creado");

  // Cursos
  await db.insert(courses).values([
    {
      title: "Gestión de la Ansiedad",
      description: "Aprende técnicas efectivas para manejar la ansiedad en tu vida diaria.",
      price: "49.99",
      duration: "4 semanas",
      topics: ["Mindfulness", "Respiración", "CBT"],
      image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773",
      isPublished: true,
      isFeatured: true,
    },
    {
      title: "Mindfulness para el Estrés",
      description: "Descubre el poder de la atención plena para reducir el estrés.",
      price: "39.99",
      duration: "3 semanas",
      topics: ["Meditación", "Mindfulness", "Relajación"],
      image: "https://images.unsplash.com/photo-1593811167562-9cef47bfc4a7",
      isPublished: true,
      isFeatured: false,
    },
  ]);
  console.log("✅ Cursos creados");

  console.log("\n🎉 Base de datos poblada exitosamente");
  console.log("\nCredenciales de prueba:");
  console.log("Admin: admin@psicobienestar.com / Admin123!");
  console.log("Usuario: estudiante@example.com / User123!");
  
  process.exit(0);
}

seed();
```

**Ejecutar seed:**

```bash
tsx server/seed.ts
```

---

## ⚙️ Scripts Disponibles

### Desarrollo

```bash
# Iniciar servidor de desarrollo
npm run dev

# Acceder a:
# Frontend + Backend: http://localhost:5000
```

**Qué incluye `npm run dev`:**
- ✅ Backend Express en puerto 5000
- ✅ Frontend Vite con HMR
- ✅ Hot reload automático
- ✅ TypeScript watch mode

### Base de Datos

```bash
# Sincronizar schema (push changes)
npm run db:push

# Forzar sincronización (⚠️ puede perder datos)
npm run db:push --force

# Abrir Drizzle Studio (GUI visual)
npx drizzle-kit studio
# Abre en: http://localhost:4983
```

### Build

```bash
# Build de producción
npm run build

# Preview de build
npm run preview
```

### Linting y Formateo

```bash
# TypeScript check (actualmente no configurado)
npx tsc --noEmit

# Format con Prettier (recomendado configurar)
npm install -D prettier
npx prettier --write "**/*.{ts,tsx,js,json}"
```

---

## 🧪 Testing

### Setup de Tests (Próximamente)

**Instalar dependencias:**

```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom happy-dom
```

**Configurar `vitest.config.ts`:**

```typescript
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'happy-dom',
    globals: true,
    setupFiles: './tests/setup.ts',
  },
});
```

**Ejecutar tests:**

```bash
npm test
```

---

## 🔧 Troubleshooting de Setup

### Error: Puerto 5000 ocupado

```bash
# Encontrar proceso
lsof -i :5000

# Matar proceso
kill -9 [PID]

# O usar puerto diferente
PORT=3000 npm run dev
```

### Error: No se puede conectar a PostgreSQL

```bash
# Verificar que PostgreSQL está corriendo
# macOS
brew services list | grep postgresql

# Linux
sudo systemctl status postgresql

# Iniciar si está detenido
# macOS
brew services start postgresql@14

# Linux
sudo systemctl start postgresql
```

### Error: "Prisma Client not generated"

```bash
# Generar cliente de Drizzle
npx drizzle-kit generate
```

### Error: Dependencias faltantes

```bash
# Limpiar e reinstalar
rm -rf node_modules package-lock.json
npm install
```

---

## 📂 Estructura de Archivos Generados

Después del setup completo:

```
psicobienestar/
├── node_modules/        # Dependencias (ignorado en Git)
├── .env                 # Variables de entorno (ignorado en Git)
├── dist/                # Build de producción
└── drizzle/             # Archivos generados de Drizzle
```

---

## 🎯 Verificación Final

### Checklist de Setup Completo

- [ ] Node.js 18+ instalado
- [ ] PostgreSQL 14+ corriendo
- [ ] Repositorio clonado
- [ ] `npm install` exitoso
- [ ] Archivo `.env` configurado
- [ ] Claves de Stripe obtenidas
- [ ] Base de datos creada
- [ ] Migraciones ejecutadas (`npm run db:push`)
- [ ] Datos de prueba poblados (opcional)
- [ ] Servidor corre sin errores (`npm run dev`)
- [ ] Frontend carga en http://localhost:5000

### Test Manual

1. **Abrir http://localhost:5000**
   - ✅ Página de inicio carga correctamente

2. **Registrar usuario**
   - ✅ Ir a `/registro`
   - ✅ Crear cuenta con email único
   - ✅ Recibir email de bienvenida (si Resend configurado)

3. **Login**
   - ✅ Iniciar sesión con credenciales
   - ✅ Ver nombre en header

4. **Explorar cursos**
   - ✅ Ver catálogo en `/cursos`
   - ✅ Click en curso individual

5. **Admin panel**
   - ✅ Login con admin@psicobienestar.com
   - ✅ Acceder a `/admin`
   - ✅ Ver dashboard con estadísticas

---

## 🔄 Actualizar Proyecto

```bash
# Obtener últimos cambios
git pull origin main

# Instalar nuevas dependencias
npm install

# Sincronizar cambios de BD
npm run db:push

# Reiniciar servidor
npm run dev
```

---

## 🆘 Ayuda

Si encuentras problemas:

1. **Consulta [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)**
2. **Revisa logs del servidor** en terminal
3. **Verifica variables de entorno** en `.env`
4. **Limpia y reinstala** dependencias
5. **Crea un issue** en GitHub con logs completos

---

## 📚 Próximos Pasos

Después del setup:

1. **Leer [ARCHITECTURE.md](./ARCHITECTURE.md)** - Entender el diseño
2. **Revisar [API.md](./API.md)** - Conocer endpoints disponibles
3. **Explorar [DATABASE.md](./DATABASE.md)** - Entender modelos de datos
4. **Contribuir** - Ver CONTRIBUTING.md (si existe)

---

¡Setup completo! 🎉 Estás listo para desarrollar.
