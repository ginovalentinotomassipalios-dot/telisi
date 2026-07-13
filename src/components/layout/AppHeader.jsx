import { Icon } from "../ui/Icon";

export function AppHeader({
  view,
  hideHeader,
  onOpenMenu,
  onNavigate
}) {
  const title =
    view === "home"
      ? "Inicio"
      : view === "calendar"
      ? "Calendario"
      : "Ajustes";

  return (
    <header
      className={`app-header app-header-premium ${
        hideHeader ? "header-hidden" : ""
      }`}
    >
      <button
        className="ghost icon-button"
        aria-label="Menú"
        onClick={onOpenMenu}
      >
        <Icon name="menu" />
      </button>

      <div className="brand-block">
        <div className="logo-mark">✦</div>

        <div>
          <p className="eyebrow">TELISI</p>
          <h1>{title}</h1>
        </div>
      </div>

      <button
        className="ghost icon-button"
        aria-label="Ajustes"
        onClick={() => onNavigate("settings")}
      >
        <Icon name="settings" />
      </button>
    </header>
  );
}