import { monthNames, shortWeekdays } from "../data";
import { getCalendar } from "../utils/calendar";

export function Month({ year, month, events, calendars }) {
  const firstDay = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();
  const cells = [];

  for (let i = 0; i < firstDay; i++) {
    cells.push(<div key={"e" + i} className="day empty" />);
  }

  for (let d = 1; d <= totalDays; d++) {
    const date = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    const dayEvents = events.filter(e => e.date === date);
    const cal = dayEvents[0] ? getCalendar(calendars, dayEvents[0].calendarId) : null;

    cells.push(
      <div
        key={date}
        className={"day " + (dayEvents.length ? "has-event" : "")}
        style={cal ? { "--day": cal.color } : {}}
        title={dayEvents.map(e => e.text).join("\n")}
      >
        {d}
      </div>
    );
  }

  return (
    <article className="month">
      <h3>{monthNames[month]}</h3>
      <div className="weekdays">
        {shortWeekdays.map((w, idx) => <span key={idx}>{w}</span>)}
      </div>
      <div className="days">{cells}</div>
    </article>
  );
}
