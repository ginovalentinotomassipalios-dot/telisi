function parseDate(dateString) {
  const [year, month, day] = String(dateString)
    .split("-")
    .map(Number);

  return new Date(year, month - 1, day);
}

function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function daysInMonth(year, monthIndex) {
  return new Date(year, monthIndex + 1, 0).getDate();
}

function isRecurringEvent(event) {
  return Boolean(event?.recurrence?.frequency);
}

function createOccurrence(event, occurrenceDate) {
  return {
    ...event,

    // Fecha virtual mostrada en el calendario.
    date: occurrenceDate,

    // Permite identificar cada repetición visual.
    occurrenceId: `${
      event.cloudId ?? `${event.text}-${event.date}`
    }-${occurrenceDate}`,

    isOccurrence: occurrenceDate !== event.date,

    // Referencia temporal al evento maestro.
    // No se guarda en Firebase.
    _masterEvent: event
  };
}

function getNextDate(currentDateString, event) {
  const currentDate = parseDate(currentDateString);
  const recurrence = event.recurrence ?? {};
  const interval = Math.max(1, Number(recurrence.interval) || 1);

  const originalDate = parseDate(event.date);
  const anchorDay = originalDate.getDate();
  const anchorMonth = originalDate.getMonth();

  switch (recurrence.frequency) {
    case "daily": {
      currentDate.setDate(currentDate.getDate() + interval);
      return formatDate(currentDate);
    }

    case "weekly": {
      currentDate.setDate(currentDate.getDate() + 7 * interval);
      return formatDate(currentDate);
    }

    case "monthly": {
      const nextMonthNumber =
        currentDate.getMonth() + interval;

      const targetYear =
        currentDate.getFullYear() +
        Math.floor(nextMonthNumber / 12);

      const targetMonth =
        ((nextMonthNumber % 12) + 12) % 12;

      const targetDay = Math.min(
        anchorDay,
        daysInMonth(targetYear, targetMonth)
      );

      return formatDate(
        new Date(targetYear, targetMonth, targetDay)
      );
    }

    case "yearly": {
      const targetYear =
        currentDate.getFullYear() + interval;

      const targetDay = Math.min(
        anchorDay,
        daysInMonth(targetYear, anchorMonth)
      );

      return formatDate(
        new Date(targetYear, anchorMonth, targetDay)
      );
    }

    default:
      return null;
  }
}

function expandSingleRecurringEvent(event, startDate, endDate) {
  const occurrences = [];
  let occurrenceDate = event.date;

  /*
   * Avanza hasta alcanzar el período visible.
   * La fecha original sigue intacta.
   */
  while (occurrenceDate < startDate) {
    const nextDate = getNextDate(occurrenceDate, event);

    if (!nextDate || nextDate <= occurrenceDate) {
      return occurrences;
    }

    occurrenceDate = nextDate;
  }

  /*
   * Genera todas las ocurrencias comprendidas en el período.
   */
  while (occurrenceDate <= endDate) {
    occurrences.push(
      createOccurrence(event, occurrenceDate)
    );

    const nextDate = getNextDate(occurrenceDate, event);

    if (!nextDate || nextDate <= occurrenceDate) {
      break;
    }

    occurrenceDate = nextDate;
  }

  return occurrences;
}

export function expandRecurringEvents(
  events,
  startDate,
  endDate
) {
  if (!Array.isArray(events)) {
    return [];
  }

  const expandedEvents = [];

  events.forEach(event => {
    if (!event?.date) {
      return;
    }

    if (!isRecurringEvent(event)) {
      if (
        event.date >= startDate &&
        event.date <= endDate
      ) {
        expandedEvents.push(event);
      }

      return;
    }

    expandedEvents.push(
      ...expandSingleRecurringEvent(
        event,
        startDate,
        endDate
      )
    );
  });

  return expandedEvents.sort((a, b) =>
    `${a.date}${a.time || ""}`.localeCompare(
      `${b.date}${b.time || ""}`
    )
  );
}