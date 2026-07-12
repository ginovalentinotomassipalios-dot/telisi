import { useEffect, useState } from "react";

export function useHideHeader() {
  const [hideHeader, setHideHeader] = useState(false);

  useEffect(() => {
    let lastY = window.scrollY;

    function handleScroll() {
      const currentY = window.scrollY;

      setHideHeader(
        currentY > lastY &&
        currentY > 80
      );

      lastY = currentY;
    }

    window.addEventListener(
      "scroll",
      handleScroll,
      {
        passive: true
      }
    );

    return () => {
      window.removeEventListener(
        "scroll",
        handleScroll
      );
    };
  }, []);

  return hideHeader;
}