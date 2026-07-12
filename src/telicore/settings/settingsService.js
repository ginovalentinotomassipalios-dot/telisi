import { localStorageAdapter } from "../storage/localStorageAdapter";

const THEME_KEY = "telisi_app_theme";
const DEFAULT_THEME = "amethyst";

export const settingsService = {
  getTheme() {
    return localStorageAdapter.getString(THEME_KEY, DEFAULT_THEME);
  },

  setTheme(theme) {
    localStorageAdapter.setString(THEME_KEY, theme || DEFAULT_THEME);
    return theme || DEFAULT_THEME;
  }
};
