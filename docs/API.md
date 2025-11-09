# 📚 Documentación de API - PsicoBienestar

Documentación completa de todos los endpoints de la API REST de PsicoBienestar.

## Base URL
```
Desarrollo: http://localhost:5000/api
Producción: https://[tu-dominio].replit.app/api
```

## Autenticación

La API utiliza JWT (JSON Web Tokens) almacenados en cookies httpOnly para autenticación segura.

**Headers requeridos para rutas protegidas:**
```http
Cookie: token=[JWT_TOKEN]
```

---

## 📑 Tabla de Contenidos

- [Autenticación](#autenticación-endpoints)
- [Cursos](#cursos)
- [Inscripciones](#inscripciones)
- [Citas](#citas)
- [Pagos](#pagos)
- [Área del Estudiante](#área-del-estudiante)
- [Panel de Administración](#panel-de-administración)

---

## 🔐 Autenticación Endpoints

### Registro de Usuario

Crea una nueva cuenta de usuario.

**Endpoint:** `POST /api/auth/register`

**Body:**
```json
{
  "email": "usuario@example.com",
  "password": "Password123!",
  "fullName": "Juan Pérez"
}
```

**Respuesta exitosa (201):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "usuario@example.com",
  "fullName": "Juan Pérez",
  "role": "student",
  "createdAt": "2025-11-09T10:30:00.000Z"
}
```

**Errores:**
- `400` - Datos inválidos (email ya registrado, contraseña débil)
- `500` - Error del servidor

---

### Iniciar Sesión

Autentica un usuario y establece cookie con JWT.

**Endpoint:** `POST /api/auth/login`

**Body:**
```json
{
  "email": "usuario@example.com",
  "password": "Password123!"
}
```

**Respuesta exitosa (200):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "usuario@example.com",
  "fullName": "Juan Pérez",
  "role": "student"
}
```

**Headers de respuesta:**
```http
Set-Cookie: token=[JWT_TOKEN]; HttpOnly; Secure; SameSite=Strict
```

**Errores:**
- `401` - Credenciales inválidas
- `500` - Error del servidor

---

### Obtener Usuario Actual

Obtiene información del usuario autenticado.

**Endpoint:** `GET /api/auth/me`

**Headers:**
```http
Cookie: token=[JWT_TOKEN]
```

**Respuesta exitosa (200):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "usuario@example.com",
  "fullName": "Juan Pérez",
  "role": "student"
}
```

**Errores:**
- `401` - No autenticado

---

### Cerrar Sesión

Invalida la sesión del usuario.

**Endpoint:** `POST /api/auth/logout`

**Headers:**
```http
Cookie: token=[JWT_TOKEN]
```

**Respuesta exitosa (200):**
```json
{
  "message": "Logout successful"
}
```

---

## 📚 Cursos

### Listar Todos los Cursos

Obtiene todos los cursos publicados.

**Endpoint:** `GET /api/courses`

**Respuesta exitosa (200):**
```json
[
  {
    "id": "c1",
    "title": "Gestión de la Ansiedad",
    "description": "Aprende técnicas efectivas...",
    "price": 49.99,
    "duration": "4 semanas",
    "topics": ["Mindfulness", "Respiración", "CBT"],
    "image": "https://images.unsplash.com/...",
    "isPublished": true,
    "isFeatured": true,
    "createdAt": "2025-01-01T00:00:00.000Z"
  }
]
```

---

### Obtener Curso por ID

Obtiene detalles completos de un curso específico.

**Endpoint:** `GET /api/courses/:id`

**Parámetros:**
- `id` - ID del curso

**Respuesta exitosa (200):**
```json
{
  "id": "c1",
  "title": "Gestión de la Ansiedad",
  "description": "Aprende técnicas efectivas para manejar la ansiedad...",
  "price": 49.99,
  "duration": "4 semanas",
  "topics": ["Mindfulness", "Respiración", "CBT"],
  "image": "https://images.unsplash.com/...",
  "isPublished": true,
  "isFeatured": true,
  "createdAt": "2025-01-01T00:00:00.000Z"
}
```

**Errores:**
- `404` - Curso no encontrado

---

## 📝 Inscripciones

### Crear Inscripción

Crea una nueva inscripción a un curso (requiere autenticación).

**Endpoint:** `POST /api/enrollments`

**Headers:**
```http
Cookie: token=[JWT_TOKEN]
```

**Body:**
```json
{
  "courseId": "c1"
}
```

**Respuesta exitosa (201):**
```json
{
  "id": "e1",
  "userId": "550e8400-e29b-41d4-a716-446655440000",
  "courseId": "c1",
  "status": "pending",
  "paymentStatus": "pending",
  "amount": 49.99,
  "createdAt": "2025-11-09T10:30:00.000Z"
}
```

**Errores:**
- `400` - Ya inscrito en el curso
- `401` - No autenticado
- `404` - Curso no encontrado

---

### Obtener Inscripciones del Usuario

Lista todas las inscripciones del usuario autenticado.

**Endpoint:** `GET /api/enrollments/user`

**Headers:**
```http
Cookie: token=[JWT_TOKEN]
```

**Respuesta exitosa (200):**
```json
[
  {
    "id": "e1",
    "userId": "550e8400-e29b-41d4-a716-446655440000",
    "courseId": "c1",
    "status": "active",
    "paymentStatus": "paid",
    "amount": 49.99,
    "createdAt": "2025-11-09T10:30:00.000Z",
    "course": {
      "id": "c1",
      "title": "Gestión de la Ansiedad",
      "image": "https://images.unsplash.com/..."
    }
  }
]
```

**Errores:**
- `401` - No autenticado

---

## 📅 Citas

### Crear Cita

Agenda una nueva cita de terapia (requiere autenticación).

**Endpoint:** `POST /api/appointments`

**Headers:**
```http
Cookie: token=[JWT_TOKEN]
```

**Body:**
```json
{
  "appointmentDate": "2025-11-15",
  "appointmentTime": "10:00",
  "notes": "Primera consulta sobre ansiedad"
}
```

**Respuesta exitosa (201):**
```json
{
  "id": "a1",
  "userId": "550e8400-e29b-41d4-a716-446655440000",
  "appointmentDate": "2025-11-15",
  "appointmentTime": "10:00",
  "status": "pending",
  "notes": "Primera consulta sobre ansiedad",
  "videoLink": null,
  "createdAt": "2025-11-09T10:30:00.000Z"
}
```

**Errores:**
- `400` - Datos inválidos (fecha pasada, hora ocupada)
- `401` - No autenticado

---

### Obtener Citas del Usuario

Lista todas las citas del usuario autenticado.

**Endpoint:** `GET /api/appointments`

**Headers:**
```http
Cookie: token=[JWT_TOKEN]
```

**Respuesta exitosa (200):**
```json
[
  {
    "id": "a1",
    "userId": "550e8400-e29b-41d4-a716-446655440000",
    "appointmentDate": "2025-11-15",
    "appointmentTime": "10:00",
    "status": "confirmed",
    "notes": "Primera consulta sobre ansiedad",
    "videoLink": "https://meet.google.com/abc-defg-hij",
    "createdAt": "2025-11-09T10:30:00.000Z"
  }
]
```

**Errores:**
- `401` - No autenticado

---

## 💳 Pagos

### Crear Sesión de Checkout

Crea una sesión de pago con Stripe para una inscripción.

**Endpoint:** `POST /api/create-checkout-session`

**Headers:**
```http
Cookie: token=[JWT_TOKEN]
Content-Type: application/json
```

**Body:**
```json
{
  "enrollmentId": "e1"
}
```

**Respuesta exitosa (200):**
```json
{
  "sessionId": "cs_test_a1b2c3d4e5f6...",
  "url": "https://checkout.stripe.com/pay/cs_test_..."
}
```

**Errores:**
- `400` - Inscripción no válida o ya pagada
- `401` - No autenticado
- `404` - Inscripción no encontrada

---

### Webhook de Stripe

Recibe notificaciones de pago de Stripe (uso interno).

**Endpoint:** `POST /api/webhook/stripe`

**Headers:**
```http
Stripe-Signature: [signature]
```

**Body:** Raw Stripe event

**Respuesta exitosa (200):**
```json
{
  "received": true
}
```

---

## 🎓 Área del Estudiante

### Obtener Mis Cursos

Lista cursos en los que el usuario está inscrito con estado "active".

**Endpoint:** `GET /api/student/courses`

**Headers:**
```http
Cookie: token=[JWT_TOKEN]
```

**Respuesta exitosa (200):**
```json
[
  {
    "enrollment": {
      "id": "e1",
      "status": "active",
      "paymentStatus": "paid",
      "createdAt": "2025-11-09T10:30:00.000Z"
    },
    "course": {
      "id": "c1",
      "title": "Gestión de la Ansiedad",
      "description": "Aprende técnicas efectivas...",
      "image": "https://images.unsplash.com/...",
      "duration": "4 semanas",
      "topics": ["Mindfulness", "Respiración", "CBT"]
    }
  }
]
```

**Errores:**
- `401` - No autenticado

---

## 🛡️ Panel de Administración

**Nota:** Todos los endpoints de administración requieren autenticación y rol de `admin`.

### Obtener Estadísticas del Dashboard

Obtiene métricas generales de la plataforma.

**Endpoint:** `GET /api/admin/dashboard`

**Headers:**
```http
Cookie: token=[JWT_TOKEN]
```

**Respuesta exitosa (200):**
```json
{
  "totalUsers": 150,
  "totalCourses": 8,
  "publishedCourses": 6,
  "totalAppointments": 45,
  "appointmentsThisWeek": 12,
  "totalEnrollments": 89,
  "completedEnrollments": 23,
  "totalRevenue": "4450.00"
}
```

**Errores:**
- `401` - No autenticado
- `403` - No autorizado (no es admin)

---

### Listar Todos los Usuarios

**Endpoint:** `GET /api/admin/users`

**Headers:**
```http
Cookie: token=[JWT_TOKEN]
```

**Respuesta exitosa (200):**
```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "usuario@example.com",
    "fullName": "Juan Pérez",
    "role": "student",
    "createdAt": "2025-11-09T10:30:00.000Z"
  }
]
```

**Errores:**
- `401` - No autenticado
- `403` - No autorizado

---

### Cambiar Rol de Usuario

**Endpoint:** `PATCH /api/admin/users/:id/role`

**Headers:**
```http
Cookie: token=[JWT_TOKEN]
Content-Type: application/json
```

**Body:**
```json
{
  "role": "admin"
}
```

**Respuesta exitosa (200):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "usuario@example.com",
  "fullName": "Juan Pérez",
  "role": "admin"
}
```

**Errores:**
- `400` - Rol inválido
- `401` - No autenticado
- `403` - No autorizado
- `404` - Usuario no encontrado

---

### Eliminar Usuario

**Endpoint:** `DELETE /api/admin/users/:id`

**Headers:**
```http
Cookie: token=[JWT_TOKEN]
```

**Respuesta exitosa (200):**
```json
{
  "message": "Usuario eliminado exitosamente"
}
```

**Errores:**
- `400` - No puedes eliminarte a ti mismo
- `401` - No autenticado
- `403` - No autorizado
- `404` - Usuario no encontrado

---

### Listar Todos los Cursos (Admin)

**Endpoint:** `GET /api/admin/courses`

**Headers:**
```http
Cookie: token=[JWT_TOKEN]
```

**Respuesta exitosa (200):**
```json
[
  {
    "id": "c1",
    "title": "Gestión de la Ansiedad",
    "price": 49.99,
    "isPublished": true,
    "isFeatured": true,
    "createdAt": "2025-01-01T00:00:00.000Z"
  }
]
```

---

### Publicar/Despublicar Curso

**Endpoint:** `PATCH /api/admin/courses/:id/publish`

**Headers:**
```http
Cookie: token=[JWT_TOKEN]
Content-Type: application/json
```

**Body:**
```json
{
  "isPublished": true
}
```

**Respuesta exitosa (200):**
```json
{
  "id": "c1",
  "title": "Gestión de la Ansiedad",
  "isPublished": true
}
```

---

### Destacar Curso

**Endpoint:** `PATCH /api/admin/courses/:id/feature`

**Headers:**
```http
Cookie: token=[JWT_TOKEN]
Content-Type: application/json
```

**Body:**
```json
{
  "isFeatured": true
}
```

**Respuesta exitosa (200):**
```json
{
  "id": "c1",
  "title": "Gestión de la Ansiedad",
  "isFeatured": true
}
```

---

### Listar Todas las Citas (Admin)

**Endpoint:** `GET /api/admin/appointments`

**Headers:**
```http
Cookie: token=[JWT_TOKEN]
```

**Respuesta exitosa (200):**
```json
[
  {
    "id": "a1",
    "userId": "550e8400-e29b-41d4-a716-446655440000",
    "appointmentDate": "2025-11-15",
    "appointmentTime": "10:00",
    "status": "pending",
    "notes": "Primera consulta",
    "videoLink": null,
    "user": {
      "fullName": "Juan Pérez",
      "email": "usuario@example.com"
    }
  }
]
```

---

### Actualizar Estado de Cita

**Endpoint:** `PATCH /api/admin/appointments/:id/status`

**Headers:**
```http
Cookie: token=[JWT_TOKEN]
Content-Type: application/json
```

**Body:**
```json
{
  "status": "confirmed"
}
```

**Valores válidos:** `pending`, `confirmed`, `completed`, `cancelled`

**Respuesta exitosa (200):**
```json
{
  "id": "a1",
  "status": "confirmed"
}
```

---

### Agregar Enlace de Video a Cita

**Endpoint:** `PATCH /api/admin/appointments/:id/video-link`

**Headers:**
```http
Cookie: token=[JWT_TOKEN]
Content-Type: application/json
```

**Body:**
```json
{
  "videoLink": "https://meet.google.com/abc-defg-hij"
}
```

**Respuesta exitosa (200):**
```json
{
  "id": "a1",
  "videoLink": "https://meet.google.com/abc-defg-hij"
}
```

---

### Listar Todas las Inscripciones (Admin)

**Endpoint:** `GET /api/admin/enrollments`

**Headers:**
```http
Cookie: token=[JWT_TOKEN]
```

**Respuesta exitosa (200):**
```json
[
  {
    "id": "e1",
    "userId": "550e8400-e29b-41d4-a716-446655440000",
    "courseId": "c1",
    "status": "active",
    "paymentStatus": "paid",
    "amount": 49.99,
    "user": {
      "fullName": "Juan Pérez",
      "email": "usuario@example.com"
    },
    "course": {
      "title": "Gestión de la Ansiedad"
    }
  }
]
```

---

## 📊 Códigos de Estado HTTP

| Código | Significado |
|--------|-------------|
| 200 | Operación exitosa |
| 201 | Recurso creado exitosamente |
| 400 | Solicitud inválida (datos incorrectos) |
| 401 | No autenticado (falta token o inválido) |
| 403 | No autorizado (sin permisos suficientes) |
| 404 | Recurso no encontrado |
| 500 | Error interno del servidor |

---

## 🔒 Seguridad

- Todas las contraseñas se hashean con bcrypt (10 rounds)
- JWT tokens almacenados en cookies httpOnly
- Cookies con flags: `Secure`, `SameSite=Strict`
- CORS configurado para dominio específico
- Validación de datos con Zod en todos los endpoints
- Rate limiting en endpoints sensibles (próxima implementación)

---

## 📝 Notas Adicionales

1. **Paginación:** Actualmente no implementada. Planeada para v2.0
2. **Filtros:** Los endpoints de listado soportarán filtros en futuras versiones
3. **Caché:** Redis para caché de cursos (roadmap)
4. **WebSockets:** Notificaciones en tiempo real (roadmap)

---

## 🆘 Soporte

Para reportar problemas con la API, consulta [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
