import { useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, DollarSign, CheckCircle, Clock, XCircle } from "lucide-react";

interface Enrollment {
  id: string;
  userId: string;
  courseId: string;
  enrolledAt: string;
  completedAt: string | null;
  progressPercentage: string;
  paymentStatus: "pending" | "completed" | "refunded";
  stripePaymentId: string | null;
  createdAt: string;
  user?: {
    fullName: string;
    email: string;
  };
  course?: {
    title: string;
    price: string;
  };
}

export default function AdminEnrollments() {
  const [, setLocation] = useLocation();
  const { user, isLoading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && (!user || user.role !== "admin")) {
      setLocation("/");
    }
  }, [user, authLoading, setLocation]);

  const { data: enrollments = [], isLoading } = useQuery<Enrollment[]>({
    queryKey: ["/api/admin/enrollments"],
    enabled: user?.role === "admin",
  });

  if (authLoading || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-dorado border-t-transparent"></div>
          <p className="mt-4 text-gris-medio">Cargando inscripciones...</p>
        </div>
      </div>
    );
  }

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return {
          color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
          label: "Pagado",
          icon: CheckCircle,
        };
      case "pending":
        return {
          color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100",
          label: "Pendiente",
          icon: Clock,
        };
      case "refunded":
        return {
          color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100",
          label: "Reembolsado",
          icon: XCircle,
        };
      default:
        return {
          color: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100",
          label: status,
          icon: DollarSign,
        };
    }
  };

  const totalRevenue = enrollments
    .filter(e => e.paymentStatus === "completed" && e.course?.price)
    .reduce((sum, e) => sum + parseFloat(e.course!.price), 0);

  const paymentCounts = enrollments.reduce((acc, enr) => {
    acc[enr.paymentStatus] = (acc[enr.paymentStatus] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

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
          <h1 className="text-4xl font-bold text-marron dark:text-white mb-2" data-testid="text-enrollments-title">
            Pagos e Inscripciones
          </h1>
          <p className="text-gris-medio dark:text-gray-400">
            Total: {enrollments.length} • Pagados: {paymentCounts.completed || 0} • Pendientes: {paymentCounts.pending || 0} • Ingresos: €{totalRevenue.toFixed(2)}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {enrollments.map((enrollment) => {
            const paymentBadge = getPaymentStatusBadge(enrollment.paymentStatus);
            const PaymentIcon = paymentBadge.icon;
            
            return (
              <Card key={enrollment.id} className="hover-elevate" data-testid={`card-enrollment-${enrollment.id}`}>
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-marron dark:text-white" data-testid={`text-enrollment-user-${enrollment.id}`}>
                          {enrollment.user?.fullName || "Usuario desconocido"}
                        </h3>
                        <Badge className={paymentBadge.color} data-testid={`badge-payment-${enrollment.id}`}>
                          <PaymentIcon className="h-3 w-3 mr-1" />
                          {paymentBadge.label}
                        </Badge>
                      </div>
                      <p className="text-sm text-gris-medio dark:text-gray-400 mb-1">
                        {enrollment.user?.email || "Sin email"}
                      </p>
                      <p className="text-sm font-semibold text-marron dark:text-white mb-2">
                        {enrollment.course?.title || "Curso desconocido"}
                      </p>
                      <div className="flex flex-wrap gap-4 text-sm text-gris-medio">
                        <span>
                          Inscrito: {new Date(enrollment.enrolledAt).toLocaleDateString('es-ES')}
                        </span>
                        <span>
                          Progreso: {enrollment.progressPercentage}%
                        </span>
                        {enrollment.completedAt && (
                          <span className="text-green-600 dark:text-green-400">
                            ✓ Completado: {new Date(enrollment.completedAt).toLocaleDateString('es-ES')}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <div className="text-2xl font-bold text-marron dark:text-white">
                        €{enrollment.course?.price || "0.00"}
                      </div>
                      {enrollment.stripePaymentId && (
                        <div className="text-xs text-gris-claro dark:text-gray-500 font-mono">
                          {enrollment.stripePaymentId.substring(0, 20)}...
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {enrollments.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <DollarSign className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <p className="text-xl text-gris-medio">No hay inscripciones registradas</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
