export function NewCalendarModal({ newCal, setNewCal, createCalendar, closeModal }) {
  return (
    <div className="modal-backdrop">
      <section className="modal">
        <h3>Nuevo calendario</h3>
        <label>
          Nombre
          <input
            value={newCal.name}
            onChange={e => setNewCal({ ...newCal, name: e.target.value })}
            placeholder="Ej: Gimnasio"
          />
        </label>
        <label>
          Ícono
          <input value={newCal.icon} onChange={e => setNewCal({ ...newCal, icon: e.target.value })} />
        </label>
        <label>
          Color
          <input type="color" value={newCal.color} onChange={e => setNewCal({ ...newCal, color: e.target.value })} />
        </label>
        <div className="modal-actions">
          <button className="secondary" onClick={closeModal}>Cancelar</button>
          <button onClick={createCalendar}>Crear</button>
        </div>
      </section>
    </div>
  );
}
