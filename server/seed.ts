import { db } from "./db";
import { courses, articles } from "@shared/schema";

async function seed() {
  console.log("🌱 Seeding database...");

  // Seed courses
  const coursesData = [
    {
      title: "Gestión de la Ansiedad",
      slug: "gestion-ansiedad",
      description: "Aprende técnicas prácticas para manejar la ansiedad y el estrés en tu día a día. Incluye ejercicios de respiración, mindfulness y herramientas cognitivo-conductuales.",
      shortDescription: "Técnicas prácticas para manejar la ansiedad y el estrés.",
      price: "120",
      durationWeeks: 6,
      level: "principiante" as const,
      imageUrl: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&h=400&fit=crop",
      isFeatured: true,
      isPublished: true,
    },
    {
      title: "Mindfulness y Bienestar",
      slug: "mindfulness-bienestar",
      description: "Descubre el poder de la atención plena para mejorar tu concentración y bienestar emocional. Aprende a vivir el presente con mayor plenitud.",
      shortDescription: "Descubre el poder de la atención plena.",
      price: "80",
      durationWeeks: 4,
      level: "todos" as const,
      imageUrl: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&h=400&fit=crop",
      isFeatured: true,
      isPublished: true,
    },
    {
      title: "Comunicación Asertiva",
      slug: "comunicacion-asertiva",
      description: "Desarrolla habilidades para comunicarte de forma efectiva y respetuosa en tus relaciones personales y profesionales.",
      shortDescription: "Desarrolla habilidades de comunicación efectiva.",
      price: "150",
      durationWeeks: 8,
      level: "intermedio" as const,
      imageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&h=400&fit=crop",
      isFeatured: false,
      isPublished: true,
    },
    {
      title: "Autoestima y Confianza",
      slug: "autoestima-confianza",
      description: "Fortalece tu autoestima y desarrolla una confianza genuina en ti mismo. Aprende a reconocer tu valor y potencial.",
      shortDescription: "Fortalece tu autoestima y confianza.",
      price: "110",
      durationWeeks: 5,
      level: "principiante" as const,
      imageUrl: "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=600&h=400&fit=crop",
      isFeatured: false,
      isPublished: true,
    },
    {
      title: "Gestión Emocional",
      slug: "gestion-emocional",
      description: "Aprende a identificar, comprender y regular tus emociones de manera saludable. Desarrolla inteligencia emocional.",
      shortDescription: "Aprende a regular tus emociones de manera saludable.",
      price: "130",
      durationWeeks: 7,
      level: "intermedio" as const,
      imageUrl: "https://images.unsplash.com/photo-1497215842964-222b430dc094?w=600&h=400&fit=crop",
      isFeatured: true,
      isPublished: true,
    },
    {
      title: "Resiliencia y Crecimiento",
      slug: "resiliencia-crecimiento",
      description: "Desarrolla tu capacidad de adaptación ante las adversidades y aprende a crecer a través de los desafíos.",
      shortDescription: "Desarrolla tu capacidad de adaptación ante adversidades.",
      price: "95",
      durationWeeks: 6,
      level: "todos" as const,
      imageUrl: "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=600&h=400&fit=crop",
      isFeatured: false,
      isPublished: true,
    },
  ];

  console.log("📚 Inserting courses...");
  for (const courseData of coursesData) {
    await db.insert(courses).values(courseData).onConflictDoNothing();
  }
  console.log(`✅ Inserted ${coursesData.length} courses`);

  // Seed articles
  const articlesData = [
    {
      title: "5 Técnicas de Respiración para Reducir la Ansiedad",
      slug: "5-tecnicas-respiracion-ansiedad",
      excerpt: "Descubre cómo técnicas simples de respiración pueden ayudarte a encontrar calma en momentos de estrés.",
      content: `
        <p class="mb-4">La respiración es una herramienta poderosa que siempre llevamos con nosotros. Cuando nos sentimos ansiosos, nuestro patrón de respiración cambia, volviéndose más rápido y superficial. Al tomar control consciente de nuestra respiración, podemos activar el sistema nervioso parasimpático y promover la calma.</p>
        
        <h2 class="text-2xl font-semibold mb-3 mt-6">1. Respiración Diafragmática</h2>
        <p class="mb-4">También conocida como respiración abdominal, esta técnica implica respirar profundamente hacia el diafragma en lugar del pecho. Coloca una mano en tu pecho y otra en tu abdomen. Al inhalar, tu abdomen debe expandirse más que tu pecho.</p>
        
        <h2 class="text-2xl font-semibold mb-3 mt-6">2. Técnica 4-7-8</h2>
        <p class="mb-4">Inhala por la nariz contando hasta 4, mantén la respiración contando hasta 7, y exhala completamente por la boca contando hasta 8. Esta técnica es especialmente útil antes de dormir.</p>
        
        <h2 class="text-2xl font-semibold mb-3 mt-6">3. Respiración Cuadrada</h2>
        <p class="mb-4">Visualiza un cuadrado: inhala durante 4 segundos, mantén durante 4 segundos, exhala durante 4 segundos, y mantén vacío durante 4 segundos. Repite el ciclo.</p>
        
        <h2 class="text-2xl font-semibold mb-3 mt-6">4. Respiración Alterna de Fosas Nasales</h2>
        <p class="mb-4">Una técnica de yoga que equilibra los hemisferios cerebrales. Cierra una fosa nasal, inhala por la otra, cambia y exhala por la fosa opuesta.</p>
        
        <h2 class="text-2xl font-semibold mb-3 mt-6">5. Respiración Consciente Simple</h2>
        <p class="mb-4">Simplemente observa tu respiración sin intentar cambiarla. Nota la sensación del aire entrando y saliendo. Esta técnica de mindfulness ancla tu atención en el presente.</p>
        
        <p class="mt-6"><strong>Consejo:</strong> Practica estas técnicas regularmente, no solo cuando te sientas ansioso. La práctica constante hace que sean más efectivas cuando realmente las necesites.</p>
      `,
      authorName: "Dra. María González",
      imageUrl: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&h=400&fit=crop",
      publishedAt: new Date("2024-03-15"),
      viewsCount: 0,
      isPublished: true,
    },
    {
      title: "El Poder del Autocuidado en la Salud Mental",
      slug: "poder-autocuidado-salud-mental",
      excerpt: "Por qué dedicar tiempo a ti mismo no es egoísta, sino esencial para tu bienestar emocional.",
      content: `
        <p class="mb-4">En nuestra sociedad acelerada, el autocuidado a menudo se percibe como un lujo o incluso como algo egoísta. Sin embargo, cuidar de nuestra salud mental es tan importante como cuidar de nuestra salud física.</p>
        
        <h2 class="text-2xl font-semibold mb-3 mt-6">¿Qué es el Autocuidado?</h2>
        <p class="mb-4">El autocuidado abarca todas las acciones deliberadas que tomamos para cuidar de nuestra salud física, mental y emocional. No se trata solo de spa days o vacaciones, sino de hábitos diarios que nutren nuestro bienestar.</p>
        
        <h2 class="text-2xl font-semibold mb-3 mt-6">Dimensiones del Autocuidado</h2>
        <ul class="list-disc pl-6 mb-4 space-y-2">
          <li><strong>Físico:</strong> Ejercicio, nutrición adecuada, sueño reparador</li>
          <li><strong>Emocional:</strong> Reconocer y expresar emociones de manera saludable</li>
          <li><strong>Mental:</strong> Estimulación intelectual, aprendizaje continuo</li>
          <li><strong>Social:</strong> Mantener relaciones significativas</li>
          <li><strong>Espiritual:</strong> Conectar con valores y propósito</li>
        </ul>
        
        <h2 class="text-2xl font-semibold mb-3 mt-6">Beneficios del Autocuidado</h2>
        <p class="mb-4">La práctica regular de autocuidado reduce el estrés, mejora la autoestima, aumenta la productividad y nos hace más resilientes ante las adversidades. También nos permite ser mejores compañeros, padres y profesionales.</p>
        
        <p class="mt-6"><strong>Recuerda:</strong> No puedes servir desde un vaso vacío. Cuidarte a ti mismo te permite cuidar mejor de los demás.</p>
      `,
      authorName: "Dra. María González",
      imageUrl: "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=800&h=400&fit=crop",
      publishedAt: new Date("2024-03-08"),
      viewsCount: 0,
      isPublished: true,
    },
    {
      title: "Mindfulness: Vivir en el Presente",
      slug: "mindfulness-vivir-presente",
      excerpt: "Aprende cómo la práctica de mindfulness puede transformar tu experiencia diaria y reducir el estrés.",
      content: `
        <p class="mb-4">Mindfulness, o atención plena, es la práctica de estar completamente presente en el momento actual, observando nuestros pensamientos y sensaciones sin juicio.</p>
        
        <h2 class="text-2xl font-semibold mb-3 mt-6">Los Fundamentos del Mindfulness</h2>
        <p class="mb-4">El mindfulness no se trata de vaciar la mente o detener los pensamientos. Se trata de observarlos sin engancharse en ellos, como nubes pasando en el cielo.</p>
        
        <h2 class="text-2xl font-semibold mb-3 mt-6">Beneficios Científicamente Comprobados</h2>
        <ul class="list-disc pl-6 mb-4 space-y-2">
          <li>Reducción del estrés y la ansiedad</li>
          <li>Mejora de la concentración y memoria</li>
          <li>Mayor regulación emocional</li>
          <li>Disminución de síntomas depresivos</li>
          <li>Mejora en la calidad del sueño</li>
        </ul>
        
        <h2 class="text-2xl font-semibold mb-3 mt-6">Cómo Empezar</h2>
        <p class="mb-4">Comienza con solo 5 minutos al día. Siéntate cómodamente, cierra los ojos y enfoca tu atención en la respiración. Cuando tu mente divague (y lo hará), simplemente nota que ha divagado y vuelve gentilmente a la respiración.</p>
        
        <p class="mt-6"><strong>Práctica diaria:</strong> Lleva el mindfulness a actividades cotidianas como comer, caminar o ducharte. Enfoca todos tus sentidos en la experiencia presente.</p>
      `,
      authorName: "Dra. María González",
      imageUrl: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&h=400&fit=crop",
      publishedAt: new Date("2024-03-01"),
      viewsCount: 0,
      isPublished: true,
    },
  ];

  console.log("📰 Inserting articles...");
  for (const articleData of articlesData) {
    await db.insert(articles).values(articleData).onConflictDoNothing();
  }
  console.log(`✅ Inserted ${articlesData.length} articles`);

  console.log("✨ Seeding complete!");
  process.exit(0);
}

seed().catch((error) => {
  console.error("❌ Seeding failed:", error);
  process.exit(1);
});
