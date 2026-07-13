import { calendarService } from "./calendars/calendarService";
import { eventService } from "./events/eventService";
import { integrationRegistry } from "./integrations/integrationRegistry";
import { notificationIntegration } from "./notifications/notificationIntegration";
import { settingsService } from "./settings/settingsService";
import { localStorageAdapter } from "./storage/localStorageAdapter";

let initialized = false;

export async function initializeTelicore() {
  if (initialized) return telicore;

  integrationRegistry.register("notifications", notificationIntegration);
  calendarService.saveAll(calendarService.getAll());
  settingsService.setTheme(settingsService.getTheme());

  initialized = true;
  return telicore;
}

export const telicore = {
  calendars: calendarService,
  events: eventService,
  integrations: integrationRegistry,
  settings: settingsService,
  storage: localStorageAdapter
};

export {
  calendarService,
  eventService,
  integrationRegistry,
  settingsService,
  localStorageAdapter
};
