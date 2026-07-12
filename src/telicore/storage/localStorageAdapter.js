export const localStorageAdapter = {
  get(key, fallbackValue = null) {
    try {
      const value = localStorage.getItem(key);
      return value === null ? fallbackValue : JSON.parse(value);
    } catch (error) {
      console.error(`[Telicore] No se pudo leer "${key}".`, error);
      return fallbackValue;
    }
  },

  getString(key, fallbackValue = "") {
    try {
      return localStorage.getItem(key) ?? fallbackValue;
    } catch (error) {
      console.error(`[Telicore] No se pudo leer "${key}".`, error);
      return fallbackValue;
    }
  },

  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`[Telicore] No se pudo guardar "${key}".`, error);
      return false;
    }
  },

  setString(key, value) {
    try {
      localStorage.setItem(key, String(value));
      return true;
    } catch (error) {
      console.error(`[Telicore] No se pudo guardar "${key}".`, error);
      return false;
    }
  },

  remove(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`[Telicore] No se pudo eliminar "${key}".`, error);
      return false;
    }
  }
};
