import { useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, BookOpen, Calendar, DollarSign, TrendingUp, CheckCircle } from "lucide-react";

interface DashboardStats {
  totalUsers: number;
  totalCourses: number;
  publishedCourses: number;
  totalAppointments: number;
  appointmentsThisWeek: number;
  totalEnrollments: number;
  completedEnrollments: number;
  totalRevenue: string;
}

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const { user, isLoading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && (!user || user.role !== "admin")) {
      setLocation("/");
    }
  }, [user, authLoading, setLocation]);

  const { data: stats, isLoading } = useQuery<DashboardStats>({
    queryKey: ["/api/admin/dashboard"],
    enabled: user?.role === "admin",
  });

  if (authLoading || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-dorado border-t-transparent"></div>
          <p className="mt-4 text-gris-medio">Cargando estadísticas...</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  const statCards = [
    {
      title: "Total Usuarios",
      value: stats.totalUsers,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-950",
    },
    {
      title: "Cursos Publicados",
      value: `${stats.publishedCourses}/${stats.totalCourses}`,
      icon: BookOpen,
      color: "text-green-600",
      bgColor: "bg-green-50 dark:bg-green-950",
    },
    {
      title: "Citas Esta Semana",
      value: stats.appointmentsThisWeek,
      icon: Calendar,
      color: "text-purple-600",
      bgColor: "bg-purple-50 dark:bg-purple-950",
    },
    {
      title: "Ingresos Totales",
      value: `€${stats.totalRevenue}`,
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-50 dark:bg-green-950",
    },
    {
      title: "Total Citas",
      value: stats.totalAppointments,
      icon: TrendingUp,
      color: "text-orange-600",
      bgColor: "bg-orange-50 dark:bg-orange-950",
    },
    {
      title: "Inscripciones Completadas",
      value: `${stats.completedEnrollments}/${stats.totalEnrollments}`,
      icon: CheckCircle,
      color: "text-teal-600",
      bgColor: "bg-teal-50 dark:bg-teal-950",
    },
  ];

  return (
    <div className="min-h-screen bg-crema dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-marron dark:text-white mb-2" data-testid="text-admin-title">
            Panel de Administración
          </h1>
          <p className="text-gris-medio dark:text-gray-400" data-testid="text-admin-subtitle">
            Bienvenido, {user?.name}. Aquí puedes gestionar toda la plataforma.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="hover-elevate active-elevate-2" data-testid={`card-stat-${index}`}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gris-medio dark:text-gray-400">
                    {stat.title}
                  </CardTitle>
                  <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                    <Icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-marron dark:text-white" data-testid={`text-stat-value-${index}`}>
                    {stat.value}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-marron dark:text-white">Acciones Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <button
                onClick={() => setLocation("/admin/users")}
                className="w-full text-left px-4 py-3 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
                data-testid="button-manage-users"
              >
                <div className="flex items-center">
                  <Users className="h-5 w-5 text-dorado mr-3" />
                  <div>
                    <p className="font-semibold text-marron dark:text-white">Gestionar Usuarios</p>
                    <p className="text-sm text-gris-medio">Ver y administrar todos los usuarios</p>
                  </div>
                </div>
              </button>
              <button
                onClick={() => setLocation("/admin/courses")}
                className="w-full text-left px-4 py-3 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
                data-testid="button-manage-courses"
              >
                <div className="flex items-center">
                  <BookOpen className="h-5 w-5 text-dorado mr-3" />
                  <div>
                    <p className="font-semibold text-marron dark:text-white">Gestionar Cursos</p>
                    <p className="text-sm text-gris-medio">Publicar, editar y destacar cursos</p>
                  </div>
                </div>
              </button>
              <button
                onClick={() => setLocation("/admin/appointments")}
                className="w-full text-left px-4 py-3 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
                data-testid="button-manage-appointments"
              >
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-dorado mr-3" />
                  <div>
                    <p className="font-semibold text-marron dark:text-white">Gestionar Citas</p>
                    <p className="text-sm text-gris-medio">Ver y actualizar estado de citas</p>
                  </div>
                </div>
              </button>
              <button
                onClick={() => setLocation("/admin/enrollments")}
                className="w-full text-left px-4 py-3 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
                data-testid="button-manage-enrollments"
              >
                <div className="flex items-center">
                  <DollarSign className="h-5 w-5 text-dorado mr-3" />
                  <div>
                    <p className="font-semibold text-marron dark:text-white">Ver Pagos</p>
                    <p className="text-sm text-gris-medio">Gestionar inscripciones y pagos</p>
                  </div>
                </div>
              </button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-marron dark:text-white">Resumen del Sistema</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gris-medio">Cursos Publicados</span>
                  <span className="text-sm font-semibold text-marron dark:text-white">
                    {Math.round((stats.publishedCourses / stats.totalCourses) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-dorado h-2 rounded-full"
                    style={{ width: `${(stats.publishedCourses / stats.totalCourses) * 100}%` }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gris-medio">Inscripciones Completadas</span>
                  <span className="text-sm font-semibold text-marron dark:text-white">
                    {stats.totalEnrollments > 0 
                      ? Math.round((stats.completedEnrollments / stats.totalEnrollments) * 100)
                      : 0}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{ 
                      width: `${stats.totalEnrollments > 0 
                        ? (stats.completedEnrollments / stats.totalEnrollments) * 100 
                        : 0}%` 
                    }}
                  ></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
