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

export function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Buenos días";
  if (h < 20) return "Buenas tardes";
  return "Buenas noches";
}

export function smartMessage(count) {
  if (count === 0) return "Hoy no tenés eventos. Disfrutá el día.";
  if (count <= 2) return `Hoy tenés ${count} evento(s). Día tranqui.`;
  if (count <= 5) return `Hoy tenés ${count} eventos. Organizate con calma.`;
  return `Hoy tenés ${count} eventos. No olvides descansar.`;
}
