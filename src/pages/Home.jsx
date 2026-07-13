import { useEffect, useMemo, useState } from "react";
import { getCalendar } from "../utils/calendar";
import {
  currentTimeString,
  greeting,
  longTodayString
} from "../utils/date";

const WEEKDAY_LABELS = ["LUN", "MAR", "MIÉ", "JUE", "VIE", "SÁB", "DOM"];

function dateToKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getStartOfWeek(date) {
  const result = new Date(date);
  const currentDay = result.getDay();
  const difference = currentDay === 0 ? -6 : 1 - currentDay;

  result.setDate(result.getDate() + difference);
  result.setHours(0, 0, 0, 0);
  return result;
}

function eventDateTime(event) {
  if (!event?.date) return null;

  const time = event.time || "23:59";
  const date = new Date(`${event.date}T${time}:00`);
  return Number.isNaN(date.getTime()) ? null : date;
}

function getRemainingTime(event, now) {
  const startsAt = eventDateTime(event);
  if (!startsAt) return "";

  const difference = startsAt.getTime() - now.getTime();
  if (difference <= 0) return "Ahora";

  const totalMinutes = Math.ceil(difference / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours === 0) return `En ${minutes} min`;
  if (minutes === 0) return `En ${hours} h`;
  return `En ${hours} h y ${minutes} min`;
}

function ClockIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" strokeWidth="1.9" />
      <path
        d="M12 7.5v5l3 2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="m9 5 7 7-7 7"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function WelcomeSunIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="4.1" fill="none" stroke="currentColor" strokeWidth="1.9" />
      <path
        d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M18.7 5.3l-1.6 1.6M6.9 17.1l-1.6 1.6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CalendarSectionIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="4" y="5.5" width="16" height="15" rx="3" fill="none" stroke="currentColor" strokeWidth="2" />
      <path
        d="M8 3.5v4M16 3.5v4M4 9.5h16"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="16.5" cy="16" r="3.2" fill="var(--surface)" stroke="currentColor" strokeWidth="1.7" />
      <path
        d="M16.5 14.4v1.8l1.2.8"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function WeekSectionIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M4 19V5M4 19h16"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="m7 15 4-4 3 2 4-6"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="7" cy="15" r="1.6" fill="currentColor" />
      <circle cx="11" cy="11" r="1.6" fill="currentColor" />
      <circle cx="14" cy="13" r="1.6" fill="currentColor" />
      <circle cx="18" cy="7" r="1.6" fill="currentColor" />
    </svg>
  );
}

