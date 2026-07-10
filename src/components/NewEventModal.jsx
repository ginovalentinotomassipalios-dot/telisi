import { createPortal } from "react-dom";

export function NewEventModal({
  newEvent,
  setNewEvent,
  addEvent,
  closeModal
}) {

  function handleSubmit(e) {
    e.preventDefault();

    addEvent(e);

    closeModal();
  }


  return createPortal(

    <div
      className="telisi-modal-overlay"
      onClick={closeModal}
    >

      <section
        className="telisi-modal-card"
        onClick={(e) => e.stopPropagation()}
      >

        <div className="telisi-modal-header">

          <div>
            <small>
              NUEVO EVENTO
            </small>

            <h2>
              Agendar actividad
            </h2>
          </div>


          <button
            className="telisi-modal-close"
            onClick={closeModal}
          >
            ×
          </button>

        </div>



        <form
          className="telisi-modal-form"
          onSubmit={handleSubmit}
        >


          <div className="field">

            <label>
              Fecha
            </label>

            <input
              type="date"
              value={newEvent.date}
              onChange={(e) =>
                setNewEvent({
                  ...newEvent,
                  date: e.target.value
                })
              }
            />

          </div>




          <div className="field">

            <label>
              Hora
            </label>

            <input
              type="time"
              value={newEvent.time}
              onChange={(e) =>
                setNewEvent({
                  ...newEvent,
                  time: e.target.value
                })
              }
            />

          </div>




          <div className="field full">

            <label>
              Evento
            </label>


            <input
              autoFocus
              placeholder="Ej: Capacitación trabajo en altura"
              value={newEvent.text}
              onChange={(e) =>
                setNewEvent({
                  ...newEvent,
                  text: e.target.value
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
              Guardar
            </button>


          </div>


        </form>


      </section>


    </div>,

    document.body

  );
}