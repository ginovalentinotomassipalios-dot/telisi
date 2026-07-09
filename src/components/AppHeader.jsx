export function AppHeader({ view, theme, setTheme }) {
  return (
    <header className="app-header">
      <button className="ghost">☰</button>
      <div>
        <p className="eyebrow">TELISI</p>
        <h1>{view === "home" ? "Inicio" : view === "calendar" ? "Calendario" : "Ajustes"}</h1>
      </div>
      <button className="ghost" onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
        {theme === "light" ? "🌙" : "☀️"}
      </button>
    </header>
  );
}
