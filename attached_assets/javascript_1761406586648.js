// === Importaciones de Firebase (desde la ventana global) ===
const {
    initializeApp,
    getAuth,
    signInAnonymously,
    signInWithCustomToken,
    onAuthStateChanged,
    setLogLevel,
    getFirestore,
    doc,
    setDoc,
    addDoc,
    collection,
    onSnapshot
} = window.firebase;


// === Helpers ===
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

// === Estado Global de la Aplicación ===
let db, auth, userId, appId;
let currentView = 'home';
let userProfile = null;
const allAppointments = new Map();

// Calendario
let selectedDate = '';
let selectedTime = '';
let selectedDateEl = null;
let currentDate = new Date();
let currentMonth = currentDate.getMonth();
let currentYear = currentDate.getFullYear();
const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];


// === Inicialización de Firebase ===
async function initFirebase() {
    try {
        // Configuración de Firebase (inyectada por el entorno)
        const firebaseConfig = JSON.parse(__firebase_config);
        appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';

        // Inicializar Firebase
        const app = initializeApp(firebaseConfig);
        db = getFirestore(app);
        auth = getAuth(app);
        
        // Habilitar logs para depuración
        setLogLevel('Debug');
        console.log("Firebase inicializado. App ID:", appId);

        // Manejar estado de autenticación
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                // Usuario está logueado
                userId = user.uid;
                console.log("Usuario autenticado. UserID:", userId);
                
                // Iniciar la lógica de la aplicación
                initializeAppLogic();
                
                // Cargar datos del usuario
                setupFirestoreListeners();

            } else {
                // Usuario no logueado, intentar login anónimo o con token
                console.log("Sin usuario. Intentando login...");
                try {
                    if (typeof __initial_auth_token !== 'undefined') {
                        await signInWithCustomToken(auth, __initial_auth_token);
                    } else {
                        await signInAnonymously(auth);
                    }
                } catch (error) {
                    console.error("Error en el login:", error);
                }
            }
        });

    } catch (error) {
        console.error("Error fatal al inicializar Firebase:", error);
    }
}

