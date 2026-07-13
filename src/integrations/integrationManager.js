const integrationState = {
  alexa: "disconnected",
  googleCalendar: "coming-soon",
  gmail: "coming-soon",
  outlook: "coming-soon",
  telisiCloud: "coming-soon"
};

export function getIntegrationState(id) {
  return integrationState[id] ?? "unknown";
}

export function listIntegrationStates() {
  return { ...integrationState };
}
