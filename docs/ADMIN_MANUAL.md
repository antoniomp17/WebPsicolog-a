# 🛡️ Manual del Administrador - PsicoBienestar

Guía completa para administrar la plataforma PsicoBienestar.

---

## 📑 Tabla de Contenidos

- [Acceso al Panel](#acceso-al-panel)
- [Dashboard Principal](#dashboard-principal)
- [Gestión de Usuarios](#gestión-de-usuarios)
- [Gestión de Cursos](#gestión-de-cursos)
- [Gestión de Citas](#gestión-de-citas)
- [Gestión de Inscripciones](#gestión-de-inscripciones)
- [Mejores Prácticas](#mejores-prácticas)

---

## 🔐 Acceso al Panel

### Credenciales de Administrador

Para acceder al panel de administración necesitas:
1. **Cuenta con rol de Admin**: Tu usuario debe tener `role: "admin"`
2. **Credenciales válidas**: Email y contraseña

### Cómo Iniciar Sesión

1. Navega a `/login`
2. Ingresa tu email de administrador
3. Ingresa tu contraseña
4. Click en "Iniciar Sesión"
5. En el menú de usuario (esquina superior derecha), verás la opción **"Panel Admin"**

**URL directa del panel:**
```
/admin
```

---

## 📊 Dashboard Principal

### Acceso
- URL: `/admin`
- Requiere: Autenticación + rol admin

### Estadísticas Disponibles

El dashboard muestra 6 métricas clave:

#### 1. Total Usuarios
- **Qué muestra:** Número total de usuarios registrados en la plataforma
- **Incluye:** Estudiantes, terapeutas y administradores
- **Útil para:** Seguimiento de crecimiento de la plataforma

#### 2. Cursos Publicados
- **Formato:** `X/Y` (publicados/total)
- **Qué muestra:** Cursos visibles públicamente vs. total de cursos creados
- **Útil para:** Control de contenido disponible

#### 3. Citas Esta Semana
- **Qué muestra:** Citas agendadas para los próximos 7 días
- **Incluye:** Todas las citas pendientes, confirmadas
- **Útil para:** Planificación de carga de trabajo

#### 4. Ingresos Totales
- **Formato:** €XXX
- **Qué muestra:** Suma de todos los pagos completados
- **Fuente:** Inscripciones con `paymentStatus: "paid"`
- **Útil para:** Análisis financiero

#### 5. Total Citas
- **Qué muestra:** Todas las citas históricas
- **Incluye:** Pendientes, confirmadas, completadas y canceladas
- **Útil para:** Volumen de servicio de terapia

#### 6. Inscripciones Completadas
- **Formato:** `X/Y` (completadas/total)
- **Qué muestra:** Cursos finalizados vs. inscripciones activas
- **Útil para:** Tasa de finalización de cursos

### Acciones Rápidas

Desde el dashboard puedes acceder rápidamente a:
- **Gestionar Usuarios** → `/admin/users`
- **Gestionar Cursos** → (próximamente)
- **Gestionar Citas** → (próximamente)
- **Ver Pagos** → (próximamente)

### Resumen del Sistema

Dos barras de progreso visuales:
1. **% Cursos Publicados**: Muestra qué porcentaje de cursos están activos
2. **% Inscripciones Completadas**: Muestra tasa de éxito de estudiantes

---

## 👥 Gestión de Usuarios

### Acceso
- URL: `/admin/users`
- Desde dashboard: Click en "Gestionar Usuarios"

### Vista de Usuarios

Cada tarjeta de usuario muestra:
- **Nombre completo**
- **Email**
- **Rol actual** (badge de color)
- **Fecha de registro**
- **Acciones disponibles**

### Cambiar Rol de Usuario

Los roles disponibles son:
- **Estudiante** (student): Acceso a cursos y citas
- **Terapeuta** (therapist): Futuras funciones terapéuticas
- **Administrador** (admin): Acceso total al panel

**Cómo cambiar el rol:**
1. Localiza el usuario en la lista
2. Usa el selector desplegable junto a su nombre
3. Selecciona el nuevo rol
4. El cambio se aplica inmediatamente
5. Verás una notificación de confirmación

**⚠️ Importante:**
- No puedes cambiar tu propio rol
- Los administradores tienen acceso completo a todo

### Eliminar Usuario

**Cómo eliminar:**
1. Localiza el usuario
2. Click en el ícono de papelera (rojo)
3. Confirma la acción en el diálogo
4. El usuario se elimina permanentemente

**⚠️ Advertencias:**
- No puedes eliminarte a ti mismo
- La acción es irreversible
- Se eliminan todas las inscripciones y citas asociadas (cascade delete)

### Filtrar y Buscar

**Actualmente no disponible** - Planeado para v2.0:
- Búsqueda por nombre o email
- Filtro por rol
- Ordenar por fecha de registro

---

## 📚 Gestión de Cursos

**Estado:** API implementada, UI simplificado para MVP

### Funcionalidades Disponibles (vía API)

#### Listar Todos los Cursos
```http
GET /api/admin/courses
```

#### Publicar/Despublicar Curso
```http
PATCH /api/admin/courses/:id/publish
Body: { "isPublished": true }
```

**Efectos de publicar:**
- ✅ Visible en catálogo público `/cursos`
- ✅ Disponible para inscripción
- ✅ Aparece en búsquedas

**Efectos de despublicar:**
- ❌ Oculto del catálogo público
- ❌ No disponible para nuevas inscripciones
- ✅ Estudiantes inscritos mantienen acceso

#### Destacar Curso
```http
PATCH /api/admin/courses/:id/feature
Body: { "isFeatured": true }
```

**Efectos:**
- ⭐ Aparece en sección "Cursos Destacados" en home
- 📍 Badge especial en catálogo
- 🔝 Prioridad en ordenamiento

### Crear Curso Nuevo

**Actualmente:** Los cursos se gestionan directamente en la base de datos

**Campos necesarios:**
```sql
id: UUID
title: string (ej: "Gestión de la Ansiedad")
description: string (texto largo)
price: decimal (ej: 49.99)
duration: string (ej: "4 semanas")
topics: array (ej: ["Mindfulness", "CBT"])
image: URL de imagen
isPublished: boolean (false por defecto)
isFeatured: boolean (false por defecto)
```

**Roadmap UI (v2.0):**
- Formulario completo de creación
- Editor WYSIWYG para descripción
- Upload de imágenes
- Gestión de módulos y lecciones

---

## 📅 Gestión de Citas

**Estado:** API implementada, UI simplificado para MVP

### Funcionalidades Disponibles (vía API)

#### Listar Todas las Citas
```http
GET /api/admin/appointments
```

**Respuesta incluye:**
- Datos de la cita
- Información del usuario (nombre, email)
- Estado actual
- Enlace de video (si existe)

#### Cambiar Estado de Cita
```http
PATCH /api/admin/appointments/:id/status
Body: { "status": "confirmed" }
```

**Estados disponibles:**
1. **pending** → Recién creada por usuario
2. **confirmed** → Admin confirmó disponibilidad
3. **completed** → Sesión realizada
4. **cancelled** → Cancelada por admin o usuario

**Flujo recomendado:**
```
Usuario crea cita (pending)
    ↓
Admin revisa y confirma (confirmed)
    ↓
Admin agrega enlace de video
    ↓
Usuario recibe email con link
    ↓
Después de la sesión → Admin marca como completada (completed)
```

#### Agregar Enlace de Video
```http
PATCH /api/admin/appointments/:id/video-link
Body: { "videoLink": "https://meet.google.com/xxx-yyyy-zzz" }
```

**Herramientas compatibles:**
- Google Meet
- Zoom
- Microsoft Teams
- Cualquier URL de videollamada

**Cuándo agregar:**
- Después de confirmar la cita
- Antes de la fecha de la sesión
- Se notifica automáticamente al usuario

### Roadmap UI (v2.0)

- Vista de calendario visual
- Filtros por estado y fecha
- Generación automática de links de video
- Recordatorios automáticos

---

## 💳 Gestión de Inscripciones

**Estado:** API implementada, UI simplificado para MVP

### Funcionalidades Disponibles (vía API)

#### Listar Todas las Inscripciones
```http
GET /api/admin/enrollments
```

**Datos mostrados:**
- Usuario inscrito (nombre, email)
- Curso
- Estado de la inscripción
- Estado del pago
- Monto pagado
- Fecha de inscripción

### Estados de Inscripción

#### Status de Inscripción
- **pending** → Recién creada, esperando pago
- **active** → Pagada y activa
- **completed** → Curso finalizado

#### Status de Pago
- **pending** → Pago no completado
- **paid** → Pago exitoso (vía Stripe)
- **failed** → Pago rechazado

### Flujo de Inscripción

```
Usuario se inscribe a curso
    ↓
Se crea enrollment (status: pending, payment: pending)
    ↓
Usuario completa pago en Stripe
    ↓
Webhook actualiza (status: active, payment: paid)
    ↓
Usuario accede a contenido en /alumnos
    ↓
Al completar 100% → status: completed
```

### Roadmap UI (v2.0)

- Filtros por estado y curso
- Exportar a CSV/Excel
- Reembolsos manuales
- Estadísticas por curso

---

## ✅ Mejores Prácticas

### Seguridad

1. **Nunca compartas credenciales de admin**
2. **Usa contraseñas fuertes** (mínimo 8 caracteres, mayúsculas, números)
3. **Cierra sesión** al terminar
4. **Revisa logs regularmente** para detectar actividad sospechosa

### Gestión de Usuarios

1. **Verifica identidad** antes de cambiar roles a admin
2. **No elimines usuarios** con inscripciones activas sin revisar
3. **Mantén comunicación** con usuarios antes de acciones drásticas

### Gestión de Cursos

1. **Prueba cursos** antes de publicarlos
2. **Revisa contenido** completo (ortografía, enlaces)
3. **Actualiza descripciones** regularmente
4. **Destaca solo** 3-4 cursos principales

### Gestión de Citas

1. **Confirma citas** dentro de 24 horas
2. **Agrega video links** con anticipación
3. **Marca como completadas** después de cada sesión
4. **Cancela con aviso** si hay problemas

### Comunicación

1. **Responde rápido** a consultas de usuarios
2. **Documenta cambios** importantes
3. **Notifica** mantenimientos programados

---

## 🆘 Solución de Problemas

### No puedo acceder al panel

**Solución:**
1. Verifica que tu usuario tenga `role: "admin"`
2. Confirma que estás autenticado (login exitoso)
3. Revisa la URL: `/admin`
4. Limpia cookies y vuelve a iniciar sesión

### No aparece opción "Panel Admin"

**Causa:** Tu usuario no tiene rol de admin

**Solución:**
1. Contacta a otro administrador para que cambie tu rol
2. O accede directamente a la base de datos:
```sql
UPDATE users SET role = 'admin' WHERE email = 'tu@email.com';
```

### Error al cambiar rol

**Causa:** Intentas cambiar tu propio rol

**Solución:** Pide a otro admin que haga el cambio

### Error al eliminar usuario

**Causa:** Intentas eliminarte a ti mismo

**Solución:** Solo otros admins pueden eliminarte

---

## 📞 Soporte Técnico

Para problemas técnicos:
- Consulta [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
- Revisa [API.md](./API.md) para endpoints disponibles
- Contacta al equipo de desarrollo

---

## 🔄 Actualizaciones Futuras

### v2.0 Planeado
- ✨ UI completa de gestión de cursos
- ✨ UI completa de gestión de citas
- ✨ Panel de analíticas avanzado
- ✨ Exportación de reportes
- ✨ Notificaciones en tiempo real
- ✨ Logs de auditoría
