import { getCalendar } from "../utils/calendar";
import { formatHumanDate, greeting, smartMessage } from "../utils/date";

export function Home({ calendars, events, nextEvent, todayEvents, setActive, setView, openModal }) {
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
        <div className="big-icon" style={{ background: nextCal?.color + "22", color: nextCal?.color }}>
          {nextCal?.icon || "📅"}
        </div>
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
          );
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
