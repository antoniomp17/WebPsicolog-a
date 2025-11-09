import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle2, Clock, BarChart, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Course } from "@shared/schema";

export default function Courses() {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const { toast } = useToast();

  // Fetch all courses from API
  const { data: courses = [], isLoading: isLoadingCourses } = useQuery<Course[]>({
    queryKey: ["/api/courses"],
  });

  const handleEnroll = (course: Course) => {
    setSelectedCourse(course);
    setPaymentSuccess(false);
  };

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setPaymentSuccess(true);
    
    setTimeout(() => {
      setSelectedCourse(null);
      toast({
        title: "¡Inscripción completada!",
        description: `Has sido inscrito exitosamente en ${selectedCourse?.title}. Recibirás un email con los detalles de acceso.`,
      });
    }, 2000);
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
                <Button
                  onClick={() => handleEnroll(course)}
                  className="bg-dorado hover:bg-dorado/90 text-white"
                  data-testid={`button-enroll-${course.id}`}
                >
                  Inscribirse
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Payment Modal */}
      <Dialog open={!!selectedCourse} onOpenChange={() => setSelectedCourse(null)}>
        <DialogContent className="sm:max-w-md" data-testid="dialog-payment">
          <DialogHeader>
            <DialogTitle className="text-2xl text-marron" data-testid="text-modal-title">
              {paymentSuccess ? "¡Inscripción Exitosa!" : "Completar Inscripción"}
            </DialogTitle>
          </DialogHeader>

          {paymentSuccess ? (
            <div className="text-center py-8 space-y-4" data-testid="payment-success">
              <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto" />
              <p className="text-lg text-marron font-semibold">
                ¡Bienvenido a {selectedCourse?.title}!
              </p>
              <p className="text-sm text-gris-medio">
                Procesando tu inscripción...
              </p>
            </div>
          ) : (
            <form onSubmit={handlePayment} className="space-y-4" data-testid="form-payment">
              <div>
                <p className="text-sm text-gris-medio mb-4" data-testid="text-course-selected">
                  Curso: <span className="font-semibold text-marron">{selectedCourse?.title}</span>
                </p>
                <p className="text-2xl font-bold text-dorado mb-6" data-testid="text-price-selected">
                  €{selectedCourse?.price}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="card-name">Nombre en la Tarjeta</Label>
                <Input
                  id="card-name"
                  placeholder="Juan Pérez"
                  required
                  data-testid="input-card-name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="card-number">Número de Tarjeta</Label>
                <Input
                  id="card-number"
                  placeholder="1234 5678 9012 3456"
                  required
                  data-testid="input-card-number"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="card-expiry">Fecha de Vencimiento</Label>
                  <Input
                    id="card-expiry"
                    placeholder="MM/YY"
                    required
                    data-testid="input-card-expiry"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="card-cvv">CVV</Label>
                  <Input
                    id="card-cvv"
                    placeholder="123"
                    required
                    data-testid="input-card-cvv"
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-dorado hover:bg-dorado/90 text-white"
                data-testid="button-submit-payment"
              >
                Confirmar Pago
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
