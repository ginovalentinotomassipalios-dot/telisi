import { useEffect, useMemo, useState } from "react";
import { AppHeader } from "./components/AppHeader";
import { BottomNav } from "./components/BottomNav";
import { NewCalendarModal } from "./components/NewCalendarModal";
import { Home } from "./pages/Home";
import { CalendarPage } from "./pages/CalendarPage";
import { Settings } from "./pages/Settings";
import { defaultCalendars, defaultEvents } from "./data";
import { getCalendar } from "./utils/calendar";
import { todayString } from "./utils/date";

export function App() {
  const [view, setView] = useState("home");
  const [year, setYear] = useState(2026);
  const [active, setActive] = useState(() => localStorage.getItem("telisi_active") || "academico");
  const [theme, setTheme] = useState(() => localStorage.getItem("telisi_theme") || "light");
  const [appTheme, setAppTheme] = useState(() => localStorage.getItem("telisi_app_theme") || "amethyst");
  const [calendars, setCalendars] = useState(() => JSON.parse(localStorage.getItem("telisi_calendars")) || defaultCalendars);
  const [events, setEvents] = useState(() => JSON.parse(localStorage.getItem("telisi_events")) || defaultEvents);
  const [newEvent, setNewEvent] = useState({ date: "2026-01-01", time: "09:00", text: "" });
  const [modal, setModal] = useState(false);
  const [newCal, setNewCal] = useState({ name: "", icon: "📅", color: "#7C4D8B" });

  useEffect(() => localStorage.setItem("telisi_calendars", JSON.stringify(calendars)), [calendars]);
  useEffect(() => localStorage.setItem("telisi_events", JSON.stringify(events)), [events]);
  useEffect(() => localStorage.setItem("telisi_active", active), [active]);
  useEffect(() => localStorage.setItem("telisi_theme", theme), [theme]);
  useEffect(() => localStorage.setItem("telisi_app_theme", appTheme), [appTheme]);

  useEffect(() => {
    const parts = newEvent.date.split("-");
    setNewEvent(v => ({ ...v, date: `${year}-${parts[1] || "01"}-${parts[2] || "01"}` }));
  }, [year]);

  const activeCalendar = getCalendar(calendars, active);

  const visibleEvents = useMemo(() => {
    const list = active === "todos" ? events : events.filter(e => e.calendarId === active);
    return list
      .filter(e => e.date.startsWith(String(year)))
      .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
  }, [events, active, year]);

  const todayEvents = useMemo(() => {
    return events.filter(e => e.date === todayString()).sort((a, b) => a.time.localeCompare(b.time));
  }, [events]);

  const nextEvent = useMemo(() => {
    const now = new Date();
    return events
      .slice()
      .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time))
      .find(e => new Date(`${e.date}T${e.time || "00:00"}`) >= now) || events[0];
  }, [events]);

  function addEvent(e) {
    e.preventDefault();
    if (!newEvent.text.trim()) return;
    const target = active === "todos" ? "academico" : active;
    setEvents([...events, { ...newEvent, calendarId: target }]);
    setNewEvent({ ...newEvent, text: "" });
  }

  function deleteEvent(event) {
    setEvents(events.filter(e => e !== event));
  }

  function createCalendar() {
    if (!newCal.name.trim()) return;
    const id = "cal_" + Date.now();
    const todos = calendars.find(c => c.id === "todos");
    const regular = calendars.filter(c => c.id !== "todos");
    setCalendars([...regular, { id, ...newCal }, todos]);
    setActive(id);
    setNewCal({ name: "", icon: "📅", color: "#7C4D8B" });
    setModal(false);
  }

  function exportData() {
    const data = { version: "0.4.0", calendars, events, theme, appTheme };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "telisi-backup.json";
    link.click();
  }

  return (
    <main className={`shell theme-${theme} app-theme-${appTheme}`} style={{ "--accent": activeCalendar.color }}>
      <AppHeader view={view} theme={theme} setTheme={setTheme} />

      <div className="view-fade" key={view}>
        {view === "home" && (
          <Home
            calendars={calendars}
            events={events}
            nextEvent={nextEvent}
            todayEvents={todayEvents}
            setActive={setActive}
            setView={setView}
            openModal={() => setModal(true)}
          />
        )}

        {view === "calendar" && (
          <CalendarPage
            year={year}
            setYear={setYear}
            calendars={calendars}
            active={active}
            setActive={setActive}
            visibleEvents={visibleEvents}
            newEvent={newEvent}
            setNewEvent={setNewEvent}
            addEvent={addEvent}
            deleteEvent={deleteEvent}
            openModal={() => setModal(true)}
          />
        )}

        {view === "settings" && (
          <Settings theme={theme} setTheme={setTheme} appTheme={appTheme} setAppTheme={setAppTheme} exportData={exportData} />
        )}
      </div>

      <BottomNav view={view} setView={setView} />

      {modal && (
        <NewCalendarModal
          newCal={newCal}
          setNewCal={setNewCal}
          createCalendar={createCalendar}
          closeModal={() => setModal(false)}
        />
      )}
    </main>
  );
}
