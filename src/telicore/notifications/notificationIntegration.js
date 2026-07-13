import { checkUpcomingNotifications } from "../../services/notificationsService";

export const notificationIntegration = {
  onEventsChanged(events) {
    checkUpcomingNotifications(events);
  },

  onEventCreated() {
    return true;
  },

  onEventDeleted() {
    return true;
  }
};
