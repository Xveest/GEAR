import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Table from "../components/Table";

const MOCK = [
  { id_candidato: 1, nombre: "Carlos", apellido: "Mendoza", email: "carlos@mail.com", telefono: "555-1001", experiencia_anios: 8, nivel_estudios: "Ingeniería", cv_url: "", estado: "activo" },
  { id_candidato: 2, nombre: "Ana", apellido: "Torres", email: "ana@mail.com", telefono: "555-1002", experiencia_anios: 5, nivel_estudios: "Licenciatura", cv_url: "", estado: "activo" },
  { id_candidato: 3, nombre: "Luis", apellido: "Ramírez", email: "luis@mail.com", telefono: "555-1003", experiencia_anios: 12, nivel_estudios: "Maestría", cv_url: "", estado: "contratado" },
  { id_candidato: 4, nombre: "Sofía", apellido: "Castillo", email: "sofia@mail.com", telefono: "555-1004", experiencia_anios: 3, nivel_estudios: "Licenciatura", cv_url: "", estado: "activo" },
  { id_candidato: 5, nombre: "Jorge", apellido: "Villanueva", email: "jorge@mail.com", telefono: "555-1005", experiencia_anios: 6, nivel_estudios: "Ingeniería", cv_url: "", estado: "inactivo" },
];

const EMPTY = { nombre: "", apellido: "", email: "", telefono: "", experiencia_anios: "", nivel_estudios: "", cv_url: "", estado: "activo" };

const getBadge = (estado) => ({ activo: "badge-green", inactivo: "badge-gray", contratado: "badge-blue" }[estado] || "badge-gray");

export default function Candidatos() {
  const [candidatos, setCandidatos] = useState(MOCK);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);

  const openCreate = () => { setEditing(null); setForm(EMPTY); setModal(true); };
  const openEdit = (c) => { setEditing(c.id_candidato); setForm(c); setModal(true); };
  const close = () => setModal(false);
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editing) {
      setCandidatos(candidatos.map((c) => c.id_candidato === editing ? { ...form, id_candidato: editing } : c));
    } else {
      setCandidatos([...candidatos, { ...form, id_candidato: Date.now() }]);
    }
    close();
  };

  const handleDelete = (id) => {
    if (!window.confirm("¿Eliminar candidato?")) return;
    setCandidatos(candidatos.filter((c) => c.id_candidato !== id));
  };

  const columns = ["Nombre", "Email", "Teléfono", "Experiencia", "Estado", "Acciones"];

  return (
    <div className="layout">
      <Sidebar />
      <div className="main-content">
        <Navbar title="Candidatos" />
        <div style={{ padding: "1.5rem 0" }}>
          <div className="page-header">
            <h2>Gestión de Candidatos</h2>
            <button className="btn btn-primary" onClick={openCreate}>+ Nuevo Candidato</button>
          </div>
          <div className="card">
            <Table
              columns={columns}
              rows={candidatos}
              renderRow={(c) => (
                <tr key={c.id_candidato}>
                  <td><strong>{c.nombre} {c.apellido}</strong></td>
                  <td>{c.email}</td>
                  <td>{c.telefono}</td>
                  <td>{c.experiencia_anios} años</td>
                  <td><span className={`badge ${getBadge(c.estado)}`}>{c.estado}</span></td>
                  <td style={{ display: "flex", gap: ".5rem" }}>
                    <button className="btn btn-outline btn-sm" onClick={() => openEdit(c)}>Editar</button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(c.id_candidato)}>Eliminar</button>
                  </td>
                </tr>
              )}
            />
          </div>
        </div>
      </div>

      {modal && (
        <div className="modal-backdrop">
          <div className="modal">
            <h2>{editing ? "Editar Candidato" : "Nuevo Candidato"}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group"><label>Nombre</label><input name="nombre" value={form.nombre} onChange={handleChange} required /></div>
                <div className="form-group"><label>Apellido</label><input name="apellido" value={form.apellido} onChange={handleChange} required /></div>
              </div>
              <div className="form-group"><label>Email</label><input name="email" type="email" value={form.email} onChange={handleChange} required /></div>
              <div className="form-row">
                <div className="form-group"><label>Teléfono</label><input name="telefono" value={form.telefono} onChange={handleChange} /></div>
                <div className="form-group"><label>Años de experiencia</label><input name="experiencia_anios" type="number" value={form.experiencia_anios} onChange={handleChange} /></div>
              </div>
              <div className="form-row">
                <div className="form-group"><label>Nivel de estudios</label><input name="nivel_estudios" value={form.nivel_estudios} onChange={handleChange} /></div>
                <div className="form-group">
                  <label>Estado</label>
                  <select name="estado" value={form.estado} onChange={handleChange}>
                    <option value="activo">Activo</option>
                    <option value="inactivo">Inactivo</option>
                    <option value="contratado">Contratado</option>
                  </select>
                </div>
              </div>
              <div className="form-group"><label>URL del CV</label><input name="cv_url" value={form.cv_url} onChange={handleChange} placeholder="https://..." /></div>
              <div className="modal-actions">
                <button type="button" className="btn btn-outline" onClick={close}>Cancelar</button>
                <button type="submit" className="btn btn-primary">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
