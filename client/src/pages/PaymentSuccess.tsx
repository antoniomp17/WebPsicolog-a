import { useEffect, useState } from 'react';
import { useLocation, useRoute } from 'wouter';
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Loader2 } from "lucide-react";
import { queryClient } from "@/lib/queryClient";

export default function PaymentSuccess() {
  const [, params] = useRoute('/pago-exitoso');
  const [, setLocation] = useLocation();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [isRefreshing, setIsRefreshing] = useState(true);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      setLocation('/login');
      return;
    }

    // Invalidate enrollments cache to refetch updated payment status
    const refreshData = async () => {
      await queryClient.invalidateQueries({ queryKey: ['/api/enrollments'] });
      setIsRefreshing(false);
    };

    // Wait a moment for webhook to process
    const timer = setTimeout(() => {
      refreshData();
    }, 2000);

    return () => clearTimeout(timer);
  }, [authLoading, isAuthenticated, setLocation]);

  if (authLoading || isRefreshing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-crema">
        <Card className="max-w-md w-full">
          <CardContent className="flex flex-col items-center gap-4 py-8">
            <Loader2 className="h-12 w-12 animate-spin text-dorado" />
            <p className="text-lg text-marron">Verificando tu pago...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-crema px-4">
      <Card className="max-w-md w-full" data-testid="card-payment-success">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-green-100 p-3">
              <CheckCircle2 className="h-12 w-12 text-green-600" />
            </div>
          </div>
          <CardTitle className="text-2xl">¡Pago exitoso!</CardTitle>
          <CardDescription className="text-base">
            Tu pago se ha procesado correctamente
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-marron-secondary">
            Ya puedes acceder a tu curso. Te hemos enviado un correo de confirmación con los detalles.
          </p>
          <div className="flex flex-col gap-2">
            <Button 
              onClick={() => setLocation('/acceso-alumnos')}
              className="w-full"
              data-testid="button-go-to-courses"
            >
              Ir a Mis Cursos
            </Button>
            <Button 
              onClick={() => setLocation('/cursos')}
              variant="outline"
              className="w-full"
              data-testid="button-browse-courses"
            >
              Explorar más cursos
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
