export async function requestNotificationPermission() {
  if (!("Notification" in window)) {
    throw new Error("Este navegador no soporta notificaciones.");
  }

  const permission = await Notification.requestPermission();

  return permission;
}

export function testNotification() {
  if (Notification.permission !== "granted") {
    alert("Primero activá las notificaciones.");
    return;
  }

  new Notification("🎉 Telisi", {
    body: "¡Las notificaciones funcionan correctamente!",
    icon: "/icon-192.png"
  });
}

export function scheduleReminder(event, minutesBefore = 10) {
  if (Notification.permission !== "granted") return;

  const eventTime = new Date(`${event.date}T${event.time}`);
  const reminderTime = new Date(
    eventTime.getTime() - minutesBefore * 60000
  );

  const delay = reminderTime.getTime() - Date.now();

  if (delay <= 0) return;

  setTimeout(() => {
    new Notification("📅 Telisi", {
      body: `${event.text} comienza en ${minutesBefore} minutos.`,
      icon: "/icon-192.png"
    });
  }, delay);
}