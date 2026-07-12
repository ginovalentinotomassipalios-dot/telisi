import { defaultCalendars } from "../../data";
import { integrationRegistry } from "../integrations/integrationRegistry";
import { localStorageAdapter } from "../storage/localStorageAdapter";

const CALENDARS_KEY = "telisi_calendars";
const ACTIVE_KEY = "telisi_active";

function normalizeCalendars(value) {
  const calendars = Array.isArray(value) && value.length > 0
    ? value
    : defaultCalendars;

  const allCalendar = calendars.find(calendar => calendar.id === "todos")
    ?? defaultCalendars.find(calendar => calendar.id === "todos");

  return [
    ...calendars.filter(calendar => calendar.id !== "todos"),
    allCalendar
  ];
}

export const calendarService = {
  getAll() {
    return normalizeCalendars(
      localStorageAdapter.get(CALENDARS_KEY, defaultCalendars)
    );
  },

  saveAll(calendars) {
    const normalized = normalizeCalendars(calendars);
    localStorageAdapter.set(CALENDARS_KEY, normalized);
    return normalized;
  },

  getActiveId() {
    const calendars = this.getAll();
    const storedId = localStorageAdapter.getString(ACTIVE_KEY, "academico");

    return calendars.some(calendar => calendar.id === storedId)
      ? storedId
      : calendars[0]?.id ?? "todos";
  },

  setActiveId(calendarId) {
    if (!this.getAll().some(calendar => calendar.id === calendarId)) {
      throw new Error(`[Telicore] No existe el calendario "${calendarId}".`);
    }

    localStorageAdapter.setString(ACTIVE_KEY, calendarId);
    return calendarId;
  },

  async create(calendarData) {
    const name = String(calendarData?.name ?? "").trim();
    if (!name) {
      throw new Error("[Telicore] El calendario necesita un nombre.");
    }

    const calendar = {
      id: `cal_${Date.now()}`,
      name,
      icon: calendarData.icon || "📅",
      color: calendarData.color || "#7C4D8B"
    };

    const calendars = this.getAll();
    this.saveAll([
      ...calendars.filter(item => item.id !== "todos"),
      calendar,
      calendars.find(item => item.id === "todos")
    ]);

    await integrationRegistry.emit("onCalendarCreated", calendar);
    return calendar;
  }
};
