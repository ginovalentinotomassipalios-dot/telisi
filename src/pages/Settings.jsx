export function Settings({ theme, setTheme, exportData }) {
  return (
    <section className="panel">
      <h2>Ajustes</h2>
      <p className="muted">Telisi v0.3.0</p>
      <div className="setting-row">
        <span>Tema</span>
        <button className="pill-button" onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
          {theme === "light" ? "Modo oscuro" : "Modo claro"}
        </button>
      </div>
      <div className="setting-row">
        <span>Copia de seguridad</span>
        <button className="pill-button" onClick={exportData}>Exportar</button>
      </div>
      <div className="setting-row">
        <span>Sincronización</span>
        <strong>Próximamente</strong>
      </div>
      <div className="setting-row">
        <span>Notificaciones</span>
        <strong>Próximamente</strong>
      </div>
    </section>
  );
}
