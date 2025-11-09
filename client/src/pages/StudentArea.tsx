import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BookOpen, User, Mail, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { InsertStudent } from "@shared/schema";

export default function StudentArea() {
  const [isRegistered, setIsRegistered] = useState(false);
  const [studentName, setStudentName] = useState("");
  const { toast } = useToast();

  const registerMutation = useMutation({
    mutationFn: async (data: InsertStudent) => {
      return await apiRequest<{ id: string; name: string; email: string; createdAt: Date }>("POST", "/api/students", data);
    },
    onSuccess: (data) => {
      setStudentName(data.name);
      setIsRegistered(true);
      toast({
        title: "¡Registro completado!",
        description: "Tu perfil ha sido creado exitosamente. Pronto recibirás un email de confirmación.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error al registrar",
        description: error.message || "Hubo un problema al crear tu perfil. Por favor, intenta de nuevo.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data: InsertStudent = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
    };
    registerMutation.mutate(data);
  };

  if (isRegistered) {
    return (
      <div className="animate-fade-in max-w-4xl mx-auto">
        <Card className="shadow-lg border-card-border">
          <CardHeader className="text-center">
            <div className="w-20 h-20 rounded-full bg-dorado/10 mx-auto mb-4 flex items-center justify-center">
              <User className="w-10 h-10 text-dorado" />
            </div>
            <CardTitle className="text-3xl text-marron mb-2" data-testid="text-welcome">
              ¡Bienvenido, {studentName}!
            </CardTitle>
            <p className="text-gris-medio" data-testid="text-welcome-message">
              Tu perfil ha sido registrado exitosamente
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-secondary p-6 rounded-lg">
              <h3 className="font-semibold text-marron mb-2">Próximos Pasos</h3>
              <ul className="space-y-2 text-sm text-gris-medio">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-dorado mt-2 flex-shrink-0"></div>
                  <span>Revisa tu email para confirmar tu cuenta</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-dorado mt-2 flex-shrink-0"></div>
                  <span>Explora los cursos disponibles y selecciona el que más te interese</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-dorado mt-2 flex-shrink-0"></div>
                  <span>Una vez inscrito, recibirás acceso a la plataforma de aprendizaje</span>
                </li>
              </ul>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <Card className="border-card-border">
                <CardContent className="p-6">
                  <BookOpen className="w-8 h-8 text-dorado mb-3" />
                  <h4 className="font-semibold text-marron mb-2">Mis Cursos</h4>
                  <p className="text-sm text-gris-medio mb-4">
                    Aún no estás inscrito en ningún curso. Explora nuestro catálogo.
                  </p>
                  <Button variant="secondary" className="w-full" data-testid="button-view-courses">
                    Ver Cursos
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-card-border">
                <CardContent className="p-6">
                  <Mail className="w-8 h-8 text-dorado mb-3" />
                  <h4 className="font-semibold text-marron mb-2">Soporte</h4>
                  <p className="text-sm text-gris-medio mb-4">
                    ¿Necesitas ayuda? Estamos aquí para ti.
                  </p>
                  <Button variant="secondary" className="w-full" data-testid="button-contact">
                    Contactar
                  </Button>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <section className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-marron mb-4" data-testid="text-student-area-title">
          Área de Alumnos
        </h1>
        <p className="text-lg text-gris-medio max-w-3xl mx-auto" data-testid="text-student-area-subtitle">
          Regístrate para acceder a tus cursos y recursos exclusivos
        </p>
      </section>

      {/* Registration Form */}
      <div className="max-w-md mx-auto">
        <Card className="shadow-lg border-card-border">
          <CardHeader>
            <CardTitle className="text-2xl text-marron text-center" data-testid="text-register-title">
              Crear Perfil de Alumno
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4" data-testid="form-student-register">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre Completo</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Juan Pérez"
                  required
                  data-testid="input-name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Correo Electrónico</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="juan@ejemplo.com"
                  required
                  data-testid="input-email"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-dorado hover:bg-dorado/90 text-white"
                disabled={registerMutation.isPending}
                data-testid="button-register"
              >
                {registerMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Registrando...
                  </>
                ) : (
                  "Registrarse"
                )}
              </Button>
            </form>

            <div className="mt-6 p-4 bg-secondary rounded-lg">
              <h4 className="font-semibold text-marron text-sm mb-2">Beneficios de Registrarte</h4>
              <ul className="space-y-2 text-sm text-gris-medio">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-dorado mt-2 flex-shrink-0"></div>
                  <span>Acceso a todos tus cursos en un solo lugar</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-dorado mt-2 flex-shrink-0"></div>
                  <span>Material descargable y recursos exclusivos</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-dorado mt-2 flex-shrink-0"></div>
                  <span>Seguimiento de tu progreso</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-dorado mt-2 flex-shrink-0"></div>
                  <span>Certificados al completar los cursos</span>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
