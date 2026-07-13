import {
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";

import { monthNames } from "../data";
import { getCalendar } from "../utils/calendar";
import { shortDate } from "../utils/date";

const weekDays = [
  "Lun",
  "Mar",
  "Mié",
  "Jue",
  "Vie",
  "Sáb",
  "Dom"
];

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
  openModal,
  openEventModal
}) {
  const today = new Date();

  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();

  const [selectedMonth, setSelectedMonth] =
    useState(currentMonth);

  const [slideDirection, setSlideDirection] =
    useState("");

  const gridTouchStartRef = useRef(null);
  const monthBarTouchStartRef = useRef(null);

  const [monthBarAnimation, setMonthBarAnimation] =
    useState("");

  const visibleMonthItems = useMemo(() => {
    return [-3, -2, -1, 0, 1, 2, 3].map(
      offset => {
        const date = new Date(
          Number(year),
          selectedMonth + offset,
          1
        );

        return {
          offset,
          monthIndex: date.getMonth(),
          year: date.getFullYear(),
          name: monthNames[date.getMonth()]
        };
      }
    );
  }, [year, selectedMonth]);

  const monthGridDays = useMemo(() => {
    const selectedYear = Number(year);

    const firstDay = new Date(
      selectedYear,
      selectedMonth,
      1
    );

    const daysInMonth = new Date(
      selectedYear,
      selectedMonth + 1,
      0
    ).getDate();

    const startingPosition =
      (firstDay.getDay() + 6) % 7;

    const emptyDays =
      Array(startingPosition).fill(null);

    const numberedDays =
      Array.from(
        { length: daysInMonth },
        (_, index) => index + 1
      );

    return [
      ...emptyDays,
      ...numberedDays
    ];
  }, [year, selectedMonth]);

  useEffect(() => {
    setYear(currentYear);
    setSelectedMonth(currentMonth);
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

  const eventCountByDate = useMemo(() => {
    return monthEvents.reduce(
      (counts, event) => {
        counts[event.date] =
          (counts[event.date] || 0) + 1;

        return counts;
      },
      {}
    );
  }, [monthEvents]);

  function handleMonthItemClick(item) {
    if (item.offset === 0) {
      return;
    }

    moveToRelativeMonth(item.offset);
  }

  function moveToRelativeMonth(offset) {
    const direction =
      offset > 0 ? 1 : -1;

    setMonthBarAnimation(
      direction > 0
        ? "months-moving-left"
        : "months-moving-right"
    );

    setSlideDirection(
      direction > 0
        ? "slide-left"
        : "slide-right"
    );

    setTimeout(() => {
      const nextDate = new Date(
        Number(year),
        selectedMonth + offset,
        1
      );

      setYear(nextDate.getFullYear());
      setSelectedMonth(nextDate.getMonth());

      setMonthBarAnimation(
        direction > 0
          ? "months-enter-right"
          : "months-enter-left"
      );

      setSlideDirection(
        direction > 0
          ? "enter-right"
          : "enter-left"
      );

      setTimeout(() => {
        setMonthBarAnimation("");
        setSlideDirection("");
      }, 220);
    }, 180);
  }

  function changeMonth(direction) {
    moveToRelativeMonth(direction);
  }

  function handleGridTouchStart(event) {
    gridTouchStartRef.current =
      event.touches[0].clientX;
  }

  function handleGridTouchEnd(event) {
    if (gridTouchStartRef.current === null) {
      return;
    }

    const touchEndX =
      event.changedTouches[0].clientX;

    const swipeDistance =
      touchEndX - gridTouchStartRef.current;

    const minimumSwipeDistance = 50;

    if (
      Math.abs(swipeDistance) <
      minimumSwipeDistance
    ) {
      gridTouchStartRef.current = null;
      return;
    }

    if (swipeDistance < 0) {
      changeMonth(1);
    } else {
      changeMonth(-1);
    }

    gridTouchStartRef.current = null;
  }

  function handleMobileDayClick(day) {
    const monthNumber = String(
      selectedMonth + 1
    ).padStart(2, "0");

    const dayNumber = String(day).padStart(
      2,
      "0"
    );

    const selectedDate =
      `${year}-${monthNumber}-${dayNumber}`;

    setNewEvent({
      ...newEvent,
      date: selectedDate,
      time: "09:00",
      text: "",
      reminder: 10,
      recurrence: null
    });

    openEventModal();
  }

  function handleMonthBarTouchStart(event) {
    monthBarTouchStartRef.current =
      event.touches[0].clientX;
  }

  function handleMonthBarTouchEnd(event) {
    if (
      monthBarTouchStartRef.current === null
    ) {
      return;
    }

    const touchEndX =
      event.changedTouches[0].clientX;

    const swipeDistance =
      touchEndX -
      monthBarTouchStartRef.current;

    monthBarTouchStartRef.current = null;

    if (Math.abs(swipeDistance) < 45) {
      return;
    }

    if (swipeDistance < 0) {
      changeMonth(1);
    } else {
      changeMonth(-1);
    }
  }

  return (
    <section className="calendar-mobile">
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

          <strong>{year}</strong>

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

        <div
          className="calendar-mobile-month-window"
          onTouchStart={handleMonthBarTouchStart}
          onTouchEnd={handleMonthBarTouchEnd}
        >
          <div
            className={
              `calendar-mobile-month-track ${monthBarAnimation}`
            }
          >
            {visibleMonthItems.map(item => (
              <button
                key={`${item.year}-${item.monthIndex}-${item.offset}`}
                type="button"
                className={
                  item.offset === 0
                    ? "calendar-mobile-month-name current"
                    : "calendar-mobile-month-name"
                }
                onClick={() =>
                  handleMonthItemClick(item)
                }
              >
                <span>{item.name}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section
        className={`calendar-mobile-grid-card ${slideDirection}`}
        onTouchStart={handleGridTouchStart}
        onTouchEnd={handleGridTouchEnd}
      >
        <header className="calendar-mobile-grid-header">
          <h2>
            {monthNames[selectedMonth]}
          </h2>

          <span>{year}</span>
        </header>

        <div className="calendar-mobile-weekdays">
          {weekDays.map(dayName => (
            <span key={dayName}>
              {dayName}
            </span>
          ))}
        </div>

        <div className="calendar-mobile-days-grid">
          {monthGridDays.map((day, index) => {
            if (!day) {
              return (
                <span
                  key={`empty-${index}`}
                  className="calendar-mobile-empty-day"
                />
              );
            }

            const monthNumber =
              String(selectedMonth + 1).padStart(
                2,
                "0"
              );

            const dayNumber =
              String(day).padStart(
                2,
                "0"
              );

            const dateString =
              `${year}-${monthNumber}-${dayNumber}`;

            const isToday =
              Number(year) === currentYear &&
              selectedMonth === currentMonth &&
              day === today.getDate();

            const isSelected =
              newEvent.date === dateString;

            const eventCount =
              eventCountByDate[dateString] || 0;

            return (
              <button
                key={dateString}
                type="button"
                className={[
                  "calendar-mobile-day-button",
                  isToday ? "today" : "",
                  isSelected ? "selected" : "",
                  eventCount > 0
                    ? "has-events"
                    : ""
                ]
                  .filter(Boolean)
                  .join(" ")}
                onClick={() =>
                  handleMobileDayClick(day)
                }
                aria-label={
                  `${day} de ${monthNames[selectedMonth]}`
                }
              >
                <span className="calendar-mobile-day-number">
                  {day}
                </span>

                {eventCount > 0 && (
                  <span
                    className="calendar-mobile-day-event-dot"
                    aria-label={
                      `${eventCount} eventos`
                    }
                  />
                )}
              </button>
            );
          })}
        </div>
      </section>

      <section className="calendar-mobile-detail">
        <header className="calendar-mobile-detail-header">
          <div>
            <small>Eventos de</small>

            <h2>
              {monthNames[selectedMonth]} {year}
            </h2>
          </div>

          <span>{monthEvents.length}</span>
        </header>

        {monthEvents.length === 0 ? (
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
                <h3>{shortDate(date)}</h3>

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
                          event.occurrenceId ||
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

                          {eventCalendar && (
                            <small>
                              {eventCalendar.icon}{" "}
                              {eventCalendar.name}
                            </small>
                          )}
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
        )}
      </section>
    </section>
  );
}