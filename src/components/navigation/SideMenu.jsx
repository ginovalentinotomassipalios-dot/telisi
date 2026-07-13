export function SideMenu({
  isOpen,
  onClose,
  onNavigate,
  activeView
}) {
  if (!isOpen) return null;

  const handleNavigate = (view) => {
    onNavigate(view);
    onClose();
  };

  return (
    <div
      className="side-menu-overlay"
      onClick={onClose}
    >
      <aside
        className="side-menu"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="side-menu-header">
          <div>
            <p className="eyebrow">TELISI</p>
            <h2>Telisi</h2>
          </div>

          <button
  type="button"
  className="ghost icon-button side-menu-close"
  aria-label="Cerrar menú"
  onClick={onClose}
>
  ✕
</button>
        </div>

        <nav className="side-menu-nav">
          <button
            type="button"
            className={activeView === "home" ? "active" : ""}
            onClick={() => handleNavigate("home")}
          >
            <span className="menu-indicator"></span>
            <span>Inicio</span>
          </button>

          <button
            type="button"
            className={activeView === "calendar" ? "active" : ""}
            onClick={() => handleNavigate("calendar")}
          >
            <span className="menu-indicator"></span>
            <span>Calendario</span>
          </button>

          <button
            type="button"
            onClick={() =>
              alert("Importador de eventos - Próximamente")
            }
          >
            <span className="menu-indicator"></span>
            <span>Importar eventos</span>
          </button>
    
          <button
            type="button"
            className={activeView === "settings" ? "active" : ""}
            onClick={() => handleNavigate("settings")}
          >
            <span className="menu-indicator"></span>
            <span>Ajustes</span>
          </button>
        </nav>
      </aside>
    </div>
  );
}