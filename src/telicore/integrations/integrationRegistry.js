const integrations = new Map();

export const integrationRegistry = {
  register(name, integration) {
    if (!name || !integration) {
      throw new Error("[Telicore] La integración necesita nombre e implementación.");
    }

    integrations.set(name, integration);
  },

  unregister(name) {
    integrations.delete(name);
  },

  get(name) {
    return integrations.get(name) ?? null;
  },

  list() {
    return [...integrations.keys()];
  },

  async emit(action, payload) {
    const results = [];

    for (const [name, integration] of integrations.entries()) {
      const handler = integration?.[action];
      if (typeof handler !== "function") continue;

      try {
        results.push({
          integration: name,
          success: true,
          result: await handler(payload)
        });
      } catch (error) {
        console.error(`[Telicore] Falló "${action}" en "${name}".`, error);
        results.push({ integration: name, success: false, error });
      }
    }

    return results;
  }
};
