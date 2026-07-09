export function shortDate(dateString) {
  const d = new Date(dateString + "T00:00:00");
  return `${d.toLocaleString("es-AR", { month: "short" })} ${String(d.getDate()).padStart(2, "0")}`;
}

export function formatHumanDate(dateString) {
  const d = new Date(dateString + "T00:00:00");
  return d.toLocaleDateString("es-AR", { weekday: "short", day: "numeric", month: "short" });
}

export function todayString() {
  const today = new Date();
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
}

export function currentTimeString(date = new Date()) {
  return date.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" });
}

export function longTodayString(date = new Date()) {
  return date.toLocaleDateString("es-AR", {
    weekday: "long",
    day: "numeric",
    month: "long"
  });
}

export function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Buenos días";
  if (h < 20) return "Buenas tardes";
  return "Buenas noches";
}

export function smartMessage(todayEvents, nextEvent) {
  const count = todayEvents.length;

  if (count === 0) {
    return "Hoy está bastante tranquilo. Aprovechá para descansar o adelantar algo pendiente.";
  }

  if (count === 1) {
    return "Solo tenés un compromiso hoy. El resto del día es tuyo.";
  }

  if (count <= 3) {
    return `Hoy tenés ${count} eventos. Se ve manejable.`;
  }

  if (count <= 6) {
    return `Hoy viene cargado: son ${count} eventos. Mejor ir de a uno.`;
  }

  return `Hoy tenés ${count} eventos. No olvides descansar entre medio.`;
}

export function weekRange(date = new Date()) {
  const day = date.getDay();
  const mondayOffset = day === 0 ? -6 : 1 - day;
  const monday = new Date(date);
  monday.setDate(date.getDate() + mondayOffset);
  monday.setHours(0, 0, 0, 0);

  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);

  return { monday, sunday };
}

export function isDateInCurrentWeek(dateString) {
  const d = new Date(dateString + "T12:00:00");
  const { monday, sunday } = weekRange();
  return d >= monday && d <= sunday;
}
