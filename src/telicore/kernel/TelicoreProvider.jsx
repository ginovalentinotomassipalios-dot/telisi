import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState
} from "react";

import { useAuth } from "../../hooks/useAuth";
import { todayString } from "../../utils/date";
import { expandRecurringEvents } from "../events/recurrenceEngine";
import { telicore } from "../index";

export const TelicoreContext = createContext(null);

function futureRangeEnd() {
  const currentYear = new Date().getFullYear();

  /*
   * Dos años hacia adelante alcanzan para:
   * próximos eventos, cumpleaños y rutinas.
   */
  return `${currentYear + 2}-12-31`;
}

export function TelicoreProvider({ children }) {
  const { user, checkingAuth } = useAuth();

  const [calendars, setCalendars] = useState(() =>
    telicore.calendars.getAll()
  );

  const [active, setActiveState] = useState(() =>
    telicore.calendars.getActiveId()
  );

  const [events, setEvents] = useState(() =>
    telicore.events.initialize()
  );

  const [appTheme, setAppThemeState] = useState(() =>
    telicore.settings.getTheme()
  );

  const [year, setYear] = useState(2026);

  useEffect(() => {
    document.body.className =
      `app-theme-${appTheme}`;

    return () => {
      document.body.className = "";
    };
  }, [appTheme]);

  useEffect(() => {
    if (!user) return undefined;

    return telicore.events.listenToCloud(
      cloudEvents => {
        setEvents(cloudEvents);
      }
    );
  }, [user]);

  const setActive = useCallback(calendarId => {
    telicore.calendars.setActiveId(calendarId);
    setActiveState(calendarId);
  }, []);

  const setAppTheme = useCallback(theme => {
    setAppThemeState(
      telicore.settings.setTheme(theme)
    );
  }, []);

  const createCalendar = useCallback(
    async calendarData => {
      const calendar =
        await telicore.calendars.create(
          calendarData
        );

      setCalendars(
        telicore.calendars.getAll()
      );

      setActive(calendar.id);

      return calendar;
    },
    [setActive]
  );

  const createEvent = useCallback(
    async eventData => {
      const creation =
        telicore.events.create(eventData);

      setEvents(telicore.events.getAll());

      try {
        const createdEvent = await creation;

        setEvents(telicore.events.getAll());

        return createdEvent;
      } catch (error) {
        setEvents(telicore.events.getAll());

        console.error(
          "Error guardando evento:",
          error
        );

        return eventData;
      }
    },
    []
  );

  const deleteEvent = useCallback(
    async event => {
      const deletion =
        telicore.events.remove(event);

      setEvents(telicore.events.getAll());

      try {
        await deletion;
      } catch (error) {
        console.error(
          "Error borrando evento:",
          error
        );
      } finally {
        setEvents(telicore.events.getAll());
      }
    },
    []
  );

  /*
   * Genera todas las ocurrencias del año visible.
   */
  const eventsForVisibleYear = useMemo(() => {
  const yearStart = `${year}-01-01`;
  const yearEnd = `${year}-12-31`;

  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonthIndex = today.getMonth();

  const monthlyAndYearlyEvents = events.filter(event => {
    const frequency = event?.recurrence?.frequency;

    return (
      !frequency ||
      frequency === "monthly" ||
      frequency === "yearly"
    );
  });

  const dailyAndWeeklyEvents = events.filter(event => {
    const frequency = event?.recurrence?.frequency;

    return (
      frequency === "daily" ||
      frequency === "weekly"
    );
  });

  /*
   * Eventos normales, mensuales y anuales:
   * se calculan para todo el año visible.
   */
  const fullYearOccurrences = expandRecurringEvents(
    monthlyAndYearlyEvents,
    yearStart,
    yearEnd
  );

  /*
   * Eventos diarios y semanales:
   * solo se muestran durante el mes actual.
   */
  let currentMonthOccurrences = [];

  if (year === currentYear) {
    const month = String(
      currentMonthIndex + 1
    ).padStart(2, "0");

    const lastDay = new Date(
      currentYear,
      currentMonthIndex + 1,
      0
    ).getDate();

    currentMonthOccurrences = expandRecurringEvents(
      dailyAndWeeklyEvents,
      `${currentYear}-${month}-01`,
      `${currentYear}-${month}-${String(lastDay).padStart(2, "0")}`
    );
  }

  return [
    ...fullYearOccurrences,
    ...currentMonthOccurrences
  ].sort((a, b) =>
    `${a.date}${a.time || ""}`.localeCompare(
      `${b.date}${b.time || ""}`
    )
  );
}, [events, year]);

  const visibleEvents = useMemo(() => {
    const list =
      active === "todos"
        ? eventsForVisibleYear
        : eventsForVisibleYear.filter(
            event =>
              event.calendarId === active
          );

    return list;
  }, [
    eventsForVisibleYear,
    active
  ]);

  /*
   * Genera únicamente las ocurrencias de hoy.
   */
  const todayEvents = useMemo(() => {
    const today = todayString();

    return expandRecurringEvents(
      events,
      today,
      today
    ).sort((a, b) =>
      (a.time || "").localeCompare(
        b.time || ""
      )
    );
  }, [events]);

  /*
   * Genera ocurrencias desde hoy hasta dos años adelante
   * para calcular correctamente el próximo evento.
   */
  const nextEvent = useMemo(() => {
    const today = todayString();
    const now = new Date();

    const futureEvents =
      expandRecurringEvents(
        events,
        today,
        futureRangeEnd()
      );

    return (
      futureEvents.find(event => {
        const eventDateTime = new Date(
          `${event.date}T${
            event.time || "00:00"
          }`
        );

        return eventDateTime >= now;
      }) ?? null
    );
  }, [events]);

  const exportData = useCallback(() => {
    const data = {
      version: "0.12.0",
      calendars,

      /*
       * Se exportan los eventos maestros,
       * no las repeticiones virtuales.
       */
      events,
      appTheme
    };

    const blob = new Blob(
      [JSON.stringify(data, null, 2)],
      {
        type: "application/json"
      }
    );

    const link = document.createElement("a");

    link.href = URL.createObjectURL(blob);
    link.download = "telisi-backup.json";
    link.click();

    URL.revokeObjectURL(link.href);
  }, [
    calendars,
    events,
    appTheme
  ]);

  const value = useMemo(
    () => ({
      user,
      checkingAuth,
      calendars,
      active,
      setActive,
      createCalendar,

      /*
       * events contiene únicamente los maestros.
       * visibleEvents contiene las repeticiones visuales.
       */
      events,
      createEvent,
      deleteEvent,
      visibleEvents,
      todayEvents,
      nextEvent,

      appTheme,
      setAppTheme,
      year,
      setYear,
      exportData
    }),
    [
      user,
      checkingAuth,
      calendars,
      active,
      setActive,
      createCalendar,
      events,
      createEvent,
      deleteEvent,
      visibleEvents,
      todayEvents,
      nextEvent,
      appTheme,
      setAppTheme,
      year,
      exportData
    ]
  );

  return (
    <TelicoreContext.Provider value={value}>
      {children}
    </TelicoreContext.Provider>
  );
}