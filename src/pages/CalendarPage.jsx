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

const reminderOptions = [
  { value: -1, label: "Sin aviso" },
  { value: 0, label: "Al comenzar" },
  { value: 5, label: "5 minutos antes" },
  { value: 10, label: "10 minutos antes" },
  { value: 30, label: "30 minutos antes" },
  { value: 60, label: "1 hora antes" }
];

const recurrenceOptions = [
  { value: "none", label: "No repetir" },
  { value: "daily", label: "Todos los días" },
  { value: "weekly", label: "Todas las semanas" },
  { value: "monthly", label: "Todos los meses" },
  { value: "yearly", label: "Todos los años" }
];

function getRecurrenceLabel(event) {
  const frequency = event?.recurrence?.frequency;

  if (frequency === "daily") {
    return "Todos los días";
  }

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
  if (event.cloudId) {
    return event.cloudId;
  }

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
  addEvent,
  deleteEvent,
  openModal,
  openEventModal
}) {
  const calendarGridRef = useRef(null);
  const [calendarHeight, setCalendarHeight] =
    useState(null);

  const activeCalendar =
    getCalendar(calendars, active);

  useLayoutEffect(() => {
    const grid = calendarGridRef.current;

    if (!grid) {
      return undefined;
    }

    function updateHeight() {
      const nextHeight = Math.ceil(
        grid.getBoundingClientRect().height
      );

      setCalendarHeight(nextHeight);
    }

    updateHeight();

    const observer =
      new ResizeObserver(updateHeight);

    observer.observe(grid);

    window.addEventListener(
      "resize",
      updateHeight
    );

    return () => {
      observer.disconnect();

      window.removeEventListener(
        "resize",
        updateHeight
      );
    };
  }, []);

  const listEvents = visibleEvents.filter(
    (event, index, allEvents) => {
      const isRecurring = Boolean(
        event?.recurrence?.frequency
      );

      if (!isRecurring) {
        return true;
      }

      const seriesId = getSeriesId(event);

      return (
        allEvents.findIndex(
          currentEvent =>
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

  return (
    <section>
      <div className="year-toolbar">
        <button
          type="button"
          onClick={() =>
            setYear(Number(year) - 1)
          }
        >
          ←
        </button>

        <strong>{year}</strong>

        <button
          type="button"
          onClick={() =>
            setYear(Number(year) + 1)
          }
        >
          →
        </button>
      </div>

      <nav className="tabs">
        {calendars.map(calendar => (
          <button
            type="button"
            key={calendar.id}
            onClick={() =>
              setActive(calendar.id)
            }
            className={
              active === calendar.id
                ? "active"
                : ""
            }
            style={{
              "--tab": "var(--brand)"
            }}
          >
            {calendar.icon} {calendar.name}
          </button>
        ))}

        <button
          type="button"
          className="plus-tab"
          onClick={openModal}
        >
          +
        </button>
      </nav>

      <section className="layout calendar-layout-fixed">
        <section
          ref={calendarGridRef}
          className="calendar-grid annual-grid"
        >
          {monthNames.map(
            (monthName, monthIndex) => (
              <Month
                key={monthName}
                year={Number(year)}
                month={monthIndex}
                events={visibleEvents}
                calendars={calendars}
                onDayClick={handleDayClick}
              />
            )
          )}
        </section>

        <aside
          className="panel event-panel"
          style={
            calendarHeight
              ? {
                  height: `${calendarHeight}px`,
                  maxHeight: `${calendarHeight}px`
                }
              : undefined
          }
        >
          <h2>
            {active === "todos"
              ? "Todos los eventos"
              : `${activeCalendar.icon} ${activeCalendar.name}`}
          </h2>

          <form
            className="event-form"
            onSubmit={addEvent}
          >
            <input
              type="date"
              min={`${year}-01-01`}
              max={`${year}-12-31`}
              value={newEvent.date}
              onChange={event =>
                setNewEvent({
                  ...newEvent,
                  date: event.target.value
                })
              }
            />

            <input
              type="time"
              value={newEvent.time}
              onChange={event =>
                setNewEvent({
                  ...newEvent,
                  time: event.target.value
                })
              }
            />

            <input
              placeholder="Nuevo evento"
              value={newEvent.text}
              onChange={event =>
                setNewEvent({
                  ...newEvent,
                  text: event.target.value
                })
              }
            />

            <div className="quick-event-option">
              <label>🔔 Recordatorio</label>

              <TeliSelect
                value={newEvent.reminder ?? 10}
                ariaLabel="Elegir recordatorio"
                options={reminderOptions}
                onChange={value =>
                  setNewEvent({
                    ...newEvent,
                    reminder: Number(value)
                  })
                }
              />
            </div>

            <div className="quick-event-option">
              <label>🔁 Recurrencia</label>

              <TeliSelect
                value={
                  newEvent.recurrence?.frequency ??
                  "none"
                }
                ariaLabel="Elegir recurrencia"
                options={recurrenceOptions}
                onChange={frequency =>
                  setNewEvent({
                    ...newEvent,
                    recurrence:
                      frequency === "none"
                        ? null
                        : {
                            frequency,
                            interval: 1
                          }
                  })
                }
              />
            </div>

            <button
              type="submit"
              className="quick-event-submit"
            >
              Agregar
            </button>
          </form>

          <div className="events-list">
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
                    <b
                      style={{
                        color: "var(--brand)"
                      }}
                    >
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
                          calendar?.color ||
                          "var(--brand)"
                      }}
                    />
                  )}

                  <p>{event.text}</p>

                  <button
                    type="button"
                    className="delete"
                    onClick={() =>
                      deleteEvent(event)
                    }
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