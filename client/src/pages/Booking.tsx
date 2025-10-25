import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, CheckCircle2, Calendar as CalendarIcon, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { InsertAppointment, Appointment } from "@shared/schema";

const MONTH_NAMES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

const DAY_NAMES = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

const TIME_SLOTS = [
  "09:00", "10:00", "11:00", "12:00",
  "14:00", "15:00", "16:00", "17:00", "18:00"
];

export default function Booking() {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch appointments for the selected date
  const { data: appointments = [], isLoading: isLoadingAppointments } = useQuery<Appointment[]>({
    queryKey: ["/api/appointments", selectedDate],
    queryFn: async () => {
      const response = await fetch(`/api/appointments?date=${encodeURIComponent(selectedDate!)}`);
      if (!response.ok) {
        throw new Error("Error al cargar las citas");
      }
      return response.json();
    },
    enabled: !!selectedDate,
  });

  // Get booked time slots for the selected date
  const bookedTimes = appointments.map((apt) => apt.time);

  const bookingMutation = useMutation({
    mutationFn: async (data: InsertAppointment) => {
      return await apiRequest("POST", "/api/appointments", data);
    },
    onSuccess: () => {
      setBookingSuccess(true);
      // Invalidate the specific date query for more precise cache management
      queryClient.invalidateQueries({ queryKey: ["/api/appointments", selectedDate] });
      toast({
        title: "¡Cita agendada exitosamente!",
        description: `Tu sesión ha sido confirmada para el ${selectedDate} a las ${selectedTime}. Recibirás un email de confirmación.`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error al agendar",
        description: error.message || "Hubo un problema al agendar tu cita. Por favor, intenta de nuevo.",
        variant: "destructive",
      });
    },
  });

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month: number, year: number) => {
    return new Date(year, month, 1).getDay();
  };

  const isToday = (day: number) => {
    return (
      day === today.getDate() &&
      currentMonth === today.getMonth() &&
      currentYear === today.getFullYear()
    );
  };

  const isPastDate = (day: number) => {
    const date = new Date(currentYear, currentMonth, day);
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    return date < todayStart;
  };

  const formatDate = (day: number) => {
    return `${day} de ${MONTH_NAMES[currentMonth]}, ${currentYear}`;
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentMonth, currentYear);
    const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
    const days = [];

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-12"></div>);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = formatDate(day);
      const isSelected = selectedDate === dateStr;
      const isTodayDate = isToday(day);
      const isPast = isPastDate(day);

      days.push(
        <button
          key={day}
          onClick={() => {
            if (!isPast) {
              setSelectedDate(dateStr);
              setSelectedTime(null);
            }
          }}
          disabled={isPast}
          className={`
            h-12 rounded-md text-sm font-medium transition-all
            ${isPast ? "text-gris-medio/40 cursor-not-allowed" : "cursor-pointer"}
            ${isTodayDate && !isSelected ? "bg-dorado/20 text-dorado font-semibold" : ""}
            ${isSelected ? "bg-dorado text-white" : "hover:bg-dorado/10"}
            ${!isPast && !isSelected && !isTodayDate ? "hover:bg-secondary" : ""}
          `}
          data-testid={`button-day-${day}`}
        >
          {day}
        </button>
      );
    }

    return days;
  };

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate || !selectedTime) return;

    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const data: InsertAppointment = {
      name: formData.get("book-name") as string,
      email: formData.get("book-email") as string,
      date: selectedDate,
      time: selectedTime,
    };
    
    bookingMutation.mutate(data);
  };

  if (bookingSuccess) {
    return (
      <div className="animate-fade-in max-w-2xl mx-auto">
        <Card className="shadow-lg border-card-border text-center p-8">
          <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto mb-6" data-testid="icon-success" />
          <h2 className="text-3xl font-bold text-marron mb-4" data-testid="text-booking-success">
            ¡Cita Confirmada!
          </h2>
          <div className="bg-secondary p-6 rounded-lg mb-6">
            <p className="text-lg text-marron mb-2" data-testid="text-booking-details">
              <strong>Fecha:</strong> {selectedDate}
            </p>
            <p className="text-lg text-marron" data-testid="text-booking-time">
              <strong>Hora:</strong> {selectedTime}
            </p>
          </div>
          <p className="text-gris-medio mb-6">
            Recibirás un email de confirmación con el enlace para la videollamada.
            Te enviaremos un recordatorio 24 horas antes de tu sesión.
          </p>
          <Button
            onClick={() => {
              setBookingSuccess(false);
              setSelectedDate(null);
              setSelectedTime(null);
            }}
            className="bg-dorado hover:bg-dorado/90 text-white"
            data-testid="button-book-another"
          >
            Agendar Otra Cita
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <section className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-marron mb-4" data-testid="text-booking-title">
          Agendar una Cita
        </h1>
        <p className="text-lg text-gris-medio max-w-3xl mx-auto" data-testid="text-booking-subtitle">
          Selecciona una fecha y hora para tu sesión de terapia individual
        </p>
      </section>

      <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-8">
        {/* Calendar */}
        <Card className="shadow-lg border-card-border">
          <CardHeader>
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="icon"
                onClick={handlePrevMonth}
                data-testid="button-prev-month"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <CardTitle className="text-xl text-marron" data-testid="text-current-month">
                {MONTH_NAMES[currentMonth]} {currentYear}
              </CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleNextMonth}
                data-testid="button-next-month"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {/* Day names */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {DAY_NAMES.map((day) => (
                <div key={day} className="text-center text-xs font-semibold text-gris-medio py-2">
                  {day}
                </div>
              ))}
            </div>
            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-1" data-testid="calendar-grid">
              {renderCalendar()}
            </div>

            {selectedDate && (
              <div className="mt-6 p-4 bg-dorado/10 rounded-lg" data-testid="selected-date-display">
                <p className="text-sm font-semibold text-marron flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4" />
                  Fecha seleccionada: {selectedDate}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Time slots and booking form */}
        <div className="space-y-6">
          {/* Time Slots */}
          {selectedDate && (
            <Card className="shadow-lg border-card-border animate-fade-in">
              <CardHeader>
                <CardTitle className="text-xl text-marron" data-testid="text-select-time">
                  Selecciona una Hora
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoadingAppointments ? (
                  <div className="flex justify-center items-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-dorado" />
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-3" data-testid="time-slots-grid">
                    {TIME_SLOTS.map((time) => {
                      const isBooked = bookedTimes.includes(time);
                      return (
                        <Button
                          key={time}
                          onClick={() => !isBooked && setSelectedTime(time)}
                          variant={selectedTime === time ? "default" : "outline"}
                          disabled={isBooked}
                          className={
                            selectedTime === time
                              ? "bg-dorado hover:bg-dorado/90 text-white border-dorado"
                              : isBooked
                              ? "border-gris-claro text-gris-medio cursor-not-allowed opacity-50"
                              : "border-dorado text-dorado hover:bg-dorado hover:text-white"
                          }
                          data-testid={`button-time-${time}`}
                        >
                          {time}
                        </Button>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Booking Form */}
          {selectedDate && selectedTime && (
            <Card className="shadow-lg border-card-border animate-fade-in">
              <CardHeader>
                <CardTitle className="text-xl text-marron" data-testid="text-confirm-booking">
                  Confirmar Reserva
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-secondary p-4 rounded-lg mb-6">
                  <p className="text-sm text-marron mb-1">
                    <strong>Fecha:</strong> {selectedDate}
                  </p>
                  <p className="text-sm text-marron">
                    <strong>Hora:</strong> {selectedTime}
                  </p>
                </div>

                <form onSubmit={handleBooking} className="space-y-4" data-testid="form-booking">
                  <div className="space-y-2">
                    <Label htmlFor="book-name">Nombre Completo</Label>
                    <Input
                      id="book-name"
                      name="book-name"
                      placeholder="Juan Pérez"
                      required
                      data-testid="input-booking-name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="book-email">Correo Electrónico</Label>
                    <Input
                      id="book-email"
                      name="book-email"
                      type="email"
                      placeholder="juan@ejemplo.com"
                      required
                      data-testid="input-booking-email"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-dorado hover:bg-dorado/90 text-white"
                    disabled={bookingMutation.isPending}
                    data-testid="button-confirm-booking"
                  >
                    {bookingMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Confirmando...
                      </>
                    ) : (
                      "Confirmar Cita"
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
