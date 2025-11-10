import { useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, BookOpen, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Course {
  id: string;
  title: string;
  description: string;
  shortDescription: string;
  price: string;
  durationWeeks: number;
  level: string;
  imageUrl: string;
  isFeatured: boolean;
  isPublished: boolean;
  createdAt: string;
}

export default function AdminCourses() {
  const [, setLocation] = useLocation();
  const { user, isLoading: authLoading } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (!authLoading && (!user || user.role !== "admin")) {
      setLocation("/");
    }
  }, [user, authLoading, setLocation]);

  const { data: courses = [], isLoading } = useQuery<Course[]>({
    queryKey: ["/api/admin/courses"],
    enabled: user?.role === "admin",
  });

  const publishMutation = useMutation({
    mutationFn: async ({ courseId, isPublished }: { courseId: string; isPublished: boolean }) => {
      return apiRequest("PATCH", `/api/admin/courses/${courseId}/publish`, { isPublished });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/courses"] });
      toast({
        title: "Curso actualizado",
        description: "El estado de publicación ha sido actualizado exitosamente",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "No se pudo actualizar el curso",
        variant: "destructive",
      });
    },
  });

  const featureMutation = useMutation({
    mutationFn: async ({ courseId, isFeatured }: { courseId: string; isFeatured: boolean }) => {
      return apiRequest("PATCH", `/api/admin/courses/${courseId}/feature`, { isFeatured });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/courses"] });
      toast({
        title: "Curso actualizado",
        description: "El estado destacado ha sido actualizado exitosamente",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "No se pudo actualizar el curso",
        variant: "destructive",
      });
    },
  });

  if (authLoading || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-dorado border-t-transparent"></div>
          <p className="mt-4 text-gris-medio">Cargando cursos...</p>
        </div>
      </div>
    );
  }

  const publishedCount = courses.filter(c => c.isPublished).length;
  const featuredCount = courses.filter(c => c.isFeatured).length;

  return (
    <div className="min-h-screen bg-crema dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => setLocation("/admin")}
            className="mb-4"
            data-testid="button-back"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver al Dashboard
          </Button>
          <h1 className="text-4xl font-bold text-marron dark:text-white mb-2" data-testid="text-courses-title">
            Gestión de Cursos
          </h1>
          <p className="text-gris-medio dark:text-gray-400">
            Total: {courses.length} • Publicados: {publishedCount} • Destacados: {featuredCount}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {courses.map((course) => (
            <Card key={course.id} className="hover-elevate" data-testid={`card-course-${course.id}`}>
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row gap-6">
                  <div className="flex-shrink-0">
                    <img
                      src={course.imageUrl}
                      alt={course.title}
                      className="w-full lg:w-48 h-32 object-cover rounded-lg"
                    />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div>
                        <h3 className="text-xl font-semibold text-marron dark:text-white mb-1" data-testid={`text-course-title-${course.id}`}>
                          {course.title}
                        </h3>
                        <p className="text-sm text-gris-medio dark:text-gray-400 line-clamp-2">
                          {course.shortDescription}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        {course.isPublished && (
                          <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                            Publicado
                          </Badge>
                        )}
                        {!course.isPublished && (
                          <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100">
                            Borrador
                          </Badge>
                        )}
                        {course.isFeatured && (
                          <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100">
                            <Star className="h-3 w-3 mr-1" />
                            Destacado
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4 mb-4">
                      <div className="text-sm">
                        <span className="text-gris-medio">Precio:</span>
                        <span className="ml-1 font-semibold text-marron dark:text-white">€{course.price}</span>
                      </div>
                      <div className="text-sm">
                        <span className="text-gris-medio">Duración:</span>
                        <span className="ml-1 font-semibold text-marron dark:text-white">{course.durationWeeks} sem</span>
                      </div>
                      <div className="text-sm">
                        <span className="text-gris-medio">Nivel:</span>
                        <span className="ml-1 font-semibold text-marron dark:text-white capitalize">{course.level}</span>
                      </div>
                      <div className="text-sm text-gris-claro dark:text-gray-500">
                        {new Date(course.createdAt).toLocaleDateString('es-ES')}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant={course.isPublished ? "outline" : "default"}
                        size="sm"
                        onClick={() => publishMutation.mutate({ courseId: course.id, isPublished: !course.isPublished })}
                        disabled={publishMutation.isPending}
                        data-testid={`button-publish-${course.id}`}
                      >
                        {course.isPublished ? "Despublicar" : "Publicar"}
                      </Button>
                      <Button
                        variant={course.isFeatured ? "outline" : "secondary"}
                        size="sm"
                        onClick={() => featureMutation.mutate({ courseId: course.id, isFeatured: !course.isFeatured })}
                        disabled={featureMutation.isPending || !course.isPublished}
                        data-testid={`button-feature-${course.id}`}
                      >
                        <Star className={`h-4 w-4 mr-1 ${course.isFeatured ? 'fill-current' : ''}`} />
                        {course.isFeatured ? "Quitar Destacado" : "Destacar"}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {courses.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <BookOpen className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <p className="text-xl text-gris-medio">No hay cursos disponibles</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
