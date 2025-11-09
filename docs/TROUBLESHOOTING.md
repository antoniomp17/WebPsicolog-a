# 🔧 Solución de Problemas - PsicoBienestar

Guía de troubleshooting para problemas comunes.

---

## 📑 Tabla de Contenidos

- [Problemas de Autenticación](#problemas-de-autenticación)
- [Problemas de Base de Datos](#problemas-de-base-de-datos)
- [Problemas de API](#problemas-de-api)
- [Problemas de Stripe](#problemas-de-stripe)
- [Problemas de Email](#problemas-de-email)
- [Problemas de Frontend](#problemas-de-frontend)
- [Problemas de Despliegue](#problemas-de-despliegue)

---

## 🔐 Problemas de Autenticación

### Error: "JWT token inválido" o "No autenticado"

**Síntomas:**
- Al acceder a rutas protegidas retorna 401
- Usuario se desloguea automáticamente
- Cookie no persiste

**Causas comunes:**
1. `SESSION_SECRET` incorrecto o cambiado
2. Cookie no se está enviando (CORS)
3. Token expirado

**Soluciones:**

```typescript
// 1. Verificar SESSION_SECRET en .env
console.log('SESSION_SECRET length:', process.env.SESSION_SECRET?.length);
// Debe ser mínimo 32 caracteres

// 2. Verificar configuración de cookies
res.cookie('token', token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production', // HTTPS solo en prod
  sameSite: 'strict',
  maxAge: 7 * 24 * 60 * 60 * 1000,
});

// 3. Verificar CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5000',
  credentials: true, // IMPORTANTE para cookies
}));
```

**Solución rápida:**
```bash
# Regenerar SESSION_SECRET
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Actualizar en .env
SESSION_SECRET="nuevo_secret_generado"

# Reiniciar servidor
npm run dev
```

---

### Error: "Credenciales inválidas" en login correcto

**Causa:** Contraseña no coincide con hash en BD

**Solución:**

```typescript
// Verificar hash de contraseña
const isValid = await bcrypt.compare(password, user.passwordHash);
console.log('Password valid:', isValid);

// Si siempre es false, recrear usuario:
const newHash = await bcrypt.hash('Password123!', 10);
await db.update(users)
  .set({ passwordHash: newHash })
  .where(eq(users.id, userId));
```

---

### Usuario no puede acceder al panel admin

**Causa:** Rol incorrecto en BD

**Solución:**

```sql
-- Verificar rol
SELECT id, email, role FROM users WHERE email = 'admin@example.com';

-- Actualizar a admin
UPDATE users SET role = 'admin' WHERE email = 'admin@example.com';
```

O usando Drizzle Studio:
```bash
npx drizzle-kit studio
# Editar usuario manualmente
```

---

## 🗄️ Problemas de Base de Datos

### Error: "Base de datos no conecta" / "Connection refused"

**Síntomas:**
- `ECONNREFUSED` al iniciar servidor
- Queries fallan con timeout

**Solución:**

```bash
# 1. Verificar que PostgreSQL está corriendo
# macOS:
brew services list | grep postgresql

# Linux:
sudo systemctl status postgresql

# 2. Iniciar PostgreSQL
# macOS:
brew services start postgresql@14

# Linux:
sudo systemctl start postgresql

# 3. Verificar DATABASE_URL en .env
echo $DATABASE_URL

# Debe ser:
# postgresql://usuario:contraseña@localhost:5432/psicobienestar
```

---

### Error: "Prisma Client error" / "Client not initialized"

**Causa:** Cliente de Drizzle no generado

**Solución:**

```bash
# Generar cliente
npx drizzle-kit generate

# Sincronizar schema
npm run db:push

# Reiniciar servidor
npm run dev
```

---

### Error: "relation does not exist"

**Causa:** Migraciones no ejecutadas

**Solución:**

```bash
# Ejecutar migraciones
npm run db:push

# Si falla, forzar:
npm run db:push --force

# ⚠️ PRECAUCIÓN: --force puede borrar datos
# Hacer backup primero:
pg_dump psicobienestar > backup.sql
```

---

### Error: "column does not exist"

**Causa:** Schema desactualizado

**Solución:**

```bash
# Ver diferencias entre schema y BD
npx drizzle-kit check

# Aplicar cambios
npm run db:push
```

---

## 🌐 Problemas de API

### Error: "CORS blocked"

**Síntomas:**
- Requests fallan desde frontend
- Console muestra: "blocked by CORS policy"

**Solución:**

```typescript
// server/index.ts
import cors from 'cors';

app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? 'https://tu-dominio.com'
    : 'http://localhost:5000',
  credentials: true,
}));
```

**Verificar headers:**
```bash
curl -I http://localhost:5000/api/courses
# Debe incluir:
# Access-Control-Allow-Origin: http://localhost:5000
```

---

### Error: 500 Internal Server Error

**Diagnóstico:**

```typescript
// Agregar logging detallado
app.use((err, req, res, next) => {
  console.error('Error details:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    body: req.body,
  });
  
  res.status(500).json({ 
    error: 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { details: err.message }),
  });
});
```

**Ver logs del servidor:**
```bash
# En terminal donde corre npm run dev
# Los errores aparecen ahí
```

---

### Error: 404 Not Found en endpoints válidos

**Causa:** Orden de middlewares incorrecto

**Solución:**

```typescript
// Orden correcto:
app.use(cors());              // 1. CORS primero
app.use(express.json());      // 2. Body parser
app.use(cookieParser());      // 3. Cookie parser
app.use('/api', apiRouter);   // 4. Rutas

// ❌ INCORRECTO:
app.use('/api', apiRouter);
app.use(express.json());      // Muy tarde, body ya parseado
```

---

## 💳 Problemas de Stripe

### Error: "Invalid API key"

**Solución:**

```bash
# Verificar claves en .env
echo $STRIPE_SECRET_KEY
echo $VITE_STRIPE_PUBLIC_KEY

# Deben comenzar con:
# sk_test_... (desarrollo)
# sk_live_... (producción)
```

**Obtener claves:**
1. [dashboard.stripe.com](https://dashboard.stripe.com)
2. Developers → API keys
3. Copiar nuevamente

---

### Webhook no recibe eventos

**Diagnóstico:**

```bash
# Ver logs de webhook
# En dashboard de Stripe:
# Developers → Webhooks → [tu endpoint] → View logs
```

**Solución:**

```typescript
// Verificar endpoint de webhook
app.post('/api/webhook/stripe', 
  express.raw({ type: 'application/json' }), // ⚠️ RAW body necesario
  async (req, res) => {
    const sig = req.headers['stripe-signature'];
    // ...
  }
);
```

**Testing local con Stripe CLI:**

```bash
# Instalar Stripe CLI
brew install stripe/stripe-cli/stripe

# Login
stripe login

# Escuchar webhooks
stripe listen --forward-to localhost:5000/api/webhook/stripe

# En otra terminal, trigger test
stripe trigger payment_intent.succeeded
```

---

### Error: "No such checkout session"

**Causa:** Session ID inválido o expirado

**Solución:**

```typescript
// Verificar que el session ID se guarda correctamente
const session = await stripe.checkout.sessions.create({ ... });
await db.update(enrollments)
  .set({ stripeSessionId: session.id })  // Guardar
  .where(eq(enrollments.id, enrollmentId));
```

---

## 📧 Problemas de Email

### No llegan emails

**Diagnóstico:**

```typescript
// Agregar logging
console.log('Sending email to:', email);
const result = await resend.emails.send({ ... });
console.log('Email result:', result);
```

**Soluciones:**

1. **Verificar API key**
```bash
echo $RESEND_API_KEY
# Debe comenzar con: re_...
```

2. **Verificar dominio en Resend**
- Ir a [resend.com/domains](https://resend.com/domains)
- Dominio debe estar verificado (verde)

3. **Revisar spam**
- Emails pueden ir a carpeta de spam
- Marcar como "No es spam"

4. **Logs de Resend**
- [resend.com/emails](https://resend.com/emails)
- Ver estado de emails enviados

**Testing sin Resend:**

```typescript
// Comentar temporalmente
// await sendWelcomeEmail(email, fullName);
console.log('Email would be sent to:', email);
```

---

## 🎨 Problemas de Frontend

### Error: "Cannot read property of undefined"

**Causa común:** Datos no cargados antes de renderizar

**Solución:**

```typescript
// ❌ INCORRECTO:
const { data: user } = useQuery({ queryKey: ['/api/auth/me'] });
return <div>{user.name}</div>; // user puede ser undefined

// ✅ CORRECTO:
const { data: user, isLoading } = useQuery({ queryKey: ['/api/auth/me'] });
if (isLoading) return <div>Cargando...</div>;
if (!user) return <div>No autenticado</div>;
return <div>{user.name}</div>;
```

---

### Componentes no actualizan después de mutación

**Causa:** Cache no invalidado

**Solución:**

```typescript
const mutation = useMutation({
  mutationFn: (data) => apiRequest('POST', '/api/enrollments', data),
  onSuccess: () => {
    // IMPORTANTE: Invalidar cache
    queryClient.invalidateQueries({ queryKey: ['/api/enrollments'] });
  },
});
```

---

### Estilos de Tailwind no aplican

**Solución:**

```bash
# 1. Verificar tailwind.config.ts
# Debe incluir:
content: [
  "./client/src/**/*.{js,jsx,ts,tsx}",
],

# 2. Reiniciar servidor
npm run dev

# 3. Limpiar cache de Vite
rm -rf node_modules/.vite
```

---

### Error: "Module not found"

**Causa:** Alias de importación mal configurado

**Solución:**

```typescript
// vite.config.ts
resolve: {
  alias: {
    "@": path.resolve(__dirname, "./client/src"),
    "@shared": path.resolve(__dirname, "./shared"),
  },
},

// tsconfig.json
"paths": {
  "@/*": ["./client/src/*"],
  "@shared/*": ["./shared/*"]
}
```

---

## 🚀 Problemas de Despliegue

### Build falla en producción

**Error común:**
```
Type error: ... is not assignable to type ...
```

**Solución:**

```bash
# Build localmente para ver errores
npm run build

# Arreglar errores de TypeScript
# Luego volver a deployar
```

---

### Aplicación muy lenta en producción

**Optimizaciones:**

```typescript
// 1. Habilitar compression
import compression from 'compression';
app.use(compression());

// 2. Cache de assets
app.use(express.static('dist/public', {
  maxAge: '1y',
  immutable: true,
}));

// 3. Connection pooling en BD
// Usar Neon con pooling habilitado
```

---

### Error: "Port already in use"

**Solución:**

```bash
# Encontrar proceso en puerto 5000
lsof -i :5000

# Matar proceso
kill -9 [PID]

# O usar otro puerto
PORT=3000 npm run dev
```

---

## 🔍 Herramientas de Diagnóstico

### Ver logs de BD

```bash
# Drizzle Studio (GUI)
npx drizzle-kit studio

# psql (CLI)
psql $DATABASE_URL
\dt  # Listar tablas
\d users  # Describir tabla
```

### Ver logs de API

```bash
# En desarrollo
npm run dev
# Logs aparecen en terminal

# En producción (Replit)
# Shell → tail -f /tmp/logs/*.log
```

### Network debugging

```javascript
// En frontend (DevTools → Console)
// Ver todas las requests
window.addEventListener('beforeunload', () => {
  console.table(performance.getEntriesByType('resource'));
});
```

---

## 🆘 Obtener Ayuda

Si ninguna solución funciona:

1. **Busca en Issues de GitHub**
2. **Revisa documentación:**
   - [API.md](./API.md)
   - [ARCHITECTURE.md](./ARCHITECTURE.md)
   - [DATABASE.md](./DATABASE.md)
3. **Crea un Issue** con:
   - Descripción del problema
   - Pasos para reproducir
   - Logs completos
   - Variables de entorno (sin valores sensibles)
   - Screenshot si aplica

---

## 📞 Contacto

- **Email**: soporte@psicobienestar.com
- **GitHub Issues**: [repositorio/issues](https://github.com/...)
