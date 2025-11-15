import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, Loader2 } from "lucide-react";
import { testimonials, faqs } from "@/lib/data";
import type { Course } from "@shared/schema";

export default function Home() {
  // Fetch featured courses from API
  const { data: featuredCourses = [], isLoading: isLoadingCourses } = useQuery<Course[]>({
    queryKey: ["/api/courses/featured"],
  });
  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-secondary to-accent/30 rounded-2xl overflow-hidden shadow-lg mb-16 p-8 md:p-16 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-marron mb-4" data-testid="text-hero-title">
          Encuentra tu equilibrio. Crece con nosotros.
        </h1>
        <p className="text-lg text-marron/80 max-w-2xl mx-auto mb-8" data-testid="text-hero-subtitle">
          Descubre nuestros cursos de psicología y desarrollo personal, o agenda una sesión de terapia individual.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link href="/cursos" data-testid="link-explorar-cursos">
            <Button size="lg" className="bg-dorado hover:bg-dorado/90 text-white shadow-md w-full sm:w-auto">
              Explorar Cursos
            </Button>
          </Link>
          <Link href="/agendar" data-testid="link-agendar-sesion">
            <Button
              size="lg"
              variant="outline"
              className="bg-white border-dorado text-dorado hover:bg-secondary shadow-md w-full sm:w-auto"
            >
              Agendar Sesión
            </Button>
          </Link>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="mb-20">
        <h2 className="text-3xl font-bold text-center text-marron mb-8" data-testid="text-cursos-destacados">
          Cursos Destacados
        </h2>
        {isLoadingCourses ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-dorado" />
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredCourses.map((course) => (
              <Card
                key={course.id}
                className="overflow-hidden transition-transform duration-300 hover:scale-[1.02] shadow-lg border-card-border"
                data-testid={`card-course-${course.id}`}
              >
                <img
                  src={course.imageUrl}
                  alt={course.title}
                  className="w-full h-48 object-cover"
                  data-testid={`img-course-${course.id}`}
                />
                <CardHeader>
                  <h3 className="text-xl font-semibold text-marron mb-2" data-testid={`text-course-title-${course.id}`}>
                    {course.title}
                  </h3>
                  <p className="text-sm text-gris-medio" data-testid={`text-course-description-${course.id}`}>
                    {course.shortDescription}
                  </p>
                </CardHeader>
                <CardFooter className="flex flex-wrap justify-between items-center gap-2">
                  <span className="text-2xl font-bold text-dorado" data-testid={`text-course-price-${course.id}`}>
                    €{course.price}
                  </span>
                  <Link href="/cursos" data-testid={`link-ver-curso-${course.id}`}>
                    <Button variant="secondary" size="sm" className="hover-elevate active-elevate-2">
                      Ver más
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Testimonials */}
      <section className="mb-20">
        <h2 className="text-3xl font-bold text-center text-marron mb-10" data-testid="text-testimonios-title">
          Lo que dicen mis alumnos
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <Card
              key={testimonial.id}
              className="relative p-6 shadow-lg border-card-border"
              data-testid={`card-testimonial-${testimonial.id}`}
            >
              <div className="absolute top-0 left-6 -translate-y-1/2 text-6xl text-secondary opacity-75">
                "
              </div>
              <CardContent className="pt-4 px-0">
                <p className="text-gris-medio italic relative" data-testid={`text-testimonial-quote-${testimonial.id}`}>
                  {testimonial.quote}
                </p>
                <p className="font-semibold text-marron mt-4" data-testid={`text-testimonial-author-${testimonial.id}`}>
                  - {testimonial.author}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-marron mb-10" data-testid="text-faq-title">
          Preguntas Frecuentes
        </h2>
        <div className="space-y-4">
          {faqs.map((faq) => (
            <details
              key={faq.id}
              className="group bg-card p-6 rounded-lg shadow-sm cursor-pointer border border-card-border hover-elevate"
              data-testid={`details-faq-${faq.id}`}
            >
              <summary className="flex justify-between items-center font-semibold text-marron text-lg group-open:text-dorado list-none">
                <span data-testid={`text-faq-question-${faq.id}`}>{faq.question}</span>
                <ChevronDown className="w-5 h-5 group-open:rotate-180 transition-transform flex-shrink-0 ml-2" />
              </summary>
              <p className="text-gris-medio mt-3" data-testid={`text-faq-answer-${faq.id}`}>
                {faq.answer}
              </p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
