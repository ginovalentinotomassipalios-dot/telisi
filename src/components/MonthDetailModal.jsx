import { monthNames } from "../data";
import { Month } from "./Month";
import { getCalendar } from "../utils/calendar";
import { shortDate } from "../utils/date";

export function MonthDetailModal({ year, month, events, calendars, closeModal }) {
  const monthEvents = events
    .filter(e => Number(e.date.split("-")[1]) - 1 === month)
    .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));

  return (
    <div className="modal-backdrop month-detail-backdrop" onClick={closeModal}>
      <section className="modal month-detail-modal" onClick={e => e.stopPropagation()}>
        <div className="month-detail-header">
          <div>
            <p className="eyebrow">Detalle mensual</p>
            <h3>{monthNames[month]} {year}</h3>
          </div>
          <button className="delete" onClick={closeModal}>×</button>
        </div>

        <div className="month-detail-layout">
          <Month year={year} month={month} events={events} calendars={calendars} />

          <section className="month-event-list">
            <h4>Eventos del mes</h4>

            {monthEvents.length === 0 && (
              <p className="muted">No hay eventos cargados en este mes.</p>
            )}

            {monthEvents.map((event, idx) => {
              const cal = getCalendar(calendars, event.calendarId);
              return (
                <article className="month-event-card" key={idx}>
                  <div>
                    <b style={{ color: "var(--brand)" }}>{shortDate(event.date)}</b>
                    <small>{event.time}</small>
                  </div>
                  <span style={{ background: "color-mix(in srgb, var(--brand) 18%, transparent)", color: "var(--brand)" }}>{cal.icon}</span>
                  <p>{event.text}</p>
                </article>
              );
            })}
          </section>
        </div>
      </section>
    </div>
  );
}
