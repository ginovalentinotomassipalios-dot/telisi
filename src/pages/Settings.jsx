import { useState } from "react";

import { requestNotificationPermission } from "../services/remindersService";
import { requestFCMToken } from "../services/fcmService";
import { saveDeviceToken } from "../services/deviceService";

import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebase";

import "../styles/settings-personalization.css";

const appThemes = [
  { id: "amethyst", name: "Amatista", color: "#7C4D8B" },
  { id: "ocean", name: "Océano", color: "#3F5F93" },
  { id: "forest", name: "Bosque", color: "#34805A" },
  { id: "crimson", name: "Carmesí", color: "#B35068" },
  { id: "obsidian", name: "Obsidiana", color: "#241029" },
  { id: "pearl", name: "Perla", color: "#C9B7D0" }
];

const calendarPatterns = [
  {
    id: "pattern-none",
    name: "Sin patrón",
    description: "Calendario limpio",
    preview: "none"
  },
  {
    id: "pattern-topography",
    name: "Topografía",
    description: "Líneas orgánicas",
    preview: 'url("/patterns/topography.svg")'
  },
  {
    id: "pattern-paws",
    name: "Patitas",
    description: "Huellas suaves",
    preview: 'url("/patterns/paws.svg")'
  },
  {
    id: "pattern-cats",
    name: "Gatitos",
    description: "Gatitos minimalistas",
    preview: 'url("/patterns/cats.svg")'
  },
  {
    id: "pattern-stars",
    name: "Estrellas",
    description: "Cielo delicado",
    preview: 'url("/patterns/stars.svg")'
  },
  {
    id: "pattern-flowers",
    name: "Flores",
    description: "Flores rosadas",
    preview: 'url("/patterns/flowers.svg")'
  },
  {
    id: "pattern-waves",
    name: "Ondas",
    description: "Movimiento suave",
    preview: 'url("/patterns/waves.svg")'
  },
  {
    id: "pattern-hearts",
    name: "Corazones",
    description: "Detalles románticos",
    preview: 'url("/patterns/hearts.svg")'
  },
  {
    id: "pattern-clouds",
    name: "Nubes",
    description: "Cielo tranquilo",
    preview: 'url("/patterns/clouds.svg")'
  }
];

export function Settings({
  appTheme,
  setAppTheme,
  calendarPattern,
  setCalendarPattern,
  }) {
    const [notificationsReady, setNotificationsReady] = useState(
    typeof Notification !== "undefined" &&
      Notification.permission === "granted"
  );
  async function logout() {
    try {
      await signOut(auth);
      window.location.reload();
    } catch (error) {
      console.error("Error cerrando sesión:", error);
    }
  }

    async function activateNotifications() {
    const permission = await requestNotificationPermission();

    if (permission !== "granted") {
      alert("❌ Permiso de notificaciones rechazado");
      return;
    }

    const token = await requestFCMToken();

    if (!token) {
      alert("❌ No se pudo activar las notificaciones");
      return;
    }

    await saveDeviceToken(token);
    setNotificationsReady(true);
  }

  return (
    <section className="panel settings-panel">
      <h2>Ajustes</h2>

      <p className="muted">Telisi v0.13.0</p>

      <div className="setting-block">
        <h3>Apariencia</h3>

        <p className="muted compact">
          Personalizá los colores y la escena del calendario.
        </p>

        <div className="personalization-grid">
          <section className="personalization-column">
            <div className="personalization-column-header">
              <h3>Temas</h3>
              <p>Elegí la paleta general de Telisi.</p>
            </div>

            <div className="theme-picker">
              {appThemes.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={`theme-option ${
                    appTheme === item.id ? "active" : ""
                  }`}
                  onClick={() => setAppTheme(item.id)}
                >
                  <span
                    className="theme-swatch"
                    style={{ background: item.color }}
                    aria-hidden="true"
                  />

                  <span className="theme-option-copy">{item.name}</span>

                  <span className="choice-indicator" aria-hidden="true">
                    ✓
                  </span>
                </button>
              ))}
            </div>
          </section>

          <section className="personalization-column">
            <div className="personalization-column-header">
              <h3>Patrón del calendario</h3>
              <p>Elegí la ilustración que atraviesa los meses.</p>
            </div>

            <div className="pattern-picker">
              {calendarPatterns.map((pattern) => (
                <button
                  key={pattern.id}
                  type="button"
                  className={`pattern-option ${
                    calendarPattern === pattern.id ? "active" : ""
                  }`}
                  onClick={() => setCalendarPattern(pattern.id)}
                >
                  <span
                    className="pattern-preview"
                    style={{
                      "--preview-pattern": pattern.preview
                    }}
                    aria-hidden="true"
                  />

                  <span className="pattern-option-copy">
                    <strong>{pattern.name}</strong>
                    <small>{pattern.description}</small>
                  </span>

                  <span className="choice-indicator" aria-hidden="true">
                    ✓
                  </span>
                </button>
              ))}
            </div>
          </section>
        </div>
      </div>

            <div className="setting-row">
        <span>Sincronización</span>
        <strong>Conectado ✅</strong>
      </div>

      <div className="setting-row notification-setting-row">
  <span>Notificaciones</span>

  {notificationsReady ? (
    <strong>Activas ✅</strong>
  ) : (
    <button
      type="button"
      className="pill-button"
      onClick={activateNotifications}
    >
      Activar
    </button>
  )}
</div>

      <div className="setting-row">
        <span>Sesión</span>

        <button
          type="button"
          className="pill-button"
          onClick={logout}
        >
          Cerrar sesión
        </button>
      </div>
    </section>
  );
}
