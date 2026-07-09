export function BottomNav({ view, setView }) {
  return (
    <nav className="bottom-nav">
      <button className={view === "home" ? "selected" : ""} onClick={() => setView("home")}>
        🏠<span>Inicio</span>
      </button>
      <button className={view === "calendar" ? "selected" : ""} onClick={() => setView("calendar")}>
        📅<span>Calendario</span>
      </button>
      <button className={view === "settings" ? "selected" : ""} onClick={() => setView("settings")}>
        ⚙️<span>Ajustes</span>
      </button>
    </nav>
  );
}
