import { useEffect, useMemo, useState } from "react";

import {
  saveEventToCloud,
  deleteEventFromCloud,
  listenEventsFromCloud
} from "../services/eventsService";

import { todayString } from "../utils/date";

export function useEvents({
  user,
  active,
  year,
  initialEvents
}) {
  const [events, setEvents] = useState(initialEvents);
useEffect(() => {
  if (!user) {
    return undefined;
  }

  const unsubscribe = listenEventsFromCloud(
    cloudEvents => {
      setEvents(cloudEvents);

      localStorage.setItem(
        "telisi_events",
        JSON.stringify(cloudEvents)
      );
    }
  );

  return () => {
    unsubscribe();
  };
}, [user]);
  return {
    events,
    setEvents
  };
}