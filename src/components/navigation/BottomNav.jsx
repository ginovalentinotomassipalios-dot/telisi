import { Icon } from "../ui/Icon";

export function BottomNav({ view, setView }) {
  return (
    <nav className="bottom-nav premium-nav">
      <button className={view === "home" ? "selected" : ""} onClick={() => setView("home")}>
        <Icon name="home" />
        <span>Inicio</span>
      </button>
      <button className={view === "calendar" ? "selected" : ""} onClick={() => setView("calendar")}>
        <Icon name="calendar" />
        <span>Calendario</span>
      </button>
      <button className={view === "settings" ? "selected" : ""} onClick={() => setView("settings")}>
        <Icon name="settings" />
        <span>Ajustes</span>
      </button>
    </nav>
  );
}
