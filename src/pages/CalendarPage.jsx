import { monthNames } from "../data";
import { Month } from "../components/calendar/Month";
import { getCalendar } from "../utils/calendar";
import { shortDate } from "../utils/date";

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

  const activeCalendar =
    getCalendar(calendars, active);


  function handleDayClick(date) {

    console.log(
      "CLICK EN DÍA:",
      date
    );


    setNewEvent({
      ...newEvent,
      date,
      time: "09:00",
      text: "",
      reminder: 10
    });


    openEventModal();

  }


  return (

    <section>


      <div className="year-toolbar">

        <button
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
          onClick={() =>
            setYear(
              Number(year) + 1
            )
          }
        >
          →
        </button>

      </div>



      <nav className="tabs">


        {calendars.map(cal => (

          <button

            key={cal.id}

            onClick={() =>
              setActive(cal.id)
            }

            className={
              active === cal.id
                ? "active"
                : ""
            }

            style={{
              "--tab": "var(--brand)"
            }}

          >

            {cal.icon} {cal.name}

          </button>

        ))}


        <button
          className="plus-tab"
          onClick={openModal}
        >
          +
        </button>


      </nav>




      <section className="layout calendar-layout-fixed">


        <section className="calendar-grid annual-grid">


          {monthNames.map((m, i) => (

            <Month

              key={m}

              year={Number(year)}

              month={i}

              events={visibleEvents}

              calendars={calendars}

              onDayClick={handleDayClick}

            />

          ))}


        </section>




        <aside className="panel event-panel">


          <h2>

            {
              active === "todos"
                ? "Todos los eventos"
                : `${activeCalendar.icon} ${activeCalendar.name}`
            }

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

              onChange={e =>
                setNewEvent({
                  ...newEvent,
                  date: e.target.value
                })
              }

            />



            <input

              type="time"

              value={newEvent.time}

              onChange={e =>
                setNewEvent({
                  ...newEvent,
                  time: e.target.value
                })
              }

            />



            <input

              placeholder="Nuevo evento"

              value={newEvent.text}

              onChange={e =>
                setNewEvent({
                  ...newEvent,
                  text: e.target.value
                })
              }

            />



            <div className="quick-reminder-field">

              <label htmlFor="quick-event-reminder">
                🔔 Recordatorio
              </label>


              <select

                id="quick-event-reminder"

                className="telisi-select"

                value={
                  newEvent.reminder ?? 10
                }

                onChange={e =>
                  setNewEvent({
                    ...newEvent,
                    reminder:
                      Number(
                        e.target.value
                      )
                  })
                }

              >

                <option value="-1">
                  Sin aviso
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

            </div>



            <button type="submit">
              Agregar
            </button>


          </form>




          <div className="events-list">


            {visibleEvents.map((ev, idx) => {


              getCalendar(
                calendars,
                ev.calendarId
              );


              return (

                <div
                  key={
                    ev.cloudId ||
                    `${ev.date}-${ev.time}-${idx}`
                  }
                  className="event-row"
                >


                  <div>

                    <b
                      style={{
                        color: "var(--brand)"
                      }}
                    >
                      {shortDate(ev.date)}
                    </b>


                    <small>
                      {ev.time}
                    </small>

                  </div>



                  {
                    active === "todos" &&

                    <span

                      className="dot"

                      style={{
                        background:
                          "var(--brand)"
                      }}

                    />
                  }



                  <p>
                    {ev.text}
                  </p>



                  <button

                    type="button"

                    className="delete"

                    onClick={() =>
                      deleteEvent(ev)
                    }

                    aria-label={
                      `Eliminar ${ev.text}`
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