import { useContext } from "react";
import { TelicoreContext } from "./TelicoreProvider";

export function useTelicore() {
  const context = useContext(TelicoreContext);

  if (!context) {
    throw new Error("[Telicore] useTelicore debe usarse dentro de TelicoreProvider.");
  }

  return context;
}
