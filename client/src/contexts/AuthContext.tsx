import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { FrontendUser } from "@shared/schema";

interface AuthContextType {
  user: FrontendUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role?: "student" | "admin" | "therapist") => Promise<void>;
  logout: () => void;
  token: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(localStorage.getItem("auth_token"));
  const queryClient = useQueryClient();

  // Fetch current user if token exists
  const { data: user = null, isLoading } = useQuery<FrontendUser | null>({
    queryKey: ["/api/auth/me"],
    enabled: !!token,
    retry: false,
    queryFn: async () => {
      const response = await fetch("/api/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        // If token is invalid, clear it
        localStorage.removeItem("auth_token");
        setToken(null);
        return null;
      }
      return response.json();
    },
  });

  const loginMutation = useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      const response = await apiRequest("POST", "/api/auth/login", { email, password });
      return response;
    },
    onSuccess: (data) => {
      localStorage.setItem("auth_token", data.token);
      setToken(data.token);
      queryClient.setQueryData(["/api/auth/me"], data.user);
    },
  });

  const registerMutation = useMutation({
    mutationFn: async ({ 
      name, 
      email, 
      password,
      role = "student" as "student" | "admin" | "therapist"
    }: { 
      name: string; 
      email: string; 
      password: string;
      role?: "student" | "admin" | "therapist";
    }) => {
      const response = await apiRequest("POST", "/api/auth/register", { name, email, password, role });
      return response;
    },
    onSuccess: (data) => {
      localStorage.setItem("auth_token", data.token);
      setToken(data.token);
      queryClient.setQueryData(["/api/auth/me"], data.user);
    },
  });

  const login = async (email: string, password: string) => {
    await loginMutation.mutateAsync({ email, password });
  };

  const register = async (name: string, email: string, password: string, role: "student" | "admin" | "therapist" = "student") => {
    await registerMutation.mutateAsync({ name, email, password, role });
  };

  const logout = () => {
    localStorage.removeItem("auth_token");
    setToken(null);
    queryClient.setQueryData(["/api/auth/me"], null);
    queryClient.clear();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
