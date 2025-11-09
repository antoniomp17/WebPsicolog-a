# 📖 Manual del Usuario - PsicoBienestar

Guía completa para estudiantes y usuarios de la plataforma PsicoBienestar.

---

## 📑 Tabla de Contenidos

- [Registro y Login](#registro-y-login)
- [Explorar Cursos](#explorar-cursos)
- [Inscribirse a un Curso](#inscribirse-a-un-curso)
- [Área de Estudiantes](#área-de-estudiantes)
- [Agendar Cita de Terapia](#agendar-cita-de-terapia)
- [Mi Cuenta](#mi-cuenta)
- [Preguntas Frecuentes](#preguntas-frecuentes)

---

## 🔐 Registro y Login

### Crear una Cuenta Nueva

1. **Accede a la página de registro**
   - Click en "Registrarse" en el menú superior
   - O navega a `/registro`

2. **Completa el formulario**
   - **Nombre completo**: Tu nombre real
   - **Email**: Dirección de correo válida
   - **Contraseña**: Mínimo 8 caracteres

3. **Confirma tu registro**
   - Click en "Registrarse"
   - Recibirás un email de bienvenida
   - Serás redirigido automáticamente a la plataforma

**✅ Consejos:**
- Usa un email que revises frecuentemente
- Crea una contraseña segura (combina letras, números y símbolos)
- Guarda tus credenciales en un lugar seguro

---

### Iniciar Sesión

1. **Accede al login**
   - Click en "Iniciar Sesión" en el menú
   - O navega a `/login`

2. **Ingresa tus credenciales**
   - Email registrado
   - Contraseña

3. **Accede a la plataforma**
   - Click en "Iniciar Sesión"
   - Verás tu nombre en el menú superior

**❌ ¿Olvidaste tu contraseña?**
- Contacta a soporte (función de recuperación en desarrollo)

---

## 📚 Explorar Cursos

### Ver el Catálogo

1. **Navega a la sección de cursos**
   - Click en "Cursos" en el menú
   - O accede a `/cursos`

2. **Explora los cursos disponibles**
   - Tarjetas con imagen, título y precio
   - Badge "Destacado" en cursos recomendados
   - Temas principales visibles

### Ver Detalles de un Curso

1. **Click en cualquier curso**
2. **Información disponible:**
   - Descripción completa
   - Precio
   - Duración estimada
   - Temas que cubre
   - Imagen ilustrativa

3. **Botón de inscripción**
   - "Inscribirse" si estás autenticado
   - "Iniciar sesión para inscribirse" si no lo estás

---

## 💳 Inscribirse a un Curso

### Proceso de Inscripción

1. **Selecciona un curso**
   - Desde el catálogo o detalle del curso
   - Click en "Inscribirse"

2. **Revisa el resumen**
   - Título del curso
   - Precio total
   - Términos y condiciones

3. **Procede al pago**
   - Click en "Proceder al Pago"
   - Serás redirigido a Stripe (plataforma segura de pagos)

4. **Completa el pago**
   - **Tarjeta de prueba (desarrollo):**
     - Número: `4242 4242 4242 4242`
     - Fecha: Cualquier fecha futura
     - CVC: Cualquier 3 dígitos
     - Código postal: Cualquiera
   
   - **Tarjeta real (producción):**
     - Ingresa datos de tu tarjeta bancaria
     - Stripe procesa el pago de forma segura

5. **Confirmación**
   - Recibirás email de confirmación
   - Acceso inmediato al curso en tu área de estudiantes

**🔒 Seguridad:**
- Usamos Stripe, procesador de pagos certificado PCI
- No almacenamos datos de tarjetas
- Todas las transacciones están encriptadas

---

## 🎓 Área de Estudiantes

### Acceder a tus Cursos

1. **Navega al área de estudiantes**
   - Click en "Acceso Alumnos" en el menú
   - O desde tu menú de usuario → "Mis Cursos"
   - URL directa: `/alumnos`

2. **Vista de cursos inscritos**
   - Solo cursos con pago completado
   - Imagen y título del curso
   - Botón "Acceder al Curso"

### Tomar un Curso

**Actualmente en desarrollo** - Funcionalidad MVP:

1. **Ver contenido del curso**
   - Módulos organizados
   - Lecciones secuenciales

2. **Seguir tu progreso**
   - Marca lecciones como completadas
   - Porcentaje de avance visible

3. **Descargar recursos**
   - PDFs
   - Material complementario
   - Ejercicios prácticos

### Obtener Certificado

**Próximamente:**
- Al completar 100% del curso
- Descarga automática en PDF
- Incluye nombre, curso y fecha
- Compartible en LinkedIn

---

## 📅 Agendar Cita de Terapia

### Proceso de Reserva

1. **Accede a la página de citas**
   - Click en "Agendar Cita" (botón dorado en menú)
   - O navega a `/agendar`

2. **Selecciona fecha y hora**
   - **Fecha**: Cualquier día futuro
   - **Hora**: Horarios disponibles (09:00 - 18:00)
   - Ejemplo: 15 de noviembre, 10:00

3. **Agrega notas (opcional)**
   - Describe brevemente tu consulta
   - Temas que quieres tratar
   - Primera sesión o seguimiento

4. **Confirma la cita**
   - Click en "Agendar Cita"
   - Debes estar autenticado
   - Recibirás confirmación inmediata

### Después de Agendar

1. **Confirmación del terapeuta**
   - Recibirás email cuando se confirme (24-48 horas)
   - Estado cambia de "Pendiente" a "Confirmada"

2. **Enlace de videollamada**
   - El terapeuta agregará link de Google Meet/Zoom
   - Lo recibirás por email
   - También visible en tu área de usuario

3. **El día de la sesión**
   - Conéctate 5 minutos antes
   - Ten listos tus apuntes
   - Ambiente tranquilo y privado

### Ver mis Citas

**Próximamente:**
- Lista de citas pasadas y futuras
- Estado de cada cita
- Botón para unirse a videollamada
- Opción de cancelar/reprogramar

---

## 👤 Mi Cuenta

### Menú de Usuario

Click en tu nombre (esquina superior derecha) para:

1. **Mis Cursos**
   - Acceso rápido al área de estudiantes
   - Ver todos tus cursos activos

2. **Cerrar Sesión**
   - Termina tu sesión de forma segura
   - Necesitarás login para volver a acceder

### Editar Perfil

**Próximamente:**
- Cambiar nombre
- Actualizar email
- Cambiar contraseña
- Agregar foto de perfil

---

## ❓ Preguntas Frecuentes

### ¿Puedo inscribirme en varios cursos?

Sí, no hay límite de inscripciones.

### ¿Los cursos tienen fecha de caducidad?

No, tienes acceso de por vida una vez pagado.

### ¿Puedo solicitar reembolso?

Contacta a soporte dentro de los primeros 7 días.

### ¿Las citas son individuales o grupales?

Todas las citas son sesiones individuales de terapia.

### ¿Cuánto dura una sesión de terapia?

Generalmente 50 minutos (confirmar con terapeuta).

### ¿Necesito cámara para las sesiones?

Recomendado pero no obligatorio. Audio es suficiente.

### ¿Puedo descargar los materiales de los cursos?

Sí, todos los PDFs y recursos son descargables.

### ¿Los cursos tienen certificado?

Sí, al completar 100% del contenido.

### ¿Hay soporte técnico?

Sí, contacta a soporte@psicobienestar.com

### ¿Mis datos están seguros?

Sí, usamos encriptación y cumplimos con GDPR.

---

## 🔔 Notificaciones por Email

Recibirás emails en estos casos:

1. **Bienvenida** - Al registrarte
2. **Confirmación de inscripción** - Al pagar un curso
3. **Cita confirmada** - Cuando terapeuta confirma
4. **Recordatorio de cita** - 24 horas antes (próximamente)
5. **Curso completado** - Al finalizar 100%

**Revisa tu carpeta de spam** si no recibes emails.

---

## 📱 Uso en Móvil

La plataforma es completamente responsive:
- ✅ Funciona en smartphones y tablets
- ✅ Navegación adaptada a pantalla táctil
- ✅ Videos optimizados para móvil
- ✅ Pagos seguros desde cualquier dispositivo

---

## 🎯 Primeros Pasos Recomendados

### Para nuevos usuarios:

1. **Explora el catálogo** de cursos
2. **Lee las descripciones** completas
3. **Empieza con un curso** de tu interés
4. **Agenda una cita** si necesitas apoyo personalizado
5. **Completa al menos** una lección cada semana

### Maximiza tu experiencia:

- 📅 Establece horarios fijos de estudio
- 📝 Toma notas mientras aprendes
- 🔄 Repasa conceptos regularmente
- 💬 Combina cursos con sesiones de terapia
- 🎯 Define metas claras de aprendizaje

---

## 🆘 Soporte

### Problemas técnicos:
- Email: soporte@psicobienestar.com
- Consulta [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)

### Consultas sobre cursos:
- Usa el formulario de contacto
- Respuesta en 24-48 horas

### Emergencias psicológicas:
- Esta plataforma NO es para crisis
- Llama al 024 (Línea de Atención a la Conducta Suicida)
- O al 112 en caso de emergencia

---

## 🌟 ¡Disfruta tu aprendizaje!

Gracias por confiar en PsicoBienestar para tu bienestar emocional. Estamos aquí para apoyarte en cada paso de tu camino hacia una mejor salud mental.
