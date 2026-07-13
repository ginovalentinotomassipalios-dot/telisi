import { Icon } from "../ui/Icon";

export function BottomNav({ view, setView, openEventModal }) {
  return (
    <nav className="bottom-nav premium-nav">
      <button
        className={view === "home" ? "selected" : ""}
        onClick={() => setView("home")}
      >
        <Icon name="home" />
        <span>Inicio</span>
      </button>

      <button
        className="add-event-button"
        onClick={openEventModal}
      >
        <Icon name="plus" />
        <span>Nuevo</span>
      </button>

      <button
        className={view === "calendar" ? "selected" : ""}
        onClick={() => setView("calendar")}
      >
        <Icon name="calendar" />
        <span>Calendario</span>
      </button>
    </nav>
  );
}