const integrations = [
  {
  id: "alexa",
  category: "Asistentes",
  name: "Alexa",
  description: "Creá eventos y consultá tu agenda por voz.",
  status: "No conectado",
  action: "Conectar",
  available: true,
  logo: "/integrations/alexa.svg"
},
 {
  id: "google-calendar",
  category: "Calendarios",
  name: "Google Calendar",
  description: "Importá y sincronizá tus eventos.",
  status: "Próximamente",
  action: "Más información",
  available: false,
  logo: "/integrations/google-calendar.svg"
},
  {
  id: "gmail",
  category: "Correo",
  name: "Gmail",
  description: "Detectá fechas y reuniones desde tus correos.",
  status: "Próximamente",
  action: "Más información",
  available: false,
  logo: "/integrations/gmail.svg"
},
  {
  id: "outlook",
  category: "Calendarios",
  name: "Outlook",
  description: "Vinculá calendario y correo de Microsoft.",
  status: "Próximamente",
  action: "Más información",
  available: false,
  logo: "/integrations/outlook.svg"
},
 {
  id: "telisi-cloud",
  category: "Sincronización",
  name: "Telisi Cloud",
  description: "Mantené tus eventos actualizados entre dispositivos.",
  status: "Próximamente",
  action: "Más información",
  available: false,
  logo: "/integrations/telisi-cloud.png"
}
];

const categories = [
  "Asistentes",
  "Calendarios",
  "Correo",
  "Sincronización"
];

export function IntegrationsPage() {
  return (
    <section className="integrations-page">
      <header className="integrations-header">
        <p className="eyebrow">TELISI</p>
        <h2>Centro de integraciones</h2>
        <p>
          Conectá Telisi con tus servicios, dispositivos y asistentes.
        </p>
      </header>

      <div className="integration-sections">
  {categories.map((category) => {
    const categoryIntegrations = integrations.filter(
      (integration) => integration.category === category
    );

    return (
      <section
        key={category}
        className="integration-section"
      >
        <div className="integration-section-header">
          <h3>{category}</h3>
        </div>

        <div className="integrations-grid">
          {categoryIntegrations.map((integration) => (
            <article
              key={integration.id}
              className="integration-card"
            >
        
              <div className="integration-card-content">
                <h3>{integration.name}</h3>

                <p>{integration.description}</p>

                <div className="integration-card-footer">
                  <span
                    className={`integration-status ${
                      integration.available
                        ? "integration-status-disconnected"
                        : "integration-status-soon"
                    }`}
                  >
                    <i />
                    {integration.status}
                  </span>

                  <button
                    type="button"
                    disabled={!integration.available}
                    onClick={() => {
                      if (integration.id === "alexa") {
                        alert(
                          "Configuración de Alexa próximamente"
                        );
                      }
                    }}
                  >
                    {integration.action}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    );
  })}
</div>
    </section>
  );
}