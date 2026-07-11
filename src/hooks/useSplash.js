import { useEffect, useState } from "react";

export function useSplash() {
  const [splash, setSplash] = useState(
    () =>
      !sessionStorage.getItem(
        "telisi_splash_seen"
      )
  );

  useEffect(() => {
    if (!splash) {
      return;
    }

    const timer = setTimeout(() => {
      sessionStorage.setItem(
        "telisi_splash_seen",
        "true"
      );

      setSplash(false);
    }, 950);

    return () => clearTimeout(timer);
  }, [splash]);

  return splash;
}