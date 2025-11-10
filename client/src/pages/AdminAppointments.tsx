import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Calendar, Video, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Appointment {
  id: string;
  userId: string | null;
  fullName: string;
  email: string;
  date: string;
  time: string;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  notes: string | null;
  videoCallLink: string | null;
  createdAt: string;
}

export default function AdminAppointments() {
  const [, setLocation] = useLocation();
  const { user, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const [videoLinks, setVideoLinks] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!authLoading && (!user || user.role !== "admin")) {
      setLocation("/");
    }
  }, [user, authLoading, setLocation]);

  const { data: appointments = [], isLoading } = useQuery<Appointment[]>({
    queryKey: ["/api/admin/appointments"],
    enabled: user?.role === "admin",
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ appointmentId, status }: { appointmentId: string; status: string }) => {
      return apiRequest("PATCH", `/api/admin/appointments/${appointmentId}/status`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/appointments"] });
      toast({
        title: "Estado actualizado",
        description: "El estado de la cita ha sido actualizado exitosamente",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "No se pudo actualizar el estado",
        variant: "destructive",
      });
    },
  });

  const updateVideoLinkMutation = useMutation({
    mutationFn: async ({ appointmentId, videoCallLink }: { appointmentId: string; videoCallLink: string }) => {
      return apiRequest("PATCH", `/api/admin/appointments/${appointmentId}/video-link`, { videoCallLink });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/appointments"] });
      toast({
        title: "Enlace guardado",
        description: "El enlace de video ha sido guardado exitosamente",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "No se pudo guardar el enlace",
        variant: "destructive",
      });
    },
  });

  if (authLoading || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-dorado border-t-transparent"></div>
          <p className="mt-4 text-gris-medio">Cargando citas...</p>
        </div>
      </div>
    );
  }

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100";
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100";
      case "completed":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100";
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "confirmed":
        return "Confirmada";
      case "pending":
        return "Pendiente";
      case "completed":
        return "Completada";
      case "cancelled":
        return "Cancelada";
      default:
        return status;
    }
  };

  const statusCounts = appointments.reduce((acc, apt) => {
    acc[apt.status] = (acc[apt.status] || 0) + 1;
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
          <h1 className="text-4xl font-bold text-marron dark:text-white mb-2" data-testid="text-appointments-title">
            Gestión de Citas
          </h1>
          <p className="text-gris-medio dark:text-gray-400">
            Total: {appointments.length} • Pendientes: {statusCounts.pending || 0} • Confirmadas: {statusCounts.confirmed || 0}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {appointments.map((appointment) => (
            <Card key={appointment.id} className="hover-elevate" data-testid={`card-appointment-${appointment.id}`}>
              <CardContent className="p-6">
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-marron dark:text-white" data-testid={`text-appointment-name-${appointment.id}`}>
                          {appointment.fullName}
                        </h3>
                        <Badge className={getStatusBadgeColor(appointment.status)} data-testid={`badge-status-${appointment.id}`}>
                          {getStatusLabel(appointment.status)}
                        </Badge>
                      </div>
                      <p className="text-sm text-gris-medio dark:text-gray-400" data-testid={`text-appointment-email-${appointment.id}`}>
                        {appointment.email}
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-sm">
                        <span className="text-gris-medio">
                          <Calendar className="inline h-4 w-4 mr-1" />
                          {new Date(appointment.date).toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </span>
                        <span className="font-semibold text-marron dark:text-white">{appointment.time}</span>
                      </div>
                      {appointment.notes && (
                        <p className="text-sm text-gris-medio mt-2 italic">
                          Notas: {appointment.notes}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-col gap-2">
                      <select
                        value={appointment.status}
                        onChange={(e) => updateStatusMutation.mutate({ appointmentId: appointment.id, status: e.target.value })}
                        className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-marron dark:text-white text-sm"
                        data-testid={`select-status-${appointment.id}`}
                      >
                        <option value="pending">Pendiente</option>
                        <option value="confirmed">Confirmada</option>
                        <option value="completed">Completada</option>
                        <option value="cancelled">Cancelada</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2">
                    <div className="flex-1">
                      <Input
                        type="url"
                        placeholder="https://meet.google.com/xxx-yyyy-zzz"
                        value={videoLinks[appointment.id] ?? appointment.videoCallLink ?? ""}
                        onChange={(e) => setVideoLinks({ ...videoLinks, [appointment.id]: e.target.value })}
                        className="text-sm"
                        data-testid={`input-videolink-${appointment.id}`}
                      />
                    </div>
                    <Button
                      size="sm"
                      onClick={() => {
                        const link = videoLinks[appointment.id] ?? appointment.videoCallLink;
                        if (link) {
                          updateVideoLinkMutation.mutate({ appointmentId: appointment.id, videoCallLink: link });
                        }
                      }}
                      disabled={!videoLinks[appointment.id] && !appointment.videoCallLink}
                      data-testid={`button-save-videolink-${appointment.id}`}
                    >
                      <Save className="h-4 w-4 mr-1" />
                      Guardar Enlace
                    </Button>
                    {appointment.videoCallLink && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => window.open(appointment.videoCallLink!, '_blank')}
                        data-testid={`button-open-videolink-${appointment.id}`}
                      >
                        <Video className="h-4 w-4 mr-1" />
                        Abrir
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {appointments.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <Calendar className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <p className="text-xl text-gris-medio">No hay citas agendadas</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
