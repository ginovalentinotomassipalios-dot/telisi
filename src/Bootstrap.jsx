import { useEffect, useState } from "react";
import { App } from "./App";
import { initializeTelicore } from "./telicore";
import { TelicoreProvider } from "./telicore/kernel/TelicoreProvider";

export function Bootstrap() {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    initializeTelicore()
      .then(() => mounted && setReady(true))
      .catch(bootError => {
        console.error("[Bootstrap] No se pudo iniciar Telisi.", bootError);
        if (mounted) setError(bootError);
      });

    return () => {
      mounted = false;
    };
  }, []);

  if (error) {
    return (
      <main className="login-screen">
        <div className="login-card">
          <div className="splash-mark">T</div>
          <h2>Error al iniciar Telisi</h2>
          <small>{error.message || String(error)}</small>
        </div>
      </main>
    );
  }

  if (!ready) {
    return (
      <main className="login-screen">
        <div className="login-card">
          <div className="splash-mark">T</div>
          <strong>TELISI</strong>
          <small>Inicializando Telicore...</small>
        </div>
      </main>
    );
  }

  return (
    <TelicoreProvider>
      <App />
    </TelicoreProvider>
  );
}
