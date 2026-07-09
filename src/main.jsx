import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

const monthNames = ["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];
const shortWeekdays = ["D","L","M","M","J","V","S"];

const defaultCalendars = [
  { id: "academico", name: "Académico", icon: "📚", color: "#7C4D8B" },
  { id: "laboral", name: "Laboral", icon: "💼", color: "#3F5F93" },
  { id: "personal", name: "Personal", icon: "❤️", color: "#B35068" },
  { id: "todos", name: "Todos", icon: "📅", color: "#241029", system: true }
];

const defaultEvents = [
  { date: "2026-07-04", time: "18:00", text: "Ética fundamental y profesional - Cuestionario N°1", calendarId: "academico" },
  { date: "2026-08-04", time: "09:00", text: "Formulación y evaluación de proyectos - Final", calendarId: "academico" },
  { date: "2026-08-12", time: "10:00", text: "Visita técnica - Depósito documental", calendarId: "laboral" },
  { date: "2026-08-14", time: "15:00", text: "Capacitación orden y limpieza - Mutual", calendarId: "laboral" }
];

function App() {
  const [view, setView] = useState("home");
  const [year, setYear] = useState(2026);
  const [active, setActive] = useState(() => localStorage.getItem("telisi_active") || "academico");
  const [theme, setTheme] = useState(() => localStorage.getItem("telisi_theme") || "light");
  const [calendars, setCalendars] = useState(() => JSON.parse(localStorage.getItem("telisi_calendars")) || defaultCalendars);
  const [events, setEvents] = useState(() => JSON.parse(localStorage.getItem("telisi_events")) || defaultEvents);
  const [newEvent, setNewEvent] = useState({ date: "2026-01-01", time: "09:00", text: "" });
  const [modal, setModal] = useState(false);
  const [newCal, setNewCal] = useState({ name: "", icon: "📅", color: "#7C4D8B" });

  useEffect(() => localStorage.setItem("telisi_calendars", JSON.stringify(calendars)), [calendars]);
  useEffect(() => localStorage.setItem("telisi_events", JSON.stringify(events)), [events]);
  useEffect(() => localStorage.setItem("telisi_active", active), [active]);
  useEffect(() => localStorage.setItem("telisi_theme", theme), [theme]);
  useEffect(() => {
    const parts = newEvent.date.split("-");
    setNewEvent(v => ({ ...v, date: `${year}-${parts[1] || "01"}-${parts[2] || "01"}` }));
  }, [year]);

  const activeCalendar = getCalendar(calendars, active);

  const visibleEvents = useMemo(() => {
    const list = active === "todos" ? events : events.filter(e => e.calendarId === active);
    return list
      .filter(e => e.date.startsWith(String(year)))
      .sort((a,b) => (a.date + a.time).localeCompare(b.date + b.time));
  }, [events, active, year]);

  const todayEvents = useMemo(() => {
    const today = new Date();
    const todayString = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,"0")}-${String(today.getDate()).padStart(2,"0")}`;
    return events.filter(e => e.date === todayString).sort((a,b) => a.time.localeCompare(b.time));
  }, [events]);

  const nextEvent = useMemo(() => {
    const now = new Date();
    return events
      .slice()
      .sort((a,b) => (a.date + a.time).localeCompare(b.date + b.time))
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
    const data = { version: "0.2.1", calendars, events };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "telisi-backup.json";
    link.click();
  }

  return (
    <main className={`shell theme-${theme}`} style={{ "--accent": activeCalendar.color }}>
      <header className="app-header">
        <button className="ghost">☰</button>
        <div>
          <p className="eyebrow">TELISI</p>
          <h1>{view === "home" ? "Inicio" : view === "calendar" ? "Calendario" : "Ajustes"}</h1>
        </div>
        <button className="ghost" onClick={() => setTheme(theme === "light" ? "dark" : "light")}>{theme === "light" ? "🌙" : "☀️"}</button>
      </header>

      <div className="view-fade" key={view}>
        {view === "home" && (
          <Home
            calendars={calendars}
            events={events}
            nextEvent={nextEvent}
            todayEvents={todayEvents}
            active={active}
            setActive={setActive}
            setView={setView}
            openModal={() => setModal(true)}
          />
        )}

        {view === "calendar" && (
          <CalendarView
            year={year}
            setYear={setYear}
            calendars={calendars}
            active={active}
            setActive={setActive}
            visibleEvents={visibleEvents}
            events={events}
            setEvents={setEvents}
            newEvent={newEvent}
            setNewEvent={setNewEvent}
            addEvent={addEvent}
            deleteEvent={deleteEvent}
            openModal={() => setModal(true)}
          />
        )}

        {view === "settings" && (
          <section className="panel">
            <h2>Ajustes</h2>
            <p className="muted">Telisi v0.2.1</p>
            <div className="setting-row">
              <span>Tema</span>
              <button className="pill-button" onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
                {theme === "light" ? "Modo oscuro" : "Modo claro"}
              </button>
            </div>
            <div className="setting-row">
              <span>Copia de seguridad</span>
              <button className="pill-button" onClick={exportData}>Exportar</button>
            </div>
            <div className="setting-row">
              <span>Sincronización</span>
              <strong>Próximamente</strong>
            </div>
            <div className="setting-row">
              <span>Notificaciones</span>
              <strong>Próximamente</strong>
            </div>
          </section>
        )}
      </div>

      <nav className="bottom-nav">
        <button className={view === "home" ? "selected" : ""} onClick={() => setView("home")}>🏠<span>Inicio</span></button>
        <button className={view === "calendar" ? "selected" : ""} onClick={() => setView("calendar")}>📅<span>Calendario</span></button>
        <button className={view === "settings" ? "selected" : ""} onClick={() => setView("settings")}>⚙️<span>Ajustes</span></button>
      </nav>

      {modal && (
        <div className="modal-backdrop">
          <section className="modal">
            <h3>Nuevo calendario</h3>
            <label>Nombre<input value={newCal.name} onChange={e => setNewCal({ ...newCal, name: e.target.value })} placeholder="Ej: Gimnasio" /></label>
            <label>Ícono<input value={newCal.icon} onChange={e => setNewCal({ ...newCal, icon: e.target.value })} /></label>
            <label>Color<input type="color" value={newCal.color} onChange={e => setNewCal({ ...newCal, color: e.target.value })} /></label>
            <div className="modal-actions">
              <button className="secondary" onClick={() => setModal(false)}>Cancelar</button>
              <button onClick={createCalendar}>Crear</button>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}

function Home({ calendars, events, nextEvent, todayEvents, setActive, setView, openModal }) {
  const nextCal = nextEvent ? getCalendar(calendars, nextEvent.calendarId) : null;
  const today = new Date();
  const summary = calendars
    .filter(c => c.id !== "todos")
    .map(cal => ({ ...cal, count: todayEvents.filter(e => e.calendarId === cal.id).length }));

  return (
    <section className="home">
      <article className="hero-card">
        <p>{greeting()}, Gino 👋</p>
        <h2>{today.toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "long" })}</h2>
        <span>{smartMessage(todayEvents.length)}</span>
      </article>

      <section className="today-summary">
        {summary.map(item => (
          <article key={item.id} className="mini-stat" style={{ "--stat": item.color }}>
            <span>{item.icon}</span>
            <strong>{item.count}</strong>
            <small>{item.name}</small>
          </article>
        ))}
      </section>

      <article className="next-card">
        <div className="big-icon" style={{ background: nextCal?.color + "22", color: nextCal?.color }}>{nextCal?.icon || "📅"}</div>
        <div>
          <p className="eyebrow">Próximo evento</p>
          <h3>{nextEvent ? nextEvent.text : "No hay eventos"}</h3>
          {nextEvent && <span>{formatHumanDate(nextEvent.date)} · {nextEvent.time}</span>}
        </div>
      </article>

      <section className="panel">
        <div className="section-title">
          <h2>Hoy</h2>
          <span>{todayEvents.length} evento(s)</span>
        </div>
        {todayEvents.length === 0 && <p className="muted">No hay eventos para hoy.</p>}
        {todayEvents.map((ev, idx) => {
          const cal = getCalendar(calendars, ev.calendarId);
          return (
            <div key={idx} className="timeline-item">
              <b style={{ color: cal.color }}>{ev.time}</b>
              <span>{cal.icon}</span>
              <p>{ev.text}</p>
            </div>
          )
        })}
      </section>

      <section className="panel">
        <div className="section-title">
          <h2>Tus calendarios</h2>
          <button className="small-plus" onClick={openModal}>+</button>
        </div>
        <div className="calendar-cards">
          {calendars.filter(c => c.id !== "todos").map(cal => (
            <button key={cal.id} className="calendar-card" onClick={() => { setActive(cal.id); setView("calendar"); }}>
              <span style={{ background: cal.color + "22", color: cal.color }}>{cal.icon}</span>
              <strong>{cal.name}</strong>
              <small>{events.filter(e => e.calendarId === cal.id).length} eventos</small>
            </button>
          ))}
        </div>
      </section>
    </section>
  );
}

function CalendarView({ year, setYear, calendars, active, setActive, visibleEvents, newEvent, setNewEvent, addEvent, deleteEvent, openModal }) {
  const activeCalendar = getCalendar(calendars, active);
  return (
    <section>
      <div className="year-toolbar">
        <button onClick={() => setYear(Number(year) - 1)}>←</button>
        <strong>{year}</strong>
        <button onClick={() => setYear(Number(year) + 1)}>→</button>
      </div>

      <nav className="tabs">
        {calendars.map(cal => (
          <button key={cal.id} onClick={() => setActive(cal.id)}
            className={active === cal.id ? "active" : ""}
            style={{ "--tab": cal.color }}>
            {cal.icon} {cal.name}
          </button>
        ))}
        <button className="plus-tab" onClick={openModal}>+</button>
      </nav>

      <section className="layout">
        <section className="calendar-grid">
          {monthNames.map((m, i) => (
            <Month key={m} year={Number(year)} month={i} events={visibleEvents} calendars={calendars} />
          ))}
        </section>

        <aside className="panel event-panel">
          <h2>{active === "todos" ? "Todos los eventos" : `${activeCalendar.icon} ${activeCalendar.name}`}</h2>
          <form className="event-form" onSubmit={addEvent}>
            <input type="date" min={`${year}-01-01`} max={`${year}-12-31`} value={newEvent.date} onChange={e => setNewEvent({ ...newEvent, date: e.target.value.replace(/^\d{4}/, String(year)) })} />
            <input type="time" value={newEvent.time} onChange={e => setNewEvent({ ...newEvent, time: e.target.value })} />
            <input placeholder="Nuevo evento" value={newEvent.text} onChange={e => setNewEvent({ ...newEvent, text: e.target.value })} />
            <button>Agregar</button>
          </form>

          <div className="events-list">
            {visibleEvents.map((ev, idx) => {
              const cal = getCalendar(calendars, ev.calendarId);
              return (
                <div key={idx} className="event-row">
                  <div>
                    <b style={{ color: cal.color }}>{shortDate(ev.date)}</b>
                    <small>{ev.time}</small>
                  </div>
                  {active === "todos" && <span className="dot" style={{ background: cal.color }}></span>}
                  <p>{ev.text}</p>
                  <button className="delete" onClick={() => deleteEvent(ev)}>×</button>
                </div>
              )
            })}
          </div>
        </aside>
      </section>
    </section>
  );
}

function Month({ year, month, events, calendars }) {
  const firstDay = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();
  const cells = [];

  for (let i = 0; i < firstDay; i++) cells.push(<div key={"e"+i} className="day empty" />);

  for (let d = 1; d <= totalDays; d++) {
    const date = `${year}-${String(month + 1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
    const dayEvents = events.filter(e => e.date === date);
    const cal = dayEvents[0] ? getCalendar(calendars, dayEvents[0].calendarId) : null;
    cells.push(
      <div key={date} className={"day " + (dayEvents.length ? "has-event" : "")}
        style={cal ? { "--day": cal.color } : {}}
        title={dayEvents.map(e => e.text).join("\n")}>
        {d}
      </div>
    );
  }

  return (
    <article className="month">
      <h3>{monthNames[month]}</h3>
      <div className="weekdays">{shortWeekdays.map((w, idx) => <span key={idx}>{w}</span>)}</div>
      <div className="days">{cells}</div>
    </article>
  );
}

function getCalendar(calendars, id) {
  return calendars.find(c => c.id === id) || calendars[0];
}

function shortDate(dateString) {
  const d = new Date(dateString + "T00:00:00");
  return `${d.toLocaleString("es-AR", { month: "short" })} ${String(d.getDate()).padStart(2, "0")}`;
}

function formatHumanDate(dateString) {
  const d = new Date(dateString + "T00:00:00");
  return d.toLocaleDateString("es-AR", { weekday: "short", day: "numeric", month: "short" });
}

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Buenos días";
  if (h < 20) return "Buenas tardes";
  return "Buenas noches";
}

function smartMessage(count) {
  if (count === 0) return "Hoy no tenés eventos. Disfrutá el día.";
  if (count <= 2) return `Hoy tenés ${count} evento(s). Día tranqui.`;
  if (count <= 5) return `Hoy tenés ${count} eventos. Organizate con calma.`;
  return `Hoy tenés ${count} eventos. No olvides descansar.`;
}

createRoot(document.getElementById("root")).render(<App />);
