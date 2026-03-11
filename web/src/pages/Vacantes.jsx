import { useState } from "react";
import Navbar from "../components/Navbar";
import Table from "../components/Table";

const MOCK = [
  { id_vacante: 1, titulo_puesto: "Gerente de Ventas", departamento: "Ventas", descripcion: "Gestión del equipo comercial.", salario: 45000, estado: "activa", id_reclutador: 1 },
  { id_vacante: 2, titulo_puesto: "Director de Operaciones", departamento: "Operaciones", descripcion: "Supervisión de planta automotriz.", salario: 75000, estado: "activa", id_reclutador: 1 },
  { id_vacante: 3, titulo_puesto: "Ingeniero de Calidad", departamento: "Ingeniería", descripcion: "Control y aseguramiento de calidad.", salario: 38000, estado: "activa", id_reclutador: 2 },
  { id_vacante: 4, titulo_puesto: "Analista de RH", departamento: "Recursos Humanos", descripcion: "Gestión de nómina y contratación.", salario: 28000, estado: "pausada", id_reclutador: 1 },
  { id_vacante: 5, titulo_puesto: "Técnico de Mantenimiento", departamento: "Operaciones", descripcion: "Mantenimiento de maquinaria industrial.", salario: 22000, estado: "cerrada", id_reclutador: 2 },
];

const EMPTY = { titulo_puesto: "", departamento: "", descripcion: "", salario: "", estado: "activa", id_reclutador: "" };

const getBadge = (estado) => ({ activa: "badge-green", pausada: "badge-yellow", cerrada: "badge-red" }[estado] || "badge-gray");

export default function Vacantes() {
  const [vacantes, setVacantes] = useState(MOCK);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);

  const openCreate = () => { setEditing(null); setForm(EMPTY); setModal(true); };
  const openEdit = (v) => { setEditing(v.id_vacante); setForm(v); setModal(true); };
  const close = () => setModal(false);
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editing) {
      setVacantes(vacantes.map((v) => v.id_vacante === editing ? { ...form, id_vacante: editing } : v));
    } else {
      setVacantes([...vacantes, { ...form, id_vacante: Date.now() }]);
    }
    close();
  };

  const handleDelete = (id) => {
    if (!window.confirm("¿Eliminar vacante?")) return;
    setVacantes(vacantes.filter((v) => v.id_vacante !== id));
  };

  const columns = ["Puesto", "Departamento", "Salario", "Estado", "Acciones"];

  return (
    <>
      <Navbar title="Vacantes" />
      <div style={{ padding: "1.5rem 0" }}>
          <div className="page-header">
            <h2>Gestión de Vacantes</h2>
            <button className="btn btn-primary" onClick={openCreate}>+ Nueva Vacante</button>
          </div>
          <div className="card">
            <Table
              columns={columns}
              rows={vacantes}
              renderRow={(v) => (
                <tr key={v.id_vacante}>
                  <td><strong>{v.titulo_puesto}</strong></td>
                  <td>{v.departamento}</td>
                  <td>${Number(v.salario).toLocaleString()}</td>
                  <td><span className={`badge ${getBadge(v.estado)}`}>{v.estado}</span></td>
                  <td style={{ display: "flex", gap: ".5rem" }}>
                    <button className="btn btn-outline btn-sm" onClick={() => openEdit(v)}>Editar</button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(v.id_vacante)}>Eliminar</button>
                  </td>
                </tr>
              )}
            />
          </div>
      </div>

      {modal && (
        <div className="modal-backdrop">
          <div className="modal">
            <h2>{editing ? "Editar Vacante" : "Nueva Vacante"}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group"><label>Título del puesto</label><input name="titulo_puesto" value={form.titulo_puesto} onChange={handleChange} required /></div>
              <div className="form-row">
                <div className="form-group"><label>Departamento</label><input name="departamento" value={form.departamento} onChange={handleChange} /></div>
                <div className="form-group"><label>Salario</label><input name="salario" type="number" value={form.salario} onChange={handleChange} /></div>
              </div>
              <div className="form-group"><label>Descripción</label><textarea name="descripcion" rows={3} value={form.descripcion} onChange={handleChange} /></div>
              <div className="form-row">
                <div className="form-group">
                  <label>Estado</label>
                  <select name="estado" value={form.estado} onChange={handleChange}>
                    <option value="activa">Activa</option>
                    <option value="pausada">Pausada</option>
                    <option value="cerrada">Cerrada</option>
                  </select>
                </div>
                <div className="form-group"><label>ID Reclutador</label><input name="id_reclutador" type="number" value={form.id_reclutador} onChange={handleChange} /></div>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-outline" onClick={close}>Cancelar</button>
                <button type="submit" className="btn btn-primary">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
