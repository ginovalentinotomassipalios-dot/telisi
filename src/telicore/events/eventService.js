import { defaultEvents } from "../../data";
import {
  deleteEventFromCloud,
  listenEventsFromCloud,
  saveEventToCloud
} from "../../services/eventsService";
import { todayString } from "../../utils/date";
import { integrationRegistry } from "../integrations/integrationRegistry";
import { localStorageAdapter } from "../storage/localStorageAdapter";

const EVENTS_KEY = "telisi_events";

function isRecurringEvent(event) {
  return Boolean(event?.recurrence?.frequency);
}

function isExpiredNonRecurring(event, today) {
  return (
    typeof event?.date === "string" &&
    event.date < today &&
    !isRecurringEvent(event)
  );
}

function removeExpiredNonRecurring(events, today) {
  return events.filter(
    event => !isExpiredNonRecurring(event, today)
  );
}

export const eventService = {
  initialize() {
    const today = todayString();
    const storedEvents = this.getAll();

    /*
     * Los recurrentes se conservan con su fecha original.
     * Solo se eliminan los eventos normales vencidos.
     */
    const validEvents = removeExpiredNonRecurring(
      storedEvents,
      today
    );

    localStorageAdapter.set(EVENTS_KEY, validEvents);

    return validEvents;
  },

  getAll() {
    const events =
      localStorageAdapter.get(EVENTS_KEY, defaultEvents);

    return Array.isArray(events)
      ? events
      : defaultEvents;
  },

  replaceAll(events) {
    const normalized =
      Array.isArray(events) ? events : [];

    localStorageAdapter.set(EVENTS_KEY, normalized);

    integrationRegistry.emit(
      "onEventsChanged",
      normalized
    );

    return normalized;
  },

  listenToCloud(callback) {
    return listenEventsFromCloud(async cloudEvents => {
      const today = todayString();

      const expiredEvents = cloudEvents.filter(event =>
        isExpiredNonRecurring(event, today)
      );

      const validEvents = removeExpiredNonRecurring(
        cloudEvents,
        today
      );

      const deletionResults = await Promise.allSettled(
        expiredEvents
          .filter(event => event.cloudId)
          .map(event =>
            deleteEventFromCloud(event.cloudId)
          )
      );

      deletionResults.forEach(result => {
        if (result.status === "rejected") {
          console.error(
            "[Telicore] No se pudo eliminar un evento pasado de Firebase.",
            result.reason
          );
        }
      });

      const events = this.replaceAll(validEvents);
      callback(events);
    });
  },

  async create(eventData) {
    const event = {
      ...eventData,
      text: String(eventData?.text ?? "").trim(),

      recurrence: eventData?.recurrence
        ? {
            frequency:
              eventData.recurrence.frequency,
            interval: Math.max(
              1,
              Number(eventData.recurrence.interval) || 1
            )
          }
        : null
    };

    if (!event.text) {
      throw new Error(
        "[Telicore] El evento necesita un título."
      );
    }

    this.replaceAll([
      ...this.getAll(),
      event
    ]);

    await integrationRegistry.emit(
      "onEventCreated",
      event
    );

    try {
      const cloudId =
        await saveEventToCloud(event);

      const savedEvent = {
        ...event,
        cloudId
      };

      this.replaceAll(
        this.getAll().map(currentEvent =>
          currentEvent === event
            ? savedEvent
            : currentEvent
        )
      );

      return savedEvent;
    } catch (error) {
      console.error(
        "[Telicore] El evento quedó local, pero falló la nube.",
        error
      );

      throw error;
    }
  },

  async remove(event) {
    /*
     * Si se tocó una repetición virtual,
     * se elimina el evento maestro completo.
     */
    const masterEvent =
      event?._masterEvent ?? event;

    this.replaceAll(
      this.getAll().filter(currentEvent => {
        if (
          masterEvent.cloudId &&
          currentEvent.cloudId
        ) {
          return (
            currentEvent.cloudId !==
            masterEvent.cloudId
          );
        }

        return currentEvent !== masterEvent;
      })
    );

    await integrationRegistry.emit(
      "onEventDeleted",
      masterEvent
    );

    if (masterEvent.cloudId) {
      await deleteEventFromCloud(
        masterEvent.cloudId
      );
    }

    return true;
  }
};