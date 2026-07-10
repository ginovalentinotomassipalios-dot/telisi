export function sendTodayEventsNotification(events) {
  if (!("Notification" in window)) return;
  if (Notification.permission !== "granted") return;

  const today = new Date().toISOString().split("T")[0];

  const todayEvents = events
    .filter(event => event.date === today)
    .sort((a, b) => a.time.localeCompare(b.time));

  if (todayEvents.length === 0) return;

  const key = `telisi_daily_notification_${today}`;

  // Evita repetir la notificación
  if (sessionStorage.getItem(key)) return;

  const message = todayEvents
    .map(event => `• ${event.text} (${event.time})`)
    .join("\n");

  new Notification("📅 Telisi - Hoy", {
    body: message,
    icon: "/icon-192.png"
  });

  sessionStorage.setItem(key, "true");
}