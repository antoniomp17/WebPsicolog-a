import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Trash2, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface User {
  id: string;
  email: string;
  fullName: string;
  role: "student" | "admin" | "therapist";
  createdAt: string;
}

export default function AdminUsers() {
  const [, setLocation] = useLocation();
  const { user, isLoading: authLoading } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (!authLoading && (!user || user.role !== "admin")) {
      setLocation("/");
    }
  }, [user, authLoading, setLocation]);

  const { data: users = [], isLoading, refetch } = useQuery<User[]>({
    queryKey: ["/api/admin/users"],
    enabled: user?.role === "admin",
  });

  const updateRoleMutation = useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: string }) => {
      return apiRequest("PATCH", `/api/admin/users/${userId}/role`, { role });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      toast({
        title: "Rol actualizado",
        description: "El rol del usuario ha sido actualizado exitosamente",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "No se pudo actualizar el rol",
        variant: "destructive",
      });
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      return apiRequest("DELETE", `/api/admin/users/${userId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      toast({
        title: "Usuario eliminado",
        description: "El usuario ha sido eliminado exitosamente",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "No se pudo eliminar el usuario",
        variant: "destructive",
      });
    },
  });

  if (authLoading || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-dorado border-t-transparent"></div>
          <p className="mt-4 text-gris-medio">Cargando usuarios...</p>
        </div>
      </div>
    );
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100";
      case "therapist":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100";
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "admin":
        return "Administrador";
      case "therapist":
        return "Terapeuta";
      default:
        return "Estudiante";
    }
  };

  return (
    <div className="min-h-screen bg-crema dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <Button
              variant="ghost"
              onClick={() => setLocation("/admin")}
              className="mb-4"
              data-testid="button-back"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver al Dashboard
            </Button>
            <h1 className="text-4xl font-bold text-marron dark:text-white mb-2" data-testid="text-users-title">
              Gestión de Usuarios
            </h1>
            <p className="text-gris-medio dark:text-gray-400">
              Total de usuarios: {users.length}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {users.map((userItem) => (
            <Card key={userItem.id} className="hover-elevate" data-testid={`card-user-${userItem.id}`}>
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-marron dark:text-white" data-testid={`text-user-name-${userItem.id}`}>
                        {userItem.fullName}
                      </h3>
                      <Badge className={getRoleBadgeColor(userItem.role)} data-testid={`badge-role-${userItem.id}`}>
                        {getRoleLabel(userItem.role)}
                      </Badge>
                    </div>
                    <p className="text-sm text-gris-medio dark:text-gray-400" data-testid={`text-user-email-${userItem.id}`}>
                      {userItem.email}
                    </p>
                    <p className="text-xs text-gris-claro dark:text-gray-500 mt-1">
                      Registrado: {new Date(userItem.createdAt).toLocaleDateString('es-ES')}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <select
                      value={userItem.role}
                      onChange={(e) => updateRoleMutation.mutate({ userId: userItem.id, role: e.target.value })}
                      className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-marron dark:text-white text-sm"
                      disabled={userItem.id === user?.id}
                      data-testid={`select-role-${userItem.id}`}
                    >
                      <option value="student">Estudiante</option>
                      <option value="therapist">Terapeuta</option>
                      <option value="admin">Administrador</option>
                    </select>

                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => {
                        if (confirm("¿Estás seguro de que quieres eliminar este usuario?")) {
                          deleteUserMutation.mutate(userItem.id);
                        }
                      }}
                      disabled={userItem.id === user?.id}
                      data-testid={`button-delete-${userItem.id}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {users.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <Shield className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <p className="text-xl text-gris-medio">No hay usuarios registrados</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
