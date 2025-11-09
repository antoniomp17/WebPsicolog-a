import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BookOpen, GraduationCap, CreditCard, Clock, CheckCircle2, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import type { Enrollment, Course } from "@shared/schema";

export default function StudentArea() {
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const [, navigate] = useLocation();

  // Fetch user enrollments
  const { data: enrollments = [], isLoading: isLoadingEnrollments } = useQuery<Enrollment[]>({
    queryKey: ["/api/enrollments"],
    enabled: isAuthenticated,
  });

  // Fetch all courses to join with enrollments
  const { data: allCourses = [], isLoading: isLoadingCourses } = useQuery<Course[]>({
    queryKey: ["/api/courses"],
  });

  if (isAuthLoading || (isAuthenticated && (isLoadingEnrollments || isLoadingCourses))) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-dorado" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="animate-fade-in max-w-2xl mx-auto text-center py-12">
        <div className="w-20 h-20 rounded-full bg-dorado/10 mx-auto mb-6 flex items-center justify-center">
          <GraduationCap className="w-10 h-10 text-dorado" />
        </div>
        <h1 className="text-4xl font-bold text-marron mb-4" data-testid="text-login-required">
          Acceso Restringido
        </h1>
        <p className="text-lg text-gris-medio mb-8" data-testid="text-login-message">
          Debes iniciar sesión para acceder al área de alumnos
        </p>
        <div className="flex gap-4 justify-center">
          <Button
            onClick={() => navigate("/login")}
            className="bg-dorado hover:bg-dorado/90 text-white"
            data-testid="button-login"
          >
            Iniciar Sesión
          </Button>
          <Button
            onClick={() => navigate("/registro")}
            variant="outline"
            data-testid="button-register"
          >
            Crear Cuenta
          </Button>
        </div>
      </div>
    );
  }

  // Get enrolled courses with full course data
  const enrolledCourses = enrollments
    .map((enrollment) => {
      const course = allCourses.find((c) => c.id === enrollment.courseId);
      return course ? { enrollment, course } : null;
    })
    .filter((item): item is { enrollment: Enrollment; course: Course } => item !== null);

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-500 hover:bg-green-600 text-white"><CheckCircle2 className="w-3 h-3 mr-1" /> Pagado</Badge>;
      case "pending":
        return <Badge variant="outline" className="border-amber-500 text-amber-600"><Clock className="w-3 h-3 mr-1" /> Pendiente de Pago</Badge>;
      case "refunded":
        return <Badge variant="destructive">Reembolsado</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <section className="mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-marron mb-4" data-testid="text-student-area-title">
          Mi Área de Aprendizaje
        </h1>
        <p className="text-lg text-gris-medio" data-testid="text-welcome">
          Bienvenido, {user?.name}
        </p>
      </section>

      {/* Enrollments Section */}
      {enrolledCourses.length === 0 ? (
        <Card className="shadow-lg border-card-border" data-testid="card-no-enrollments">
          <CardContent className="p-12 text-center">
            <BookOpen className="w-16 h-16 text-gris-claro mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-marron mb-2">
              Aún no tienes cursos
            </h3>
            <p className="text-gris-medio mb-6">
              Explora nuestro catálogo de cursos y comienza tu viaje de aprendizaje
            </p>
            <Button
              onClick={() => navigate("/cursos")}
              className="bg-dorado hover:bg-dorado/90 text-white"
              data-testid="button-view-courses"
            >
              Ver Cursos Disponibles
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-marron" data-testid="text-my-courses">
            Mis Cursos ({enrolledCourses.length})
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrolledCourses.map(({ enrollment, course }) => (
              <Card
                key={enrollment.id}
                className="overflow-hidden transition-transform duration-300 hover:scale-[1.02] shadow-lg border-card-border flex flex-col"
                data-testid={`card-enrollment-${enrollment.id}`}
              >
                <img
                  src={course.imageUrl}
                  alt={course.title}
                  className="w-full h-48 object-cover"
                  data-testid={`img-course-${course.id}`}
                />
                <CardHeader className="flex-grow">
                  <div className="flex flex-wrap gap-2 mb-3">
                    {getPaymentStatusBadge(enrollment.paymentStatus)}
                  </div>
                  <h3 className="text-xl font-semibold text-marron mb-2" data-testid={`text-course-title-${course.id}`}>
                    {course.title}
                  </h3>
                  <p className="text-sm text-gris-medio mb-4" data-testid={`text-course-description-${course.id}`}>
                    {course.shortDescription}
                  </p>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm text-gris-medio">
                      <span>Progreso</span>
                      <span>{enrollment.progressPercentage}%</span>
                    </div>
                    <Progress value={parseFloat(enrollment.progressPercentage || "0")} className="h-2" />
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  {enrollment.paymentStatus === "completed" ? (
                    <Button
                      className="w-full bg-dorado hover:bg-dorado/90 text-white"
                      data-testid={`button-access-course-${course.id}`}
                    >
                      Acceder al Curso
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      className="w-full border-amber-500 text-amber-600 hover:bg-amber-50"
                      data-testid={`button-complete-payment-${course.id}`}
                    >
                      <CreditCard className="w-4 h-4 mr-2" />
                      Completar Pago
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
