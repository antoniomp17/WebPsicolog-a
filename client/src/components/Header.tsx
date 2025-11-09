import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";

export default function Header() {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();

  const navLinks = [
    { href: "/", label: "Inicio" },
    { href: "/sobre-mi", label: "Sobre Mí" },
    { href: "/terapia", label: "Terapia" },
    { href: "/cursos", label: "Cursos" },
    { href: "/articulos", label: "Artículos" },
    { href: "/alumnos", label: "Acceso Alumnos" },
  ];

  const isActive = (href: string) => {
    if (href === "/") return location === "/";
    return location.startsWith(href);
  };

  return (
    <header className="bg-white/90 backdrop-blur-sm shadow-sm sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" data-testid="link-home">
            <span className="text-2xl font-bold text-marron hover:text-dorado transition-colors cursor-pointer">
              PsicoBienestar
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} data-testid={`link-${link.label.toLowerCase().replace(/\s+/g, '-')}`}>
                <span
                  className={`cursor-pointer transition-colors ${
                    isActive(link.href)
                      ? "text-dorado font-semibold"
                      : "text-marron hover:text-dorado"
                  }`}
                >
                  {link.label}
                </span>
              </Link>
            ))}
            <Link href="/agendar" data-testid="link-agendar">
              <Button className="bg-dorado hover:bg-dorado/90 text-white shadow-md">
                Agendar Cita
              </Button>
            </Link>
            
            {/* Auth buttons */}
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2" data-testid="button-user-menu">
                    <User className="h-4 w-4" />
                    <span>{user?.name}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/alumnos">
                      <span className="cursor-pointer w-full">Mis Cursos</span>
                    </Link>
                  </DropdownMenuItem>
                  {user?.role === "admin" && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin">
                        <span className="cursor-pointer w-full">Panel Admin</span>
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} data-testid="button-logout">
                    <LogOut className="h-4 w-4 mr-2" />
                    Cerrar Sesión
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login" data-testid="link-login">
                  <Button variant="ghost" className="text-marron hover:text-dorado">
                    Iniciar Sesión
                  </Button>
                </Link>
                <Link href="/registro" data-testid="link-registro">
                  <Button className="bg-dorado hover:bg-dorado/90 text-white">
                    Registrarse
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              data-testid="button-mobile-menu"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6 text-marron" />
              ) : (
                <Menu className="h-6 w-6 text-marron" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 space-y-2 animate-fade-in">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} data-testid={`mobile-link-${link.label.toLowerCase().replace(/\s+/g, '-')}`}>
                <span
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-3 py-2 rounded-md cursor-pointer transition-colors ${
                    isActive(link.href)
                      ? "bg-secondary text-dorado font-semibold"
                      : "text-marron hover:bg-secondary"
                  }`}
                >
                  {link.label}
                </span>
              </Link>
            ))}
            <Link href="/agendar" data-testid="mobile-link-agendar">
              <Button
                onClick={() => setMobileMenuOpen(false)}
                className="w-full bg-dorado hover:bg-dorado/90 text-white"
              >
                Agendar Cita
              </Button>
            </Link>
            
            {/* Mobile Auth buttons */}
            {isAuthenticated ? (
              <div className="space-y-2 pt-2 border-t border-border">
                <div className="px-3 py-2 text-sm font-semibold text-marron">
                  {user?.name}
                </div>
                {user?.role === "admin" && (
                  <Link href="/admin">
                    <span
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-3 py-2 rounded-md cursor-pointer transition-colors text-marron hover:bg-secondary"
                    >
                      Panel Admin
                    </span>
                  </Link>
                )}
                <Button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  variant="ghost"
                  className="w-full justify-start text-left"
                  data-testid="mobile-button-logout"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Cerrar Sesión
                </Button>
              </div>
            ) : (
              <div className="space-y-2 pt-2 border-t border-border">
                <Link href="/login" data-testid="mobile-link-login">
                  <Button
                    onClick={() => setMobileMenuOpen(false)}
                    variant="ghost"
                    className="w-full"
                  >
                    Iniciar Sesión
                  </Button>
                </Link>
                <Link href="/registro" data-testid="mobile-link-registro">
                  <Button
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full bg-dorado hover:bg-dorado/90 text-white"
                  >
                    Registrarse
                  </Button>
                </Link>
              </div>
            )}
          </div>
        )}
      </nav>
    </header>
  );
}
