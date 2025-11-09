# 🚀 Guía de Despliegue - PsicoBienestar

Instrucciones para desplegar la aplicación en producción.

---

## 📑 Tabla de Contenidos

- [Despliegue en Replit](#despliegue-en-replit)
- [Despliegue Separado (Frontend + Backend)](#despliegue-separado)
- [Configuración de Dominio](#configuración-de-dominio)
- [Variables de Entorno](#variables-de-entorno-producción)
- [Backups y Monitoreo](#backups-y-monitoreo)

---

## 🎨 Despliegue en Replit

Replit permite desplegar la aplicación completa con un solo click.

### Preparación

1. **Proyecto ya está en Replit** ✅
2. **Variables de entorno configuradas** en Secrets
3. **Base de datos PostgreSQL** creada automáticamente

### Configurar Secrets

En Replit, ve a **Tools → Secrets** y agrega:

```env
DATABASE_URL=postgresql://...
SESSION_SECRET=tu_secret_seguro_min_32_chars
STRIPE_SECRET_KEY=sk_live_... 
VITE_STRIPE_PUBLIC_KEY=pk_live_...
RESEND_API_KEY=re_...
NODE_ENV=production
```

**⚠️ Importante:**
- Usa claves **LIVE** de Stripe en producción
- `SESSION_SECRET` debe ser único y seguro
- `DATABASE_URL` lo provee Replit automáticamente

### Publicar (Deploy)

1. **Click en botón "Publish"** en Replit
2. **Selecciona configuración:**
   - ✅ Build Command: `npm run build`
   - ✅ Start Command: `npm start`
   - ✅ Puerto: 5000

3. **Aplicación publicada** en:
   ```
   https://[tu-repl-name].[tu-username].replit.app
   ```

### Actualizar Despliegue

Cada vez que hagas cambios:

1. Push a Git (si usas repositorio)
2. Click en "Publish" nuevamente
3. Replit hace build automático

---

## 🔀 Despliegue Separado

Para máxima escalabilidad, despliega frontend y backend por separado.

### Arquitectura Separada

```
Frontend (Vercel/Netlify)
    ↓ HTTP requests
Backend (Railway/Render)
    ↓
PostgreSQL (Neon/Supabase)
```

---

## 🎨 Frontend en Vercel

### 1. Build Local

```bash
npm run build
```

Genera carpeta `dist/public/` con archivos estáticos.

### 2. Deploy

**Opción A: CLI**

```bash
# Instalar Vercel CLI
npm install -g vercel

# Deploy
cd dist/public
vercel --prod
```

**Opción B: GitHub Integration**

1. Conecta repositorio con Vercel
2. Configura:
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist/public`
   - **Install Command**: `npm install`

### 3. Variables de Entorno

En Vercel Dashboard:

```env
VITE_STRIPE_PUBLIC_KEY=pk_live_...
VITE_API_URL=https://tu-backend.railway.app
```

---

## 🖥️ Backend en Railway

### 1. Crear Proyecto

```bash
# Instalar Railway CLI
npm install -g @railway/cli

# Login
railway login

# Inicializar
railway init
```

### 2. Configurar Variables

```bash
railway variables set DATABASE_URL="postgresql://..."
railway variables set SESSION_SECRET="..."
railway variables set STRIPE_SECRET_KEY="sk_live_..."
railway variables set RESEND_API_KEY="re_..."
railway variables set NODE_ENV="production"
```

### 3. Deploy

```bash
railway up
```

**URL generada:**
```
https://[proyecto-id].railway.app
```

### 4. Configurar Dominio Custom

```bash
railway domain
```

---

## 🐳 Backend en Render

### 1. Crear Web Service

1. Ve a [render.com](https://render.com)
2. **New → Web Service**
3. Conecta repositorio GitHub
4. Configura:
   - **Build Command**: `npm run build`
   - **Start Command**: `npm start`
   - **Environment**: Node

### 2. Variables de Entorno

En Render Dashboard → Environment:

```env
DATABASE_URL=postgresql://...
SESSION_SECRET=...
STRIPE_SECRET_KEY=sk_live_...
RESEND_API_KEY=re_...
NODE_ENV=production
```

### 3. Auto-Deploy

Render detecta cambios en `main` branch y redespliega automáticamente.

---

## 💾 Base de Datos en Neon

### 1. Crear Database

1. Ir a [neon.tech](https://neon.tech)
2. **Create Project**
3. Seleccionar región cercana a usuarios
4. Obtener `DATABASE_URL`

### 2. Ejecutar Migraciones

```bash
# Localmente con DATABASE_URL de producción
DATABASE_URL="postgresql://..." npm run db:push
```

### 3. Backups

Neon hace backups automáticos:
- ✅ Point-in-time recovery
- ✅ Snapshots diarios
- ✅ Restauración con un click

---

## 🌐 Configuración de Dominio

### Dominio Custom en Vercel

1. **Comprar dominio** (Namecheap, GoDaddy, etc.)
2. En Vercel → Settings → Domains
3. Agregar dominio: `psicobienestar.com`
4. Configurar DNS:

```
Type    Name    Value
A       @       76.76.21.21
CNAME   www     cname.vercel-dns.com
```

5. Esperar propagación (1-24 horas)

### SSL/HTTPS

- ✅ Vercel provee SSL automáticamente (Let's Encrypt)
- ✅ Railway también incluye SSL
- ✅ Render incluye SSL gratuito

**⚠️ Forzar HTTPS:**

```typescript
// server/index.ts
if (process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    if (req.header('x-forwarded-proto') !== 'https') {
      res.redirect(`https://${req.header('host')}${req.url}`);
    } else {
      next();
    }
  });
}
```

---

## 🔐 Variables de Entorno (Producción)

### Checklist

- [ ] `DATABASE_URL` - PostgreSQL connection string
- [ ] `SESSION_SECRET` - **Diferente** del de desarrollo
- [ ] `STRIPE_SECRET_KEY` - **Live key** (sk_live_...)
- [ ] `VITE_STRIPE_PUBLIC_KEY` - **Live key** (pk_live_...)
- [ ] `RESEND_API_KEY` - API key de producción
- [ ] `NODE_ENV=production`
- [ ] `FRONTEND_URL` - URL del frontend (para CORS)

### Generar SESSION_SECRET Seguro

```bash
# Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# OpenSSL
openssl rand -hex 32
```

---

## 📊 Monitoreo y Logs

### Logs en Replit

```bash
# Ver logs en tiempo real
# Ir a Shell y ejecutar:
tail -f /tmp/logs/*.log
```

### Logs en Railway

```bash
railway logs
```

### Logs en Render

Dashboard → Logs (actualizan en tiempo real)

---

## 🔄 Backups

### Base de Datos

**Automático (Neon):**
- ✅ Backups cada 24 horas
- ✅ Retención 7 días
- ✅ Point-in-time recovery

**Manual:**

```bash
# Backup completo
pg_dump $DATABASE_URL > backup-$(date +%Y%m%d).sql

# Restaurar
psql $DATABASE_URL < backup-20251109.sql
```

### Código

- ✅ Git commits regulares
- ✅ Tags para releases
- ✅ GitHub como respaldo

```bash
# Crear release tag
git tag -a v1.0.0 -m "Primera versión estable"
git push origin v1.0.0
```

---

## 🚨 Rollback

### Vercel

```bash
# Ver deployments
vercel ls

# Rollback a deployment anterior
vercel rollback [deployment-url]
```

### Railway

```bash
# Ver deployments
railway status

# Rollback en dashboard:
# Deployments → [anterior] → Redeploy
```

---

## ⚡ Optimizaciones de Producción

### 1. Caching

```typescript
// Cache de assets estáticos
app.use(express.static('dist/public', {
  maxAge: '1y',
  immutable: true,
}));
```

### 2. Compression

```bash
npm install compression
```

```typescript
import compression from 'compression';
app.use(compression());
```

### 3. Rate Limiting

```bash
npm install express-rate-limit
```

```typescript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 100, // max requests
});

app.use('/api/', limiter);
```

---

## 📈 Escalabilidad

### Horizontal Scaling

**Railway/Render:**
- Aumenta número de instancias en dashboard
- Load balancer automático

**Replit:**
- Plan Team/Pro para auto-scaling

### Database Scaling

**Neon:**
- Plan Scale para connection pooling
- Read replicas

---

## 🔍 Health Checks

### Endpoint de Status

```typescript
// server/routes.ts
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});
```

### Monitoreo Externo

- **UptimeRobot** - Ping cada 5 minutos
- **Better Uptime** - Notificaciones de downtime
- **Pingdom** - Monitoreo global

---

## 🎯 Checklist Pre-Deploy

### Código

- [ ] Tests pasan (`npm test`)
- [ ] Build exitoso (`npm run build`)
- [ ] No hay console.logs innecesarios
- [ ] Error handling completo
- [ ] Validación de datos robusta

### Seguridad

- [ ] Contraseñas hasheadas
- [ ] JWT en httpOnly cookies
- [ ] CORS configurado correctamente
- [ ] Rate limiting activado
- [ ] SQL injection prevenida (ORM)
- [ ] XSS prevenida (sanitización)

### Base de Datos

- [ ] Migraciones ejecutadas
- [ ] Índices creados
- [ ] Backup configurado
- [ ] Connection pooling activado

### Integraciones

- [ ] Stripe en modo LIVE
- [ ] Webhooks configurados
- [ ] Emails funcionando (Resend)
- [ ] Dominio verificado

### Performance

- [ ] Compression habilitado
- [ ] Assets minificados
- [ ] Images optimizadas
- [ ] Lazy loading implementado

---

## 📞 Soporte Post-Deploy

### Monitoreo

- **Errores**: Sentry, LogRocket
- **Performance**: New Relic, Datadog
- **Uptime**: UptimeRobot
- **Analytics**: Google Analytics, Plausible

### Notificaciones

```javascript
// Slack webhook para errores críticos
app.use((err, req, res, next) => {
  // Log a Slack
  fetch('https://hooks.slack.com/...', {
    method: 'POST',
    body: JSON.stringify({
      text: `❌ Error: ${err.message}`,
    }),
  });
  
  res.status(500).json({ error: 'Internal server error' });
});
```

---

## 🆘 Troubleshooting

Ver [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) para problemas comunes en producción.

---

¡Despliegue exitoso! 🎉
