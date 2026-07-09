import { firebaseTest } from "../utils/firebaseTest";
import { saveEventToCloud } from "../services/eventsService";

const appThemes = [
  { id: "amethyst", name: "Amatista", color: "#7C4D8B" },
  { id: "ocean", name: "Océano", color: "#3F5F93" },
  { id: "forest", name: "Bosque", color: "#34805A" },
  { id: "crimson", name: "Carmesí", color: "#B35068" },
  { id: "obsidian", name: "Obsidiana", color: "#241029" },
  { id: "pearl", name: "Perla", color: "#C9B7D0" }
];

export function Settings({ appTheme, setAppTheme, exportData }) {
  return (
    <section className="panel settings-panel">
      <h2>Ajustes</h2>
      <p className="muted">Telisi v0.6.4</p>

      <div className="setting-block">
        <h3>Apariencia</h3>
        <p className="muted compact">Elegí un color principal para toda la aplicación.</p>

        <div className="theme-picker">
          {appThemes.map(item => (
            <button
              key={item.id}
              className={appTheme === item.id ? "theme-option active" : "theme-option"}
              onClick={() => setAppTheme(item.id)}
            >
              <span style={{ background: item.color }}></span>
              {item.name}
            </button>
          ))}
        </div>
      </div>

      <div className="setting-row">
        <span>Copia de seguridad</span>
        <button className="pill-button" onClick={exportData}>Exportar</button>
      </div>

      <div className="setting-row">
        <span>Sincronización</span>
        <button
          className="pill-button"
          onClick={async () => {
            try {
              await firebaseTest();
              alert("✅ Firebase conectado correctamente");
            } catch (err) {
              console.error(err);
              alert("❌ Error:\n" + err.message);
            }
          }}
        >
          Probar Firebase
        </button>
      </div>

      <div className="setting-row">
        <span>Evento de prueba</span>
        <button
          className="pill-button"
          onClick={async () => {
            try {
              await saveEventToCloud({
                text: "Evento de prueba",
                date: "2026-07-10",
                time: "10:00",
                calendarId: "academico"
              });

              alert("✅ Evento guardado en Firestore");
            } catch (err) {
              console.error(err);
              alert("❌ Error:\n" + err.message);
            }
          }}
        >
          Guardar en la nube
        </button>
      </div>

      <div className="setting-row">
        <span>Notificaciones</span>
        <strong>Próximamente</strong>
      </div>
    </section>
  );
}