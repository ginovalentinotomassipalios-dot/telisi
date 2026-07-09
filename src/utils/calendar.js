export function getCalendar(calendars, id) {
  return calendars.find(c => c.id === id) || calendars[0];
}
