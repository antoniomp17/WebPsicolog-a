import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { CheckCircle2, Clock, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Course, Enrollment } from "@shared/schema";

export default function Courses() {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();

  // Fetch all courses from API
  const { data: courses = [], isLoading: isLoadingCourses } = useQuery<Course[]>({
    queryKey: ["/api/courses"],
  });

  // Fetch user enrollments (only if authenticated)
  const { data: enrollments = [] } = useQuery<Enrollment[]>({
    queryKey: ["/api/enrollments"],
    enabled: isAuthenticated,
  });

  // Create enrollment mutation
  const enrollMutation = useMutation({
    mutationFn: async (courseId: string) => {
      return await apiRequest("POST", "/api/enrollments", { courseId });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/enrollments"] });
      setSelectedCourse(null);
      toast({
        title: "¡Inscripción iniciada!",
        description: "Tu inscripción está pendiente de pago. Redirigiendo al pago...",
      });
      // Redirect to the checkout page with the enrollment ID
      navigate(`/checkout/${data.id}`);
    },
    onError: (error: any) => {
      toast({
        title: "Error al inscribirse",
        description: error.message || "Hubo un problema al procesar tu inscripción",
        variant: "destructive",
      });
    },
  });

  const handleEnroll = (course: Course) => {
    if (!isAuthenticated) {
      toast({
        title: "Inicia sesión para inscribirte",
        description: "Debes tener una cuenta para inscribirte en cursos",
      });
      navigate("/login");
      return;
    }

    // Check if already enrolled
    const isEnrolled = enrollments.some((e) => e.courseId === course.id);
    if (isEnrolled) {
      toast({
        title: "Ya estás inscrito",
        description: "Ya estás inscrito en este curso. Ve al área de alumnos para acceder.",
      });
      return;
    }

    setSelectedCourse(course);
  };

  const handleConfirmEnrollment = () => {
    if (selectedCourse) {
      enrollMutation.mutate(selectedCourse.id);
    }
  };

  const getCourseEnrollmentStatus = (courseId: string) => {
    return enrollments.find((e) => e.courseId === courseId);
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <section className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-marron mb-4" data-testid="text-courses-title">
          Cursos y Talleres
        </h1>
        <p className="text-lg text-gris-medio max-w-3xl mx-auto" data-testid="text-courses-subtitle">
          Aprende a tu ritmo con nuestros cursos online de psicología y desarrollo personal
        </p>
      </section>

      {/* Courses Grid */}
      {isLoadingCourses ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-dorado" />
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course) => (
            <Card
              key={course.id}
              className="overflow-hidden transition-transform duration-300 hover:scale-[1.02] shadow-lg border-card-border flex flex-col"
              data-testid={`card-course-${course.id}`}
            >
              <img
                src={course.imageUrl}
                alt={course.title}
                className="w-full h-48 object-cover"
                data-testid={`img-course-${course.id}`}
              />
              <CardHeader className="flex-grow">
                <div className="flex flex-wrap gap-2 mb-3">
                  <Badge variant="secondary" className="text-xs" data-testid={`badge-level-${course.id}`}>
                    {course.level}
                  </Badge>
                  <Badge variant="outline" className="text-xs" data-testid={`badge-duration-${course.id}`}>
                    <Clock className="w-3 h-3 mr-1" />
                    {course.durationWeeks} semanas
                  </Badge>
                </div>
                <h3 className="text-xl font-semibold text-marron mb-2" data-testid={`text-course-title-${course.id}`}>
                  {course.title}
                </h3>
                <p className="text-sm text-gris-medio" data-testid={`text-course-description-${course.id}`}>
                  {course.shortDescription}
                </p>
              </CardHeader>
              <CardFooter className="flex flex-wrap justify-between items-center gap-2 pt-0">
                <span className="text-3xl font-bold text-dorado" data-testid={`text-course-price-${course.id}`}>
                  €{course.price}
                </span>
                {getCourseEnrollmentStatus(course.id) ? (
                  <Button
                    variant="outline"
                    disabled
                    data-testid={`button-enrolled-${course.id}`}
                  >
                    {getCourseEnrollmentStatus(course.id)?.paymentStatus === "completed" 
                      ? "Inscrito" 
                      : "Pendiente de Pago"}
                  </Button>
                ) : (
                  <Button
                    onClick={() => handleEnroll(course)}
                    className="bg-dorado hover:bg-dorado/90 text-white"
                    data-testid={`button-enroll-${course.id}`}
                  >
                    Inscribirse
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Enrollment Confirmation Dialog */}
      <Dialog open={!!selectedCourse} onOpenChange={() => setSelectedCourse(null)}>
        <DialogContent className="sm:max-w-md" data-testid="dialog-enrollment">
          <DialogHeader>
            <DialogTitle className="text-2xl text-marron" data-testid="text-modal-title">
              Confirmar Inscripción
            </DialogTitle>
            <DialogDescription className="text-gris-medio">
              Estás a punto de inscribirte en este curso
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4" data-testid="enrollment-confirmation">
            <div>
              <p className="text-sm text-gris-medio mb-2" data-testid="text-course-selected">
                Curso: <span className="font-semibold text-marron">{selectedCourse?.title}</span>
              </p>
              <p className="text-sm text-gris-medio mb-2">
                Duración: <span className="font-semibold text-marron">{selectedCourse?.durationWeeks} semanas</span>
              </p>
              <p className="text-2xl font-bold text-dorado mb-4" data-testid="text-price-selected">
                €{selectedCourse?.price}
              </p>
            </div>

            <p className="text-sm text-gris-medio">
              Tu inscripción quedará pendiente hasta completar el pago. En el siguiente paso serás redirigido a la pasarela de pago segura.
            </p>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setSelectedCourse(null)}
                className="flex-1"
                data-testid="button-cancel-enrollment"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleConfirmEnrollment}
                disabled={enrollMutation.isPending}
                className="flex-1 bg-dorado hover:bg-dorado/90 text-white"
                data-testid="button-confirm-enrollment"
              >
                {enrollMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Procesando...
                  </>
                ) : (
                  "Confirmar Inscripción"
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
