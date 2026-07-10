import {
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";

import { monthNames } from "../data";
import { getCalendar } from "../utils/calendar";
import { shortDate } from "../utils/date";

export function CalendarMobile({
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
  openModal
}) {
  const today = new Date();

  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();

  const [selectedMonth, setSelectedMonth] =
    useState(currentMonth);

  const currentMonthRef = useRef(null);

  useEffect(() => {
    setYear(currentYear);
    setSelectedMonth(currentMonth);

    const timeout = setTimeout(() => {
      currentMonthRef.current?.scrollIntoView({
        behavior: "auto",
        inline: "center",
        block: "nearest"
      });
    }, 100);

    return () => clearTimeout(timeout);
  }, []);

  const monthEvents = useMemo(() => {
    return visibleEvents
      .filter(event => {
        if (!event.date) {
          return false;
        }

        const [eventYear, eventMonth] =
          event.date.split("-").map(Number);

        return (
          eventYear === Number(year) &&
          eventMonth - 1 === selectedMonth
        );
      })
      .sort((eventA, eventB) => {
        const firstDate =
          `${eventA.date}T${eventA.time || "00:00"}`;

        const secondDate =
          `${eventB.date}T${eventB.time || "00:00"}`;

        return firstDate.localeCompare(secondDate);
      });
  }, [
    visibleEvents,
    year,
    selectedMonth
  ]);

  const groupedEvents = useMemo(() => {
    return monthEvents.reduce(
      (groups, event) => {
        if (!groups[event.date]) {
          groups[event.date] = [];
        }

        groups[event.date].push(event);

        return groups;
      },
      {}
    );
  }, [monthEvents]);

  function handleMonthClick(monthIndex) {
    setSelectedMonth(monthIndex);
  }

  return (
    <section className="calendar-mobile">

      <section className="calendar-mobile-create">

        <h2>Crear evento</h2>

        <form
          className="calendar-mobile-form"
          onSubmit={addEvent}
        >
          <input
            type="text"
            placeholder="Nombre del evento"
            value={newEvent.text}
            onChange={event =>
              setNewEvent({
                ...newEvent,
                text: event.target.value
              })
            }
          />

          <div className="calendar-mobile-date-time">

            <input
              type="date"
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

          </div>

          <select
            value={newEvent.reminder ?? 10}
            onChange={event =>
              setNewEvent({
                ...newEvent,
                reminder: Number(
                  event.target.value
                )
              })
            }
          >
            <option value="-1">
              Sin recordatorio
            </option>

            <option value="0">
              Al comenzar
            </option>

            <option value="5">
              5 minutos antes
            </option>

            <option value="10">
              10 minutos antes
            </option>

            <option value="30">
              30 minutos antes
            </option>

            <option value="60">
              1 hora antes
            </option>
          </select>

          <button type="submit">
            Agregar evento
          </button>

        </form>

      </section>

      <nav className="calendar-mobile-tabs">

        {calendars.map(calendar => (

          <button
            key={calendar.id}
            type="button"
            className={
              active === calendar.id
                ? "active"
                : ""
            }
            onClick={() =>
              setActive(calendar.id)
            }
          >
            {calendar.icon} {calendar.name}
          </button>

        ))}

        <button
          type="button"
          className="calendar-mobile-plus"
          onClick={openModal}
          aria-label="Crear calendario"
        >
          +
        </button>

      </nav>

      <section className="calendar-mobile-months">

        <div className="calendar-mobile-year">

          <button
            type="button"
            onClick={() =>
              setYear(
                Number(year) - 1
              )
            }
          >
            ←
          </button>

          <strong>
            {year}
          </strong>

          <button
            type="button"
            onClick={() =>
              setYear(
                Number(year) + 1
              )
            }
          >
            →
          </button>

        </div>

        <nav className="calendar-mobile-month-bar">

          {monthNames.map((month, index) => (

            <button
              key={month}
              type="button"
              ref={
                index === currentMonth &&
                Number(year) === currentYear
                  ? currentMonthRef
                  : null
              }
              className={
                selectedMonth === index
                  ? "active"
                  : ""
              }
              onClick={() =>
                handleMonthClick(index)
              }
            >
              {month}
            </button>

          ))}

        </nav>

      </section>

      <section className="calendar-mobile-detail">

        <header className="calendar-mobile-detail-header">

          <div>
            <small>Eventos de</small>

            <h2>
              {monthNames[selectedMonth]} {year}
            </h2>
          </div>

          <span>
            {monthEvents.length}
          </span>

        </header>

        {
          monthEvents.length === 0 ? (

            <div className="calendar-mobile-empty">
              No hay eventos durante este mes.
            </div>

          ) : (

            <div className="calendar-mobile-events">

              {Object.entries(
                groupedEvents
              ).map(([date, events]) => (

                <section
                  key={date}
                  className="calendar-mobile-day"
                >

                  <h3>
                    {shortDate(date)}
                  </h3>

                  {events.map(
                    (event, index) => {
                      const eventCalendar =
                        getCalendar(
                          calendars,
                          event.calendarId
                        );

                      return (

                        <article
                          key={
                            event.cloudId ||
                            `${event.date}-${event.time}-${index}`
                          }
                          className="calendar-mobile-event-card"
                        >

                          <div className="calendar-mobile-event-time">
                            {event.time || "Sin hora"}
                          </div>

                          <div className="calendar-mobile-event-info">

                            <strong>
                              {event.text}
                            </strong>

                            {
                              eventCalendar && (
                                <small>
                                  {eventCalendar.icon}{" "}
                                  {eventCalendar.name}
                                </small>
                              )
                            }

                          </div>

                          <button
                            type="button"
                            className="calendar-mobile-delete"
                            onClick={() =>
                              deleteEvent(event)
                            }
                            aria-label={
                              `Eliminar ${event.text}`
                            }
                          >
                            ×
                          </button>

                        </article>

                      );
                    }
                  )}

                </section>

              ))}

            </div>

          )
        }

      </section>

    </section>
  );
}