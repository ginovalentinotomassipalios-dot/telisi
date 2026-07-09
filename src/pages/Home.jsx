import { useEffect, useMemo, useState } from "react";
import { getCalendar } from "../utils/calendar";
import {
  currentTimeString,
  formatHumanDate,
  greeting,
  isDateInCurrentWeek,
  longTodayString,
  smartMessage
} from "../utils/date";

export function Home({ calendars, events, nextEvent, todayEvents, setActive, setView, openModal }) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000 * 20);
    return () => clearInterval(timer);
  }, []);

  const nextCal = nextEvent ? getCalendar(calendars, nextEvent.calendarId) : null;
  const regularCalendars = calendars.filter(c => c.id !== "todos");

  const todaySummary = regularCalendars.map(cal => ({
    ...cal,
    count: todayEvents.filter(e => e.calendarId === cal.id).length
  }));

  const weekSummary = useMemo(() => {
    return regularCalendars.map(cal => ({
      ...cal,
      count: events.filter(e => e.calendarId === cal.id && isDateInCurrentWeek(e.date)).length
    }));
  }, [events, calendars]);

  const firstTodayEvent = todayEvents[0];

  return (
    <section className="home dashboard">
      <article className="hero-card dashboard-hero">
        <div>
          <p className="eyebrow">TELISI</p>
          <h2>{greeting()}, Gino</h2>
          <span>{smartMessage(todayEvents, nextEvent)}</span>
        </div>

        <div className="hero-clock">
          <strong>{currentTimeString(now)}</strong>
          <small>{longTodayString(now)}</small>
        </div>
      </article>

      <section className="today-summary">
        {todaySummary.map(item => (
          <article key={item.id} className="mini-stat" style={{ "--stat": "var(--brand)" }}>
            <span>{item.icon}</span>
            <strong>{item.count}</strong>
            <small>{item.name}</small>
          </article>
        ))}
      </section>

      <article className="next-card premium-next">
        <div className="big-icon" style={{ background: "color-mix(in srgb, var(--brand) 18%, transparent)", color: "var(--brand)" }}>
          {nextCal?.icon || "📅"}
        </div>
        <div>
          <p className="eyebrow">Próximo evento</p>
          <h3>{nextEvent ? nextEvent.text : "No hay eventos"}</h3>
          {nextEvent && <span>{formatHumanDate(nextEvent.date)} · {nextEvent.time}</span>}
        </div>
      </article>

      <section className="dashboard-grid">
        <article className="panel">
          <div className="section-title">
            <h2>Hoy</h2>
            <span>{todayEvents.length} evento(s)</span>
          </div>

          {todayEvents.length === 0 && <p className="muted">No hay eventos para hoy.</p>}

          {todayEvents.map((ev, idx) => {
            const cal = getCalendar(calendars, ev.calendarId);
            return (
              <div key={idx} className="timeline-item">
                <b style={{ color: "var(--brand)" }}>{ev.time}</b>
                <span>{cal.icon}</span>
                <p>{ev.text}</p>
              </div>
            );
          })}
        </article>

        <article className="panel">
          <div className="section-title">
            <h2>Esta semana</h2>
            <span>{weekSummary.reduce((acc, c) => acc + c.count, 0)} total</span>
          </div>

          <div className="week-list">
            {weekSummary.map(item => (
              <div key={item.id} className="week-row">
                <span style={{ background: item.color + "22", color: item.color }}>{item.icon}</span>
                <p>{item.name}</p>
                <strong>{item.count}</strong>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="panel">
        <div className="section-title">
          <h2>Tus calendarios</h2>
          <button className="small-plus" onClick={openModal}>+</button>
        </div>

        <div className="calendar-cards">
          {regularCalendars.map(cal => (
            <button key={cal.id} className="calendar-card" onClick={() => { setActive(cal.id); setView("calendar"); }}>
              <span style={{ background: "color-mix(in srgb, var(--brand) 18%, transparent)", color: "var(--brand)" }}>{cal.icon}</span>
              <strong>{cal.name}</strong>
              <small>{events.filter(e => e.calendarId === cal.id).length} eventos</small>
            </button>
          ))}
        </div>
      </section>
    </section>
  );
}
