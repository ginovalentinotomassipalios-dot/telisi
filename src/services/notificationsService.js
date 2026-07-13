export function requestDesktopNotifications() {
  if (!("Notification" in window)) return Promise.resolve("unsupported");
  return Notification.requestPermission();
}

function getToday() {
  return new Date().toISOString().split("T")[0];
}

function daysBetween(date1, date2) {
  const a = new Date(date1 + "T00:00:00");
  const b = new Date(date2 + "T00:00:00");
  return Math.round((a - b) / 86400000);
}

export function checkUpcomingNotifications(events) {
  if (!("Notification" in window)) return;
  if (Notification.permission !== "granted") return;

  const today = getToday();
  const notified = JSON.parse(localStorage.getItem("telisi_notification_history") || "[]");

  events.forEach(event => {
    const diff = daysBetween(event.date, today);

    let shouldNotify = false;
    let title = "📅 Telisi";

    if (event.type === "training" && diff === 1) {
      shouldNotify = true;
      title = "📚 Capacitación mañana";
    }

    if (event.type === "exam" && diff === 2) {
      shouldNotify = true;
      title = "🎓 Examen próximo";
    }

    if ((!event.type || event.type === "event") && diff === 0) {
      shouldNotify = true;
      title = "📅 Evento de hoy";
    }

    const key = `${event.id || event.text}-${event.date}-${title}`;

    if (shouldNotify && !notified.includes(key)) {
      new Notification(title, {
        body: `${event.text}${event.time ? " - " + event.time : ""}`,
        icon: "/icon-192.png"
      });

      notified.push(key);
    }
  });

  localStorage.setItem(
    "telisi_notification_history",
    JSON.stringify(notified)
  );
}
