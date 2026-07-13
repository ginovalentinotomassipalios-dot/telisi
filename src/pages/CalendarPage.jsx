import {
  useLayoutEffect,
  useRef,
  useState
} from "react";

import { Month } from "../components/calendar/Month";
import { TeliSelect } from "../components/ui/TeliSelect";
import { monthNames } from "../data";
import { getCalendar } from "../utils/calendar";
import { shortDate } from "../utils/date";

function getRecurrenceLabel(event) {
  const frequency = event?.recurrence?.frequency;

  if (frequency === "daily") return "Todos los días";

  if (frequency === "weekly") {
    const date = new Date(`${event.date}T00:00:00`);
    const weekday = date.toLocaleDateString("es-AR", {
      weekday: "long"
    });

    return `Todos los ${weekday}`;
  }

  if (frequency === "monthly") {
    const day = Number(event.date.split("-")[2]);
    return `Todos los días ${day}`;
  }

  if (frequency === "yearly") {
    const date = new Date(`${event.date}T00:00:00`);
    const yearlyDate = date.toLocaleDateString("es-AR", {
      day: "numeric",
      month: "long"
    });

    return `Cada ${yearlyDate}`;
  }

  return "";
}

function getSeriesId(event) {
  if (event.cloudId) return event.cloudId;

  return [
    event.text,
    event.time,
    event.calendarId,
    event.date,
    event.recurrence?.frequency
  ].join("-");
}

export function CalendarPage({
  year,
  setYear,
  calendars,
  active,
  setActive,
  visibleEvents,
  newEvent,
  setNewEvent,
  deleteEvent,
  openEventModal
}) {
  const calendarGridRef = useRef(null);
  const [calendarHeight, setCalendarHeight] = useState(null);

  const activeCalendar = getCalendar(calendars, active);

  const calendarOptions = calendars.map((calendar) => ({
    value: calendar.id,
    label:
      calendar.id === "todos"
        ? "Todos los calendarios"
        : `${calendar.icon} ${calendar.name}`
  }));

  useLayoutEffect(() => {
    const grid = calendarGridRef.current;

    if (!grid) return undefined;

    function updateHeight() {
      setCalendarHeight(
        Math.ceil(grid.getBoundingClientRect().height)
      );
    }

    updateHeight();

    const observer = new ResizeObserver(updateHeight);
    observer.observe(grid);
    window.addEventListener("resize", updateHeight);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateHeight);
    };
  }, []);

  const listEvents = visibleEvents.filter(
    (event, index, allEvents) => {
      const isRecurring = Boolean(
        event?.recurrence?.frequency
      );

      if (!isRecurring) return true;

      const seriesId = getSeriesId(event);

      return (
        allEvents.findIndex(
          (currentEvent) =>
            getSeriesId(currentEvent) === seriesId
        ) === index
      );
    }
  );

  function handleDayClick(date) {
    setNewEvent({
      ...newEvent,
      date,
      time: "09:00",
      text: "",
      reminder: 10,
      recurrence: null
    });

    openEventModal();
  }

  function handleNewEvent() {
    setNewEvent({
      ...newEvent,
      text: ""
    });

    openEventModal();
  }

  return (
    <section className="calendar-page-desktop">
      <header className="calendar-page-toolbar">
        <div className="calendar-year-control">
          <button
            type="button"
            onClick={() => setYear(Number(year) - 1)}
            aria-label="Año anterior"
          >
            ←
          </button>

          <strong>{year}</strong>

          <button
            type="button"
            onClick={() => setYear(Number(year) + 1)}
            aria-label="Año siguiente"
          >
            →
          </button>
        </div>

        <div className="calendar-page-actions">
          <div className="calendar-filter-select">
            <TeliSelect
              value={active}
              options={calendarOptions}
              ariaLabel="Elegir calendario"
              onChange={setActive}
            />
          </div>

          <button
            type="button"
            className="calendar-new-event-button"
            onClick={handleNewEvent}
          >
            <span aria-hidden="true">＋</span>
            Nuevo evento
          </button>
        </div>
      </header>

      <section className="layout calendar-layout-fixed calendar-layout-annual">
        <section
          ref={calendarGridRef}
          className="calendar-grid annual-grid annual-grid-four-columns"
        >
          {monthNames.map((monthName, monthIndex) => (
            <Month
              key={monthName}
              year={Number(year)}
              month={monthIndex}
              events={visibleEvents}
              calendars={calendars}
              onDayClick={handleDayClick}
            />
          ))}
        </section>

        <aside
          className="panel event-panel annual-event-panel"
          style={
            calendarHeight
              ? {
                  height: `${calendarHeight}px`,
                  maxHeight: `${calendarHeight}px`
                }
              : undefined
          }
        >
          <div className="annual-event-panel-heading">
            <div>
              <small>Agenda</small>

              <h2>
                {active === "todos"
                  ? "Todos los eventos"
                  : `${activeCalendar.icon} ${activeCalendar.name}`}
              </h2>
            </div>

            <span>{listEvents.length}</span>
          </div>

          <div className="events-list">
            {listEvents.length === 0 && (
              <div className="annual-events-empty">
                <span aria-hidden="true">◇</span>
                <strong>No hay eventos agendados</strong>
                <small>
                  Creá uno nuevo o elegí otro calendario.
                </small>
              </div>
            )}

            {listEvents.map((event, index) => {
              const calendar = getCalendar(
                calendars,
                event.calendarId
              );

              const isRecurring = Boolean(
                event?.recurrence?.frequency
              );

              return (
                <div
                  key={
                    isRecurring
                      ? `series-${getSeriesId(event)}`
                      : event.cloudId ||
                        `${event.date}-${event.time}-${index}`
                  }
                  className="event-row"
                >
                  <div>
                    <b style={{ color: "var(--brand)" }}>
                      {isRecurring
                        ? "Recurrente"
                        : shortDate(event.date)}
                    </b>

                    <small>
                      {isRecurring
                        ? `${getRecurrenceLabel(event)} · ${event.time}`
                        : event.time}
                    </small>
                  </div>

                  {active === "todos" && (
                    <span
                      className="dot"
                      title={calendar?.name}
                      style={{
                        background:
                          calendar?.color || "var(--brand)"
                      }}
                    />
                  )}

                  <p>{event.text}</p>

                  <button
                    type="button"
                    className="delete"
                    onClick={() => deleteEvent(event)}
                    aria-label={
                      isRecurring
                        ? `Eliminar toda la serie ${event.text}`
                        : `Eliminar ${event.text}`
                    }
                    title={
                      isRecurring
                        ? "Eliminar toda la serie"
                        : "Eliminar evento"
                    }
                  >
                    ×
                  </button>
                </div>
              );
            })}
          </div>
        </aside>
      </section>
    </section>
  );
}
