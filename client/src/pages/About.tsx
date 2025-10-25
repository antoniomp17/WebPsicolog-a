import { Card, CardContent } from "@/components/ui/card";
import { Award, BookOpen, Heart, Users } from "lucide-react";

export default function About() {
  const features = [
    {
      icon: Award,
      title: "Experiencia Profesional",
      description: "Más de 15 años de experiencia en psicología clínica y terapia cognitivo-conductual.",
    },
    {
      icon: BookOpen,
      title: "Formación Continua",
      description: "Certificaciones en mindfulness, terapia de aceptación y compromiso, y neuropsicología.",
    },
    {
      icon: Heart,
      title: "Enfoque Humanista",
      description: "Tratamiento personalizado centrado en tus necesidades únicas y objetivos personales.",
    },
    {
      icon: Users,
      title: "Comunidad de Apoyo",
      description: "Más de 500 alumnos han transformado sus vidas a través de nuestros cursos y terapias.",
    },
  ];

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <section className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-marron mb-4" data-testid="text-about-title">
          Sobre Mí
        </h1>
        <p className="text-lg text-gris-medio max-w-3xl mx-auto" data-testid="text-about-subtitle">
          Dedicada a ayudarte a encontrar el equilibrio emocional y desarrollar tu máximo potencial
        </p>
      </section>

      {/* Main Content */}
      <div className="grid lg:grid-cols-2 gap-12 mb-16">
        {/* Image */}
        <div className="relative rounded-2xl overflow-hidden shadow-lg">
          <img
            src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&h=600&fit=crop"
            alt="Dra. María González"
            className="w-full h-full object-cover"
            data-testid="img-about-profile"
          />
        </div>

        {/* Bio */}
        <div className="flex flex-col justify-center space-y-6">
          <div>
            <h2 className="text-3xl font-bold text-marron mb-4" data-testid="text-about-name">
              Dra. María González
            </h2>
            <p className="text-gris-medio leading-relaxed mb-4" data-testid="text-about-bio-1">
              Soy psicóloga clínica especializada en terapia cognitivo-conductual y mindfulness. Mi pasión es acompañar a las personas en su viaje hacia el bienestar emocional y el crecimiento personal.
            </p>
            <p className="text-gris-medio leading-relaxed mb-4" data-testid="text-about-bio-2">
              Con más de 15 años de experiencia, he trabajado con cientos de pacientes ayudándoles a superar la ansiedad, la depresión, y a desarrollar habilidades para una vida más plena y significativa.
            </p>
            <p className="text-gris-medio leading-relaxed" data-testid="text-about-bio-3">
              Creo firmemente en el poder de la educación y la autoconciencia. Por eso, además de las sesiones individuales, ofrezco cursos que te brindan herramientas prácticas para aplicar en tu día a día.
            </p>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-center text-marron mb-10" data-testid="text-about-features-title">
          Mi Enfoque
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card
                key={index}
                className="text-center shadow-lg border-card-border hover-elevate transition-all"
                data-testid={`card-feature-${index}`}
              >
                <CardContent className="p-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-dorado/10 mb-4">
                    <Icon className="w-8 h-8 text-dorado" data-testid={`icon-feature-${index}`} />
                  </div>
                  <h3 className="text-lg font-semibold text-marron mb-2" data-testid={`text-feature-title-${index}`}>
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gris-medio" data-testid={`text-feature-description-${index}`}>
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Education */}
      <section className="max-w-3xl mx-auto">
        <Card className="shadow-lg border-card-border">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-marron mb-6" data-testid="text-education-title">
              Formación y Certificaciones
            </h2>
            <div className="space-y-4">
              <div className="flex gap-4" data-testid="education-item-1">
                <div className="w-2 bg-dorado rounded-full flex-shrink-0"></div>
                <div>
                  <h3 className="font-semibold text-marron">Licenciatura en Psicología</h3>
                  <p className="text-sm text-gris-medio">Universidad Complutense de Madrid</p>
                </div>
              </div>
              <div className="flex gap-4" data-testid="education-item-2">
                <div className="w-2 bg-dorado rounded-full flex-shrink-0"></div>
                <div>
                  <h3 className="font-semibold text-marron">Máster en Psicología Clínica</h3>
                  <p className="text-sm text-gris-medio">Universidad Autónoma de Barcelona</p>
                </div>
              </div>
              <div className="flex gap-4" data-testid="education-item-3">
                <div className="w-2 bg-dorado rounded-full flex-shrink-0"></div>
                <div>
                  <h3 className="font-semibold text-marron">Certificación en Mindfulness-Based Stress Reduction (MBSR)</h3>
                  <p className="text-sm text-gris-medio">Center for Mindfulness, University of Massachusetts</p>
                </div>
              </div>
              <div className="flex gap-4" data-testid="education-item-4">
                <div className="w-2 bg-dorado rounded-full flex-shrink-0"></div>
                <div>
                  <h3 className="font-semibold text-marron">Especialización en Terapia de Aceptación y Compromiso</h3>
                  <p className="text-sm text-gris-medio">Association for Contextual Behavioral Science</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
