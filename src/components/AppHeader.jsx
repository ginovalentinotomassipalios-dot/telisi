import { Icon } from "./Icon";

export function AppHeader({ view, hideHeader }) {
  const title = view === "home" ? "Inicio" : view === "calendar" ? "Calendario" : "Ajustes";

  return (
    <header className={`app-header app-header-premium ${hideHeader ? "header-hidden" : ""}`}>
      <button className="ghost icon-button" aria-label="Menú">
        <Icon name="menu" />
      </button>

      <div className="brand-block">
        <div className="logo-mark">✦</div>
        <div>
          <p className="eyebrow">TELISI</p>
          <h1>{title}</h1>
        </div>
      </div>

      <button className="ghost icon-button" aria-label="Notificaciones">
        <Icon name="bell" />
      </button>
    </header>
  );
}
