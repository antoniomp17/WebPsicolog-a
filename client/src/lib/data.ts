import { Testimonial, FAQ } from "@shared/schema";

// Testimonials and FAQs are still static data for MVP
// Courses and Articles are now fetched from the database via API

export const testimonials: Testimonial[] = [
  {
    id: "1",
    quote: "El curso de gestión de ansiedad cambió mi vida. Las herramientas son prácticas y fáciles de aplicar. ¡Totalmente recomendado!",
    author: "Ana G.",
  },
  {
    id: "2",
    quote: "Increíble el taller de Mindfulness. He logrado conectar conmigo misma y reducir mi estrés diario. La Dra. González explica de maravilla.",
    author: "Carlos M.",
  },
  {
    id: "3",
    quote: "Dudaba de la terapia online, pero ha sido un acierto. Me he sentido escuchada y comprendida desde el primer minuto.",
    author: "Lucía F.",
  },
];

export const faqs: FAQ[] = [
  {
    id: "1",
    question: "¿Cómo funcionan las inscripciones a los cursos?",
    answer: "Las inscripciones son muy sencillas. Una vez que seleccionas el curso que te interesa, haces clic en 'Inscribirse' y completas el formulario de pago. Recibirás inmediatamente un email con tus credenciales de acceso a la plataforma de aprendizaje.",
  },
  {
    id: "2",
    question: "¿Qué duración tienen las sesiones de terapia?",
    answer: "Cada sesión de terapia individual tiene una duración de 50 minutos. Recomendamos comenzar con sesiones semanales, aunque la frecuencia puede ajustarse según tus necesidades y progreso.",
  },
  {
    id: "3",
    question: "¿Los cursos son en vivo o grabados?",
    answer: "Los cursos son principalmente grabados y disponibles 24/7, lo que te permite estudiar a tu propio ritmo. Algunos cursos incluyen sesiones en vivo mensuales con la Dra. González para responder preguntas y profundizar en los temas.",
  },
  {
    id: "4",
    question: "¿Ofrecen certificados al completar los cursos?",
    answer: "Sí, al completar exitosamente un curso y aprobar las evaluaciones finales, recibirás un certificado digital avalado por nuestro equipo de profesionales. Este certificado puede ser compartido en tu perfil de LinkedIn o incluido en tu curriculum.",
  },
  {
    id: "5",
    question: "¿Qué métodos de pago aceptan?",
    answer: "Aceptamos tarjetas de crédito y débito (Visa, MasterCard, American Express) a través de nuestro procesador de pagos seguro Stripe. También ofrecemos opciones de pago diferido para algunos cursos.",
  },
];