// === Lógica de la Aplicación (se ejecuta después de auth) ===
function initializeAppLogic() {
    // Iconos
    feather.replace();
    
    // === Gestión de Vistas (SPA) ===
    const navLinks = $$('.nav-link');
    const mobileNavLinks = $$('.mobile-nav-link');
    const mobileMenu = $('#mobile-menu');
    const mobileMenuButton = $('#mobile-menu-button');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const viewId = link.dataset.view;
            if (viewId) {
                showView(viewId);
            }
        });
    });

    // === Menú Móvil ===
    mobileMenuButton.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const viewId = link.dataset.view;
            if (viewId) {
                showView(viewId);
                mobileMenu.classList.add('hidden');
            }
        });
    });
    
    // === Lógica de Cursos y Pago (Simulación) ===
    const paymentModal = $('#payment-modal');
    const closePaymentModalBtn = $('#close-payment-modal');
    const enrollButtons = $$('.enroll-button');
    const paymentForm = $('#payment-form');
    const paymentSuccess = $('#payment-success');

    enrollButtons.forEach(button => {
        button.addEventListener('click', () => {
            const card = button.closest('.course-card');
            const title = card.querySelector('[data-course-title]').dataset.courseTitle;
            const price = card.querySelector('[data-course-price]').dataset.coursePrice;
            
            $('#modal-course-title').textContent = title;
            $('#modal-course-price').textContent = `€${price}`;
            paymentModal.classList.remove('hidden');
            paymentSuccess.classList.add('hidden');
            paymentForm.classList.remove('hidden');
            paymentForm.reset();
        });
    });

    closePaymentModalBtn.addEventListener('click', () => {
        paymentModal.classList.add('hidden');
    });

    paymentForm.addEventListener('submit', (e) => {
        e.preventDefault();
        // Simulación de pago
        paymentForm.classList.add('hidden');
        paymentSuccess.classList.remove('hidden');
        
        setTimeout(() => {
            paymentModal.classList.add('hidden');
        }, 3000);
    });

    // === Lógica del Blog (Artículos) ===
    const articleModal = $('#article-modal');
    const closeArticleModalBtn = $('#close-article-modal');

    $$('.read-more-btn').forEach(button => {
        button.addEventListener('click', () => {
            const snippet = button.closest('.article-snippet');
            const title = snippet.querySelector('.article-title').textContent;
            const content = snippet.querySelector('.article-full-content').innerHTML;

            $('#article-modal-title').textContent = title;
            $('#article-modal-content').innerHTML = content;
            articleModal.classList.remove('hidden');
        });
    });

    closeArticleModalBtn.addEventListener('click', () => {
        articleModal.classList.add('hidden');
    });

    // === Lógica de Acceso Alumnos (Conectado a Firebase) ===
    const registerForm = $('#student-register-form');
    
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = $('#email').value;
        const name = $('#name').value;
        
        const profileData = {
            name: name,
            email: email,
            registeredAt: new Date()
        };

        try {
            // El path de Firestore debe ser /artifacts/{appId}/users/{userId}/...
            const profileDocRef = doc(db, 'artifacts', appId, 'users', userId, 'profile');
            await setDoc(profileDocRef, profileData);
            console.log("Perfil de alumno creado/actualizado.");
            // El listener onSnapshot se encargará de actualizar la UI
        } catch (error) {
            console.error("Error al guardar el perfil:", error);
        }
    });

    // === Lógica de Agenda de Citas (Conectado a Firebase) ===
    const calendarGrid = $('#calendar-grid');
    const prevMonthBtn = $('#prev-month-btn');
    const nextMonthBtn = $('#next-month-btn');
    const bookingConfirmForm = $('#booking-confirm-form');

    // Event listener para los días (usando delegación)
    calendarGrid.addEventListener('click', (e) => {
        const target = e.target.closest('.booking-day'); // Asegurarse de clickar el botón
        
        // Si no es un 'booking-day', no hacer nada
        if (!target) return;

        // Resetear estilos del día previamente seleccionado
        if (selectedDateEl) {
            selectedDateEl.classList.remove('selected');
        }
        
        // Marcar día seleccionado
        target.classList.add('selected');
        selectedDateEl = target;

        selectedDate = target.dataset.date;
        
        // Mostrar paso 2 y actualizar disponibilidad de horas
        $('#selected-date').textContent = selectedDate;
        $('#booking-step-2').classList.remove('hidden');
        $('#booking-step-3').classList.add('hidden');
        $('#booking-success').classList.add('hidden');

        updateAvailableTimes(selectedDate);
    });

    prevMonthBtn.addEventListener('click', () => {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        renderCalendar(currentMonth, currentYear);
    });

    nextMonthBtn.addEventListener('click', () => {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        renderCalendar(currentMonth, currentYear);
    });
    
    // Lógica para seleccionar hora (usando delegación)
    $('#booking-step-2').addEventListener('click', (e) => {
        const target = e.target.closest('.time-slot-btn');
        if (!target || target.disabled) return;

        // Resetear estilos
        $$('.time-slot-btn').forEach(s => s.classList.remove('selected'));
        // Marcar hora seleccionada
        target.classList.add('selected');
        selectedTime = target.dataset.time;

        // Mostrar paso 3
        $('#confirm-date').textContent = selectedDate;
        $('#confirm-time').textContent = selectedTime;
        $('#booking-step-3').classList.remove('hidden');
        $('#booking-success').classList.add('hidden');
    });

    // Lógica para confirmar reserva (Guardar en Firebase)
    bookingConfirmForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const bookName = $('#book-name').value;
        const bookEmail = $('#book-email').value;

        const bookingData = {
            name: bookName,
            email: bookEmail,
            date: selectedDate,
            time: selectedTime,
            userId: userId, // Asociar la cita al usuario
            createdAt: new Date()
        };

        try {
            // Guardar en la subcolección de citas del usuario
            const userAppointmentsCol = collection(db, 'artifacts', appId, 'users', userId, 'appointments');
            await addDoc(userAppointmentsCol, bookingData);
            
            console.log("Cita guardada en Firestore.");

            // Éxito
            $('#booking-step-2').classList.add('hidden');
            $('#booking-step-3').classList.add('hidden');
            $('#booking-success').classList.remove('hidden');
            bookingConfirmForm.reset();
            selectedDate = '';
            selectedTime = '';
            
            // El listener onSnapshot actualizará 'allAppointments' y el calendario se refrescará
            
            setTimeout(() => {
                $('#booking-success').classList.add('hidden');
            }, 4000);

        } catch (error)
{
            console.error("Error al guardar la cita:", error);
        }
    });

    // Renderizado inicial del calendario
    renderCalendar(currentMonth, currentYear);
}


// === Funciones de UI y Lógica de Vistas ===

function showView(viewId) {
    const views = $$('.view');
    views.forEach(view => {
        if (view.id === viewId) {
            view.classList.add('active', 'fade-in');
        } else {
            view.classList.remove('active', 'fade-in');
        }
    });
    currentView = viewId;
    window.scrollTo(0, 0); // Vuelve arriba al cambiar de vista
    
    // Cierra el menú móvil
    $('#mobile-menu').classList.add('hidden');

    // Refrescar iconos en CUALQUIER vista que los necesite
    feather.replace();
    
    // Actualizar UI específica de la vista
    if (viewId === 'student-area') {
        updateStudentAreaUI();
    }
    if (viewId === 'booking') {
        renderCalendar(currentMonth, currentYear);
    }
}

