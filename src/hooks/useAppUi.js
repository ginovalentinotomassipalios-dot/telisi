import { useState } from "react";
import { todayString } from "../utils/date";

function createEmptyEvent(date = todayString()) {
  return {
    date,
    time: "09:00",
    text: "",
    reminder: 10,
    recurrence: null
  };
}

export function useAppUi() {
  const [view, setView] = useState("home");
  const [menuOpen, setMenuOpen] = useState(false);
  const [calendarModalOpen, setCalendarModalOpen] = useState(false);
  const [eventModalOpen, setEventModalOpen] = useState(false);

  const [newEvent, setNewEvent] = useState(() =>
    createEmptyEvent()
  );

  const [newCalendar, setNewCalendar] = useState({
    name: "",
    icon: "📅",
    color: "#7C4D8B"
  });

  return {
    view,
    setView,

    menuOpen,
    openMenu: () => setMenuOpen(true),
    closeMenu: () => setMenuOpen(false),

    calendarModalOpen,
    openCalendarModal: () => setCalendarModalOpen(true),
    closeCalendarModal: () => setCalendarModalOpen(false),

    eventModalOpen,
    openEventModal: () => setEventModalOpen(true),
    closeEventModal: () => setEventModalOpen(false),

    newEvent,
    setNewEvent,

    resetNewEvent: () =>
      setNewEvent(current =>
        createEmptyEvent(current.date || todayString())
      ),

    newCalendar,
    setNewCalendar,

    resetNewCalendar: () =>
      setNewCalendar({
        name: "",
        icon: "📅",
        color: "#7C4D8B"
      })
  };
}