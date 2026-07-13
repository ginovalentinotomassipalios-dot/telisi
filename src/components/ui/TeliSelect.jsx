import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState
} from "react";
import { createPortal } from "react-dom";

export function TeliSelect({
  value,
  onChange,
  options,
  placeholder = "Seleccionar",
  ariaLabel = "Seleccionar opción"
}) {
  const buttonRef = useRef(null);
  const menuRef = useRef(null);

  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({
    left: 0,
    top: 0,
    width: 0,
    openUpward: false
  });

  const selectedOption = options.find(
    option => String(option.value) === String(value)
  );

  function closeMenu() {
    setIsOpen(false);
  }

  function selectOption(optionValue) {
    onChange(optionValue);
    closeMenu();
  }

  useLayoutEffect(() => {
    if (!isOpen || !buttonRef.current) return;

    const rect =
      buttonRef.current.getBoundingClientRect();

    const estimatedHeight = Math.min(
      options.length * 48 + 16,
      280
    );

    const availableBelow =
      window.innerHeight - rect.bottom;

    const openUpward =
      availableBelow < estimatedHeight &&
      rect.top > availableBelow;

    setPosition({
      left: rect.left,
      top: openUpward
        ? rect.top
        : rect.bottom,
      width: rect.width,
      openUpward
    });
  }, [isOpen, options.length]);

  useEffect(() => {
    if (!isOpen) return undefined;

    function handlePointerDown(event) {
      const clickedButton =
        buttonRef.current?.contains(event.target);

      const clickedMenu =
        menuRef.current?.contains(event.target);

      if (!clickedButton && !clickedMenu) {
        closeMenu();
      }
    }

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        closeMenu();
      }
    }

    function handleViewportChange() {
      closeMenu();
    }

    document.addEventListener(
      "pointerdown",
      handlePointerDown
    );

    document.addEventListener(
      "keydown",
      handleKeyDown
    );

    window.addEventListener(
      "resize",
      handleViewportChange
    );

    window.addEventListener(
      "scroll",
      handleViewportChange,
      true
    );

    return () => {
      document.removeEventListener(
        "pointerdown",
        handlePointerDown
      );

      document.removeEventListener(
        "keydown",
        handleKeyDown
      );

      window.removeEventListener(
        "resize",
        handleViewportChange
      );

      window.removeEventListener(
        "scroll",
        handleViewportChange,
        true
      );
    };
  }, [isOpen]);

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        className={`teli-select-trigger ${
          isOpen ? "is-open" : ""
        }`}
        onClick={() =>
          setIsOpen(current => !current)
        }
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span>
          {selectedOption?.label ?? placeholder}
        </span>

        <span
          className="teli-select-chevron"
          aria-hidden="true"
        >
          ▾
        </span>
      </button>

      {isOpen &&
        createPortal(
          <div
            ref={menuRef}
            className={`teli-select-menu ${
              position.openUpward
                ? "opens-upward"
                : ""
            }`}
            style={{
              left: position.left,
              width: position.width,
              ...(position.openUpward
                ? {
                    bottom:
                      window.innerHeight -
                      position.top +
                      6
                  }
                : {
                    top: position.top + 6
                  })
            }}
            role="listbox"
          >
            {options.map(option => {
              const selected =
                String(option.value) ===
                String(value);

              return (
                <button
                  type="button"
                  key={String(option.value)}
                  className={`teli-select-option ${
                    selected ? "selected" : ""
                  }`}
                  onClick={() =>
                    selectOption(option.value)
                  }
                  role="option"
                  aria-selected={selected}
                >
                  <span>{option.label}</span>

                  {selected && (
                    <span
                      className="teli-select-check"
                      aria-hidden="true"
                    >
                      ✓
                    </span>
                  )}
                </button>
              );
            })}
          </div>,
          document.body
        )}
    </>
  );
}