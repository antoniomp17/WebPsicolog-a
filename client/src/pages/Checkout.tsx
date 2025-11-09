// Reference: Stripe integration blueprint (blueprint:javascript_stripe)
import { useStripe, Elements, PaymentElement, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useEffect, useState } from 'react';
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLocation, useRoute } from 'wouter';
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";

if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  throw new Error('Missing required Stripe key: VITE_STRIPE_PUBLIC_KEY');
}
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const CheckoutForm = ({ enrollmentId }: { enrollmentId: string }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/pago-exitoso?enrollmentId=${enrollmentId}`,
      },
    });

    setIsProcessing(false);

    if (error) {
      toast({
        title: "Error en el pago",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6" data-testid="form-checkout">
      <PaymentElement />
      <Button 
        type="submit" 
        className="w-full" 
        disabled={!stripe || isProcessing}
        data-testid="button-submit-payment"
      >
        {isProcessing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Procesando pago...
          </>
        ) : (
          'Pagar ahora'
        )}
      </Button>
    </form>
  );
};

export default function Checkout() {
  const [, params] = useRoute('/checkout/:enrollmentId');
  const enrollmentId = params?.enrollmentId;
  const [clientSecret, setClientSecret] = useState("");
  const [error, setError] = useState("");
  const [, setLocation] = useLocation();
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      setLocation('/login');
      return;
    }

    if (!enrollmentId) {
      setError("ID de inscripción no proporcionado");
      return;
    }

    apiRequest<{ clientSecret: string }>("POST", "/api/create-payment-intent", { enrollmentId })
      .then((data) => {
        setClientSecret(data.clientSecret);
      })
      .catch((err) => {
        setError(err.message || "Error al crear intención de pago");
      });
  }, [enrollmentId, authLoading, isAuthenticated, setLocation]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-crema">
        <Loader2 className="h-8 w-8 animate-spin text-dorado" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-crema px-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <div className="flex items-center gap-2 text-destructive">
              <XCircle className="h-6 w-6" />
              <CardTitle>Error</CardTitle>
            </div>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => setLocation('/acceso-alumnos')}
              className="w-full"
              data-testid="button-back-to-courses"
            >
              Volver a Mis Cursos
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!clientSecret) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-crema">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle>Preparando el pago...</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-dorado" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-crema py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Completar Pago</CardTitle>
            <CardDescription>
              Ingresa los datos de tu tarjeta para completar la inscripción al curso
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Elements stripe={stripePromise} options={{ clientSecret }}>
              <CheckoutForm enrollmentId={enrollmentId!} />
            </Elements>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