// === Funciones de Firestore (Listeners) ===
function setupFirestoreListeners() {
    // 1. Listener para el perfil del alumno
    const profileDocRef = doc(db, 'artifacts', appId, 'users', userId, 'profile');
    onSnapshot(profileDocRef, (docSnap) => {
        if (docSnap.exists()) {
            userProfile = docSnap.data();
            console.log("Perfil de alumno cargado:", userProfile);
        } else {
            userProfile = null;
            console.log("No se encontró perfil de alumno.");
        }
        // Actualizar la UI si estamos en la vista de alumno
        updateStudentAreaUI();
    });

    // 2. Listener para las citas del usuario
    // Este listener escucha SÓLO las citas del usuario actual.
    const userAppointmentsCol = collection(db, 'artifacts', appId, 'users', userId, 'appointments');
    onSnapshot(userAppointmentsCol, (snapshot) => {
        allAppointments.clear();
        snapshot.docs.forEach(doc => {
            const data = doc.data();
            const key = `${data.date}_${data.time}`;
            allAppointments.set(key, data);
        });
        console.log("Citas (propias) actualizadas:", allAppointments.size);
        
        // Re-renderizar el calendario si está visible
        if (currentView === 'booking') {
            // Nota: Esto solo deshabilita las citas del PROPIO usuario.
            // Para un sistema real, necesitaríamos leer de una colección PÚBLICA de 'citasOcupadas'.
            // Por ahora, para este ejercicio, esto es funcional.
            renderCalendar(currentMonth, currentYear);
        }
    });
}


// === Funciones de Renderizado de UI ===

// Actualiza el área de estudiante (Registro vs Dashboard)
function updateStudentAreaUI() {
    if (currentView !== 'student-area') return;

    const registerContainer = $('#register-form-container');
    const dashboardContainer = $('#student-dashboard-container');

    if (userProfile) {
        // Mostrar Dashboard
        registerContainer.classList.add('hidden');
        dashboardContainer.classList.remove('hidden');
        $('#student-name').textContent = userProfile.name;
        feather.replace(); // Asegurarse de que los iconos del dashboard se rendericen
    } else {
        // Mostrar Formulario de Registro
        registerContainer.classList.remove('hidden');
        dashboardContainer.classList.add('hidden');
    }
}

// Dibuja el calendario
function renderCalendar(month, year) {
    const calendarGrid = $('#calendar-grid');
    calendarGrid.innerHTML = '';
    $('#booking-step-2').classList.add('hidden');
    $('#booking-step-3').classList.add('hidden');
    $('#booking-success').classList.add('hidden');
    selectedDateEl = null;

    const firstDayOfMonth = (new Date(year, month, 1).getDay() + 6) % 7;
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const today = new Date();
    const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    $('#current-month-year').textContent = `${monthNames[month]} ${year}`;

    // Rellenar días vacíos al inicio
    for (let i = 0; i < firstDayOfMonth; i++) {
        calendarGrid.innerHTML += `<span class="p-2"></span>`;
    }

    // Rellenar días del mes
    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day);
        const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        let classes = 'p-2 rounded-full cursor-pointer';

        // Lógica de habilitación/deshabilitación
        if (date < todayMidnight) {
            classes = 'p-2 rounded-full text-gris-claro/70 cursor-not-allowed'; // Pasado
        } else {
            const dayOfWeek = date.getDay();
            // Días laborables (Lunes, Martes, Jueves, Viernes)
            if ([1, 2, 4, 5].includes(dayOfWeek)) { 
                classes += ' booking-day';
                if (date.toDateString() === todayMidnight.toDateString()) {
                    classes += ' today'; // Clase 'today'
                }
            } else {
                classes += ' text-gris-claro/70 cursor-not-allowed'; // Fin de semana o Miércoles
            }
        }
        
        calendarGrid.innerHTML += `<span class="${classes}" data-date="${dateString}">${day}</span>`;
    }
}

// Actualiza los botones de hora (deshabilita los ocupados)
function updateAvailableTimes(date) {
    const timeSlots = $$('.time-slot-btn');
    timeSlots.forEach(slot => {
        const time = slot.dataset.time;
        if (!time) return; // Ignorar botones deshabilitados (como el de las 12:00)

        const key = `${date}_${time}`;
        
        // Resetear estilos y estado
        slot.disabled = false;
        slot.classList.remove('selected', 'time-slot-disabled');

        // Comprobar si está ocupado
        if (allAppointments.has(key)) {
            slot.disabled = true;
            slot.classList.add('time-slot-disabled');
        }
    });
    
    // Resetear hora seleccionada
    selectedTime = '';
    $('#booking-step-3').classList.add('hidden');
}


// === Iniciar la Aplicación ===
initFirebase();