function CalendarTypeIcon({ calendarId }) {
  const normalizedId = String(calendarId || "").toLowerCase();

  if (normalizedId.includes("labor")) {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="4" y="7" width="16" height="11" rx="2" fill="none" stroke="currentColor" strokeWidth="2" />
        <path
          d="M9 7V5.8A1.8 1.8 0 0 1 10.8 4h2.4A1.8 1.8 0 0 1 15 5.8V7M4 11h16"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (normalizedId.includes("academ")) {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M4 6.5c3.2-.8 5.8-.2 8 1.5v10c-2.2-1.7-4.8-2.3-8-1.5zM20 6.5c-3.2-.8-5.8-.2-8 1.5v10c2.2-1.7 4.8-2.3 8-1.5z"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 20s-7-4.2-7-9.2A3.8 3.8 0 0 1 12 8a3.8 3.8 0 0 1 7 2.8C19 15.8 12 20 12 20z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function getWelcomeMessage(todayEvents, nextTodayEvent, now) {
  if (todayEvents.length === 0) return "Hoy está bastante tranquilo.";
  if (!nextTodayEvent) return "Ya terminaste con tus eventos de hoy.";

  const startsAt = eventDateTime(nextTodayEvent);
  if (!startsAt) {
    return `Hoy tenés ${todayEvents.length} ${
      todayEvents.length === 1 ? "evento" : "eventos"
    }.`;
  }

  const differenceMinutes = Math.ceil((startsAt.getTime() - now.getTime()) / 60000);

  if (differenceMinutes <= 0) return `${nextTodayEvent.text} está comenzando.`;
  if (differenceMinutes < 60) return `En ${differenceMinutes} minutos comienza ${nextTodayEvent.text}.`;

  const hours = Math.floor(differenceMinutes / 60);
  if (hours === 1) return `En una hora comienza ${nextTodayEvent.text}.`;

  return `En ${hours} horas comienza ${nextTodayEvent.text}.`;
}

export function Home({
  user,
  calendars,
  events,
  todayEvents,
  setView
}) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 20000);
    return () => clearInterval(timer);
  }, []);

  const sortedTodayEvents = useMemo(() => {
    return [...todayEvents].sort((eventA, eventB) => {
      const dateA = eventDateTime(eventA);
      const dateB = eventDateTime(eventB);

      if (!dateA && !dateB) return 0;
      if (!dateA) return 1;
      if (!dateB) return -1;

      return dateA.getTime() - dateB.getTime();
    });
  }, [todayEvents]);

  const nextTodayEvent = useMemo(() => {
    return (
      sortedTodayEvents.find(event => {
        const startsAt = eventDateTime(event);
        return !startsAt || startsAt.getTime() >= now.getTime();
      }) || null
    );
  }, [sortedTodayEvents, now]);

  const nextCalendar = nextTodayEvent
    ? getCalendar(calendars, nextTodayEvent.calendarId)
    : null;

  const weekDays = useMemo(() => {
    const startOfWeek = getStartOfWeek(now);
    const todayKey = dateToKey(now);

    return WEEKDAY_LABELS.map((label, index) => {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + index);

      const key = dateToKey(date);
      const eventCount = events.filter(event => event.date === key).length;

      return {
        key,
        label,
        number: date.getDate(),
        isToday: key === todayKey,
        eventCount
      };
    });
  }, [events, now]);

  const welcomeMessage = getWelcomeMessage(sortedTodayEvents, nextTodayEvent, now);
  const firstName = user?.displayName?.trim().split(" ")[0] || "Usuario";

  const openCalendar = () => {
    if (typeof setView === "function") setView("calendar");
  };

  return (
    <section className="home dashboard simplicity-home">
      <article className="simplicity-welcome">
        <div className="welcome-stars" aria-hidden="true">
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
        </div>

        <div className="welcome-content">
          <div className="welcome-copy">
            <span className="welcome-weather-icon" aria-hidden="true">
              <WelcomeSunIcon />
            </span>

            <h2>{greeting()}, {firstName}</h2>
            <p className="welcome-message">{welcomeMessage}</p>
          </div>

          <div className="hero-clock">
            <strong>{currentTimeString(now)}</strong>
            <small>{longTodayString(now)}</small>
          </div>
        </div>

        <div className="welcome-mountains" aria-hidden="true">
          <span className="welcome-mountain mountain-far" />
          <span className="welcome-mountain mountain-middle" />
          <span className="welcome-mountain mountain-near" />
        </div>
      </article>

      <section className="home-section-block">
        <div className="home-section-heading">
          <div className="home-section-title">
            <span className="home-section-icon" aria-hidden="true">
  <img
    src="/illustrations/home/next-calendar.svg"
    alt=""
  />
</span>
            <h2>Próximo evento</h2>
          </div>
        </div>

        <article className="simplicity-next-event">
          {nextTodayEvent ? (
            <>
              <div className="next-event-featured">
                <div className="next-event-illustration" aria-hidden="true">
                  <img src="/illustrations/home/next-calendar.svg" alt="" />
                </div>

                <div className="next-event-details">
                  <strong className="next-event-main-time">
                    {nextTodayEvent.time || "Todo el día"}
                  </strong>

                  <h3>{nextTodayEvent.text}</h3>

                  <div className="next-event-calendar-row">
                    <CalendarTypeIcon calendarId={nextTodayEvent.calendarId} />
                    <span>{nextCalendar?.name || "Calendario"}</span>
                  </div>

                  <div className="next-event-remaining-pill">
                    <ClockIcon />
                    <span>{getRemainingTime(nextTodayEvent, now)}</span>
                  </div>
                </div>

                <button
                  type="button"
                  className="next-event-arrow"
                  onClick={openCalendar}
                  aria-label="Ver evento"
                >
                  <ArrowIcon />
                </button>
              </div>

              <button
                type="button"
                className="next-event-footer"
                onClick={openCalendar}
              >
                <span>Ver agenda de hoy</span>
                <ArrowIcon />
              </button>
            </>
          ) : (
            <div className="next-event-empty">
              <div className="next-event-empty-icon" aria-hidden="true">
                <img src="/illustrations/home/next-calendar.svg" alt="" />
              </div>

              <div>
                <h3>No tenés eventos para hoy.</h3>
                <p>Aprovechá para descansar o adelantar pendientes.</p>
              </div>
            </div>
          )}
        </article>
      </section>

      <section className="home-section-block">
        <div className="home-section-heading week-heading">
          <div className="home-section-title">
            <span className="home-section-icon" aria-hidden="true">
  <img
    src="/illustrations/home/week-chart.svg"
    alt=""
  />
</span>
            <h2>Esta semana</h2>
          </div>

          <button
            type="button"
            className="week-complete-button"
            onClick={openCalendar}
          >
            <span>Ver semana completa</span>
            <ArrowIcon />
          </button>
        </div>

        <article className="simplicity-week">
          <div className="weekly-timeline">
            {weekDays.map(day => (
              <div
                key={day.key}
                className={`weekly-day ${day.isToday ? "is-today" : ""}`}
              >
                <span className="weekly-day-label">{day.label}</span>
                <span className="weekly-day-number">{day.number}</span>
                <span
                  className={`weekly-event-dot ${
                    day.eventCount >= 2
                      ? "many-events"
                      : day.eventCount === 1
                        ? "one-event"
                        : "no-events"
                  }`}
                  aria-label={
                    day.eventCount >= 2
                      ? `${day.eventCount} eventos`
                      : day.eventCount === 1
                        ? "1 evento"
                        : "Sin eventos"
                  }
                />
              </div>
            ))}
          </div>

          <div className="weekly-legend" aria-label="Referencia de eventos">
            <span><i className="many-events" />Con eventos</span>
            <span><i className="one-event" />Pocos eventos</span>
            <span><i className="no-events" />Sin eventos</span>
          </div>
        </article>
      </section>

      <article
        className={`day-status-card ${
          nextTodayEvent ? "has-upcoming-event" : "is-free-day"
        }`}
      >
        <div className="day-status-emoji" aria-hidden="true">
          <img src="/illustrations/home/free-party.svg" alt="" />
        </div>

        <div className="day-status-content">
          <h3>{nextTodayEvent ? "Tu día está organizado" : "Día libre"}</h3>
          <p>
            {nextTodayEvent
              ? `Tu próximo compromiso es ${nextTodayEvent.text}.`
              : "No tenés más eventos programados para hoy."}
          </p>
          <strong>
            {nextTodayEvent
              ? "Telisi te avisará cuando se acerque."
              : "¡Aprovechá tu tiempo!"}
          </strong>
        </div>

        <div className="day-status-illustration" aria-hidden="true">
          <img src="/illustrations/home/free-coffee.svg" alt="" />
        </div>
      </article>
    </section>
  );
}