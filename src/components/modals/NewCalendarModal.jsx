import { createPortal } from "react-dom";

export function NewCalendarModal({
  newCal,
  setNewCal,
  createCalendar,
  closeModal
}) {
  async function handleSubmit(event) {
    event.preventDefault();
    await createCalendar();
  }

  return createPortal(
    <div
      className="telisi-modal-overlay"
      onClick={closeModal}
    >
      <section
        className="telisi-modal-card"
        onClick={event => event.stopPropagation()}
      >
        <div className="telisi-modal-header">
          <div>
            <small>NUEVO CALENDARIO</small>
            <h2>Crear calendario</h2>
          </div>

          <button
            type="button"
            className="telisi-modal-close"
            onClick={closeModal}
            aria-label="Cerrar"
          >
            ×
          </button>
        </div>

        <form
          className="telisi-modal-form"
          onSubmit={handleSubmit}
        >
          <div className="field full">
            <label>Nombre</label>

            <input
              autoFocus
              type="text"
              placeholder="Ej: Familia"
              value={newCal.name}
              onChange={event =>
                setNewCal({
                  ...newCal,
                  name: event.target.value
                })
              }
              required
            />
          </div>

          <div className="field">
            <label>Ícono</label>

            <input
              type="text"
              placeholder="📅"
              value={newCal.icon}
              onChange={event =>
                setNewCal({
                  ...newCal,
                  icon: event.target.value
                })
              }
              maxLength={4}
            />
          </div>

          <div className="field">
            <label>Color</label>

            <input
              type="color"
              value={newCal.color}
              onChange={event =>
                setNewCal({
                  ...newCal,
                  color: event.target.value
                })
              }
            />
          </div>

          <div className="telisi-modal-actions">
            <button
              type="button"
              className="cancel"
              onClick={closeModal}
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="save"
            >
              Crear
            </button>
          </div>
        </form>
      </section>
    </div>,
    document.body
  );
}