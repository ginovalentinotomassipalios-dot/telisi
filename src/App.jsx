import {
  useEffect,
  useMemo,
  useState
} from "react";
import { useIsMobile } from "./hooks/useIsMobile";
import { AppHeader } from "./components/layout/AppHeader";
import { BottomNav } from "./components/navigation/BottomNav";
import { NewCalendarModal } from "./components/modals/NewCalendarModal";
import { NewEventModal } from "./components/modals/NewEventModal";

import { CalendarMobile } from "./pages/CalendarMobile";
import { CalendarPage } from "./pages/CalendarPage";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { Settings } from "./pages/Settings";

import {
  defaultCalendars,
  defaultEvents
} from "./data";

import { todayString } from "./utils/date";


import {
  saveEventToCloud,
  deleteEventFromCloud,
  listenEventsFromCloud
} from "./services/eventsService";

import {
  checkUpcomingNotifications
} from "./services/notificationsService";

import {
  listenAuth
} from "./services/authService";


export function App() {
  const isMobile = useIsMobile();

  const [user, setUser] = useState(null);

  const [checkingAuth, setCheckingAuth] =
    useState(true);

  const [view, setView] =
    useState("home");

  const [year, setYear] =
    useState(2026);

  const [active, setActive] = useState(
    () =>
      localStorage.getItem(
        "telisi_active"
      ) || "academico"
  );

  const [appTheme, setAppTheme] = useState(
    () =>
      localStorage.getItem(
        "telisi_app_theme"
      ) || "amethyst"
  );

  const [calendars, setCalendars] = useState(
    () => {
      try {
        const storedCalendars =
          localStorage.getItem(
            "telisi_calendars"
          );

        return storedCalendars
          ? JSON.parse(storedCalendars)
          : defaultCalendars;
      } catch (error) {
        console.error(
          "No se pudieron leer los calendarios locales:",
          error
        );

        return defaultCalendars;
      }
    }
  );

  const [events, setEvents] = useState(
    () => {
      try {
        const storedEvents =
          localStorage.getItem(
            "telisi_events"
          );

        return storedEvents
          ? JSON.parse(storedEvents)
          : defaultEvents;
      } catch (error) {
        console.error(
          "No se pudieron leer los eventos locales:",
          error
        );

        return defaultEvents;
      }
    }
  );

  const [newEvent, setNewEvent] = useState({
    date: "2026-01-01",
    time: "09:00",
    text: ""
  });

  const [modal, setModal] =
    useState(false);

  const [eventModal, setEventModal] =
    useState(false);

  const [hideHeader, setHideHeader] =
    useState(false);

  const [splash, setSplash] = useState(
    () =>
      !sessionStorage.getItem(
        "telisi_splash_seen"
      )
  );

  const [newCal, setNewCal] = useState({
    name: "",
    icon: "📅",
    color: "#7C4D8B"
  });


  /* =========================
     CONFIGURACIÓN INICIAL
  ========================= */

  /* =========================
     AUTENTICACIÓN
  ========================= */

  useEffect(() => {
    const unsubscribe = listenAuth(
      currentUser => {
        console.log(
          "USUARIO FIREBASE:",
          currentUser
        );

        setUser(currentUser);
        setCheckingAuth(false);
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);


  /* =========================
     ALMACENAMIENTO LOCAL
  ========================= */

  useEffect(() => {
    localStorage.setItem(
      "telisi_calendars",
      JSON.stringify(calendars)
    );
  }, [calendars]);

  useEffect(() => {
    localStorage.setItem(
      "telisi_events",
      JSON.stringify(events)
    );
  }, [events]);

  useEffect(() => {
    localStorage.setItem(
      "telisi_active",
      active
    );
  }, [active]);

  useEffect(() => {
    localStorage.setItem(
      "telisi_app_theme",
      appTheme
    );
  }, [appTheme]);


  /* =========================
     FIRESTORE
  ========================= */

  useEffect(() => {
    if (!user) {
      return undefined;
    }

    const unsubscribe =
      listenEventsFromCloud(
        cloudEvents => {
          setEvents(cloudEvents);

          localStorage.setItem(
            "telisi_events",
            JSON.stringify(
              cloudEvents
            )
          );
        }
      );

    return () => {
      unsubscribe();
    };
  }, [user]);


  /* =========================
     NOTIFICACIONES LOCALES
  ========================= */

  useEffect(() => {
    if (
      !user ||
      events.length === 0
    ) {
      return;
    }

    checkUpcomingNotifications(
      events
    );
  }, [events, user]);


  /* =========================
     SPLASH
  ========================= */

  useEffect(() => {
    if (!splash) {
      return undefined;
    }

    const timer = setTimeout(
      () => {
        sessionStorage.setItem(
          "telisi_splash_seen",
          "true"
        );

        setSplash(false);
      },
      950
    );

    return () => {
      clearTimeout(timer);
    };
  }, [splash]);


  /* =========================
     HEADER AL HACER SCROLL
  ========================= */

  useEffect(() => {
    let lastY =
      window.scrollY;

    function handleScroll() {
      const currentY =
        window.scrollY;

      setHideHeader(
        currentY > lastY &&
        currentY > 80
      );

      lastY = currentY;
    }

    window.addEventListener(
      "scroll",
      handleScroll,
      {
        passive: true
      }
    );

    return () => {
      window.removeEventListener(
        "scroll",
        handleScroll
      );
    };
  }, []);


  /* =========================
     EVENTOS VISIBLES
  ========================= */

  const visibleEvents = useMemo(
    () => {
      const list =
        active === "todos"
          ? events
          : events.filter(
              event =>
                event.calendarId ===
                active
            );

      return list
        .filter(event =>
          event.date?.startsWith(
            String(year)
          )
        )
        .sort((a, b) =>
          `${a.date}${a.time || ""}`
            .localeCompare(
              `${b.date}${b.time || ""}`
            )
        );
    },
    [
      events,
      active,
      year
    ]
  );


  const todayEvents = useMemo(
    () => {
      return events
        .filter(
          event =>
            event.date ===
            todayString()
        )
        .sort((a, b) =>
          (a.time || "")
            .localeCompare(
              b.time || ""
            )
        );
    },
    [events]
  );


  const nextEvent = useMemo(
    () => {
      const now =
        new Date();

      return (
        events
          .slice()
          .sort((a, b) =>
            `${a.date}${a.time || ""}`
              .localeCompare(
                `${b.date}${b.time || ""}`
              )
          )
          .find(event => {
            const eventDate =
              new Date(
                `${event.date}T${
                  event.time ||
                  "00:00"
                }`
              );

            return eventDate >= now;
          }) ||
        events[0] ||
        null
      );
    },
    [events]
  );


  /* =========================
     CREAR EVENTO
  ========================= */

  async function addEvent(event) {
    event.preventDefault();

    if (
      !newEvent.text.trim()
    ) {
      return;
    }

    const target =
      active === "todos"
        ? "academico"
        : active;

    const eventToAdd = {
      ...newEvent,
      calendarId: target
    };

    setEvents(
      currentEvents => [
        ...currentEvents,
        eventToAdd
      ]
    );

    try {
      await saveEventToCloud(
        eventToAdd
      );
    } catch (error) {
      console.error(
        "Error guardando evento:",
        error
      );
    }

    setNewEvent({
      date: newEvent.date,
      time: "09:00",
      text: ""
    });

    setEventModal(false);
  }


  /* =========================
     ELIMINAR EVENTO
  ========================= */

  async function deleteEvent(
    event
  ) {
    setEvents(
      currentEvents =>
        currentEvents.filter(
          currentEvent =>
            currentEvent !== event
        )
    );

    if (!event.cloudId) {
      return;
    }

    try {
      await deleteEventFromCloud(
        event.cloudId
      );
    } catch (error) {
      console.error(
        "Error borrando evento:",
        error
      );
    }
  }


  /* =========================
     CREAR CALENDARIO
  ========================= */

  function createCalendar() {
    if (!newCal.name.trim()) {
      return;
    }

    const id =
      `cal_${Date.now()}`;

    const allCalendar =
      calendars.find(
        calendar =>
          calendar.id === "todos"
      );

    const regularCalendars =
      calendars.filter(
        calendar =>
          calendar.id !== "todos"
      );

    const updatedCalendars = [
      ...regularCalendars,
      {
        id,
        ...newCal
      }
    ];

    if (allCalendar) {
      updatedCalendars.push(
        allCalendar
      );
    }

    setCalendars(
      updatedCalendars
    );

    setActive(id);

    setNewCal({
      name: "",
      icon: "📅",
      color: "#7C4D8B"
    });

    setModal(false);
  }


  /* =========================
     EXPORTAR COPIA
  ========================= */

  function exportData() {
    const data = {
      version: "0.9.0",
      calendars,
      events,
      appTheme
    };

    const blob = new Blob(
      [
        JSON.stringify(
          data,
          null,
          2
        )
      ],
      {
        type:
          "application/json"
      }
    );

    const link =
      document.createElement(
        "a"
      );

    link.href =
      URL.createObjectURL(
        blob
      );

    link.download =
      "telisi-backup.json";

    link.click();

    URL.revokeObjectURL(
      link.href
    );
  }


  /* =========================
     CONTROL DE ACCESO
  ========================= */

  if (checkingAuth) {
    return (
      <main className="login-screen">
        <div className="login-card">
          <div className="splash-mark">
            T
          </div>

          <strong>
            TELISI
          </strong>

          <p>
            Cargando...
          </p>
        </div>
      </main>
    );
  }

  if (!user) {
    return <Login />;
  }


  /* =========================
     APLICACIÓN
  ========================= */

  return (
    <main
      className={
        `shell app-theme-${appTheme}`
      }
      style={{
        "--accent":
          "var(--brand)"
      }}
    >
      <AppHeader
        view={view}
        hideHeader={hideHeader}
      />

      <div
        className="view-fade"
        key={view}
      >
        {view === "home" && (
          <Home
            user={user}
            calendars={calendars}
            events={events}
            nextEvent={nextEvent}
            todayEvents={todayEvents}
            setActive={setActive}
            setView={setView}
            openModal={() =>
              setModal(true)
            }
          />
        )}

        {view === "calendar" && (
          isMobile ? (
            <CalendarMobile
              year={year}
              setYear={setYear}
              calendars={calendars}
              active={active}
              setActive={setActive}
              visibleEvents={
                visibleEvents
              }
              newEvent={newEvent}
              setNewEvent={
                setNewEvent
              }
              addEvent={addEvent}
              deleteEvent={
                deleteEvent
              }
              openModal={() =>
                setModal(true)
              }
            />
          ) : (
            <CalendarPage
              year={year}
              setYear={setYear}
              calendars={calendars}
              active={active}
              setActive={setActive}
              visibleEvents={
                visibleEvents
              }
              newEvent={newEvent}
              setNewEvent={
                setNewEvent
              }
              addEvent={addEvent}
              deleteEvent={
                deleteEvent
              }
              openModal={() =>
                setModal(true)
              }
              openEventModal={() =>
                setEventModal(true)
              }
            />
          )
        )}

        {view === "settings" && (
          <Settings
            appTheme={appTheme}
            setAppTheme={
              setAppTheme
            }
            exportData={exportData}
          />
        )}
      </div>

      <BottomNav
        view={view}
        setView={setView}
      />

      {splash && (
        <div className="splash-screen">
          <div className="splash-mark">
            T
          </div>

          <strong>
            TELISI
          </strong>

          <span>
            Organizá tu día.
          </span>
        </div>
      )}

      {modal && (
        <NewCalendarModal
          newCal={newCal}
          setNewCal={setNewCal}
          createCalendar={
            createCalendar
          }
          closeModal={() =>
            setModal(false)
          }
        />
      )}

      {eventModal && (
        <NewEventModal
          newEvent={newEvent}
          setNewEvent={
            setNewEvent
          }
          addEvent={addEvent}
          closeModal={() =>
            setEventModal(false)
          }
        />
      )}
    </main>
  );
}