import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Video, Users, Clock, Shield } from "lucide-react";

export default function Services() {
  const services = [
    {
      title: "Terapia Individual Online",
      price: "€60",
      duration: "50 minutos",
      description: "Sesiones personalizadas de terapia cognitivo-conductual adaptadas a tus necesidades específicas.",
      features: [
        "Evaluación inicial completa",
        "Plan de tratamiento personalizado",
        "Seguimiento continuo",
        "Material de apoyo entre sesiones",
      ],
    },
    {
      title: "Paquete de 4 Sesiones",
      price: "€220",
      duration: "4 x 50 minutos",
      description: "Compromiso a corto plazo con un descuento especial. Ideal para abordar objetivos específicos.",
      features: [
        "Ahorro de €20",
        "Flexibilidad de horarios",
        "Acceso a recursos exclusivos",
        "Seguimiento vía email",
      ],
      badge: "Más Popular",
    },
    {
      title: "Paquete de 10 Sesiones",
      price: "€500",
      duration: "10 x 50 minutos",
      description: "Programa completo para un cambio profundo y duradero. Máximo compromiso, máximos resultados.",
      features: [
        "Ahorro de €100",
        "Prioridad en agenda",
        "Sesiones de seguimiento gratuitas",
        "Acceso a todos los cursos",
      ],
      badge: "Mejor Valor",
    },
  ];

  const benefits = [
    {
      icon: Video,
      title: "100% Online",
      description: "Sesiones desde la comodidad de tu hogar a través de videollamada segura.",
    },
    {
      icon: Shield,
      title: "Confidencialidad",
      description: "Privacidad total garantizada. Tus datos están protegidos bajo estricto secreto profesional.",
    },
    {
      icon: Clock,
      title: "Flexibilidad Horaria",
      description: "Horarios adaptados a tu rutina, incluyendo tardes y fines de semana.",
    },
    {
      icon: Users,
      title: "Enfoque Personalizado",
      description: "Tratamiento adaptado a tus necesidades únicas y objetivos personales.",
    },
  ];

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <section className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-marron mb-4" data-testid="text-services-title">
          Terapia Individual
        </h1>
        <p className="text-lg text-gris-medio max-w-3xl mx-auto" data-testid="text-services-subtitle">
          Un espacio seguro y confidencial para explorar tus emociones, superar desafíos y alcanzar tu bienestar emocional
        </p>
      </section>

      {/* Services Grid */}
      <section className="mb-20">
        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Card
              key={index}
              className={`shadow-lg border-card-border hover-elevate transition-all ${
                service.badge ? "ring-2 ring-dorado" : ""
              }`}
              data-testid={`card-service-${index}`}
            >
              <CardHeader>
                {service.badge && (
                  <Badge className="mb-4 bg-dorado text-white w-fit" data-testid={`badge-service-${index}`}>
                    {service.badge}
                  </Badge>
                )}
                <h3 className="text-2xl font-bold text-marron mb-2" data-testid={`text-service-title-${index}`}>
                  {service.title}
                </h3>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-4xl font-bold text-dorado" data-testid={`text-service-price-${index}`}>
                    {service.price}
                  </span>
                  <span className="text-sm text-gris-medio" data-testid={`text-service-duration-${index}`}>
                    / {service.duration}
                  </span>
                </div>
                <p className="text-gris-medio text-sm" data-testid={`text-service-description-${index}`}>
                  {service.description}
                </p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  {service.features.map((feature, fIndex) => (
                    <li key={fIndex} className="flex items-start gap-2" data-testid={`list-service-feature-${index}-${fIndex}`}>
                      <div className="w-1.5 h-1.5 rounded-full bg-dorado mt-2 flex-shrink-0"></div>
                      <span className="text-sm text-gris-medio">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/agendar" data-testid={`link-agendar-service-${index}`}>
                  <Button className="w-full bg-dorado hover:bg-dorado/90 text-white">
                    Agendar Sesión
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Benefits */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-center text-marron mb-10" data-testid="text-benefits-title">
          Beneficios de la Terapia Online
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <Card
                key={index}
                className="text-center shadow-lg border-card-border hover-elevate transition-all"
                data-testid={`card-benefit-${index}`}
              >
                <CardContent className="p-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-dorado/10 mb-4">
                    <Icon className="w-8 h-8 text-dorado" data-testid={`icon-benefit-${index}`} />
                  </div>
                  <h3 className="text-lg font-semibold text-marron mb-2" data-testid={`text-benefit-title-${index}`}>
                    {benefit.title}
                  </h3>
                  <p className="text-sm text-gris-medio" data-testid={`text-benefit-description-${index}`}>
                    {benefit.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-4xl mx-auto">
        <Card className="shadow-lg border-card-border">
          <CardContent className="p-8">
            <h2 className="text-3xl font-bold text-marron mb-8 text-center" data-testid="text-howitworks-title">
              Cómo Funciona
            </h2>
            <div className="space-y-6">
              <div className="flex gap-4" data-testid="step-1">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-dorado text-white flex items-center justify-center font-bold">
                  1
                </div>
                <div>
                  <h3 className="font-semibold text-marron text-lg mb-1">Agenda tu Primera Sesión</h3>
                  <p className="text-gris-medio">
                    Selecciona un horario que se ajuste a tu agenda. Recibirás un enlace de videollamada segura.
                  </p>
                </div>
              </div>
              <div className="flex gap-4" data-testid="step-2">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-dorado text-white flex items-center justify-center font-bold">
                  2
                </div>
                <div>
                  <h3 className="font-semibold text-marron text-lg mb-1">Primera Evaluación</h3>
                  <p className="text-gris-medio">
                    En la primera sesión, exploraremos tus necesidades y objetivos para crear un plan personalizado.
                  </p>
                </div>
              </div>
              <div className="flex gap-4" data-testid="step-3">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-dorado text-white flex items-center justify-center font-bold">
                  3
                </div>
                <div>
                  <h3 className="font-semibold text-marron text-lg mb-1">Sesiones Regulares</h3>
                  <p className="text-gris-medio">
                    Trabajaremos juntos aplicando técnicas basadas en evidencia adaptadas a tu situación.
                  </p>
                </div>
              </div>
              <div className="flex gap-4" data-testid="step-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-dorado text-white flex items-center justify-center font-bold">
                  4
                </div>
                <div>
                  <h3 className="font-semibold text-marron text-lg mb-1">Seguimiento y Progreso</h3>
                  <p className="text-gris-medio">
                    Evaluaremos regularmente tu progreso y ajustaremos el enfoque según sea necesario.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
