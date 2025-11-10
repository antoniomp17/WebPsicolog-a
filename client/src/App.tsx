import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import Home from "@/pages/Home";
import About from "@/pages/About";
import Services from "@/pages/Services";
import Courses from "@/pages/Courses";
import Blog from "@/pages/Blog";
import StudentArea from "@/pages/StudentArea";
import Booking from "@/pages/Booking";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Checkout from "@/pages/Checkout";
import PaymentSuccess from "@/pages/PaymentSuccess";
import AdminDashboard from "@/pages/AdminDashboard";
import AdminUsers from "@/pages/AdminUsers";
import AdminCourses from "@/pages/AdminCourses";
import AdminAppointments from "@/pages/AdminAppointments";
import AdminEnrollments from "@/pages/AdminEnrollments";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/sobre-mi" component={About} />
          <Route path="/terapia" component={Services} />
          <Route path="/cursos" component={Courses} />
          <Route path="/articulos" component={Blog} />
          <Route path="/alumnos" component={StudentArea} />
          <Route path="/acceso-alumnos" component={StudentArea} />
          <Route path="/agendar" component={Booking} />
          <Route path="/login" component={Login} />
          <Route path="/registro" component={Register} />
          <Route path="/checkout/:enrollmentId" component={Checkout} />
          <Route path="/pago-exitoso" component={PaymentSuccess} />
          <Route path="/admin" component={AdminDashboard} />
          <Route path="/admin/users" component={AdminUsers} />
          <Route path="/admin/courses" component={AdminCourses} />
          <Route path="/admin/appointments" component={AdminAppointments} />
          <Route path="/admin/enrollments" component={AdminEnrollments} />
          <Route component={NotFound} />
        </Switch>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
