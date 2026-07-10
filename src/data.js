export const monthNames = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"
];

export const shortWeekdays = ["D", "L", "M", "M", "J", "V", "S"];

export const defaultCalendars = [
  { id: "academico", name: "Académico", icon: "📚", color: "#7C4D8B" },
  { id: "laboral", name: "Laboral", icon: "💼", color: "#3F5F93" },
  { id: "personal", name: "Personal", icon: "❤️", color: "#B35068" },
  { id: "todos", name: "Todos", icon: "📅", color: "#241029", system: true }
];

export const defaultEvents = [
  { date: "2026-07-04", time: "18:00", text: "Ética fundamental y profesional - Cuestionario N°1", calendarId: "academico" },
  { date: "2026-08-04", time: "09:00", text: "Formulación y evaluación de proyectos - Final", calendarId: "academico" },
  { date: "2026-08-12", time: "10:00", text: "Visita técnica - Depósito documental", calendarId: "laboral" },
  { date: "2026-08-14", time: "15:00", text: "Capacitación orden y limpieza - Mutual", calendarId: "laboral" }
];
