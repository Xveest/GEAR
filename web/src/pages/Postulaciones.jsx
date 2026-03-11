import { useState } from "react";
import Navbar from "../components/Navbar";
import Table from "../components/Table";

const MOCK_CANDIDATOS = [
  { id_candidato: 1, nombre: "Carlos", apellido: "Mendoza" },
  { id_candidato: 2, nombre: "Ana", apellido: "Torres" },
  { id_candidato: 3, nombre: "Luis", apellido: "Ramírez" },
  { id_candidato: 4, nombre: "Sofía", apellido: "Castillo" },
  { id_candidato: 5, nombre: "Jorge", apellido: "Villanueva" },
];

const MOCK_VACANTES = [
  { id_vacante: 1, titulo_puesto: "Gerente de Ventas" },
  { id_vacante: 2, titulo_puesto: "Director de Operaciones" },
  { id_vacante: 3, titulo_puesto: "Ingeniero de Calidad" },
  { id_vacante: 4, titulo_puesto: "Analista de RH" },
];

const MOCK_POSTULACIONES = [
  { id_postulacion: 1, candidato_nombre: "Carlos", candidato_apellido: "Mendoza", vacante_titulo: "Gerente de Ventas", fecha_postulacion: "2026-03-01T10:00:00Z", estado_postulacion: "aceptado" },
  { id_postulacion: 2, candidato_nombre: "Ana", candidato_apellido: "Torres", vacante_titulo: "Director de Operaciones", fecha_postulacion: "2026-03-03T12:30:00Z", estado_postulacion: "revisado" },
  { id_postulacion: 3, candidato_nombre: "Luis", candidato_apellido: "Ramírez", vacante_titulo: "Ingeniero de Calidad", fecha_postulacion: "2026-03-05T09:00:00Z", estado_postulacion: "pendiente" },
  { id_postulacion: 4, candidato_nombre: "Sofía", candidato_apellido: "Castillo", vacante_titulo: "Analista de RH", fecha_postulacion: "2026-03-06T15:00:00Z", estado_postulacion: "rechazado" },
];

const getBadge = (estado) => ({ pendiente: "badge-yellow", revisado: "badge-blue", aceptado: "badge-green", rechazado: "badge-red" }[estado] || "badge-gray");

export default function Postulaciones() {
  const [postulaciones, setPostulaciones] = useState(MOCK_POSTULACIONES);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ id_candidato: "", id_vacante: "", estado_postulacion: "pendiente" });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    const candidato = MOCK_CANDIDATOS.find((c) => c.id_candidato === Number(form.id_candidato));
    const vacante = MOCK_VACANTES.find((v) => v.id_vacante === Number(form.id_vacante));
    setPostulaciones([
      ...postulaciones,
      {
        id_postulacion: Date.now(),
        candidato_nombre: candidato?.nombre || "",
        candidato_apellido: candidato?.apellido || "",
        vacante_titulo: vacante?.titulo_puesto || "",
        fecha_postulacion: new Date().toISOString(),
        estado_postulacion: form.estado_postulacion,
      },
    ]);
    setModal(false);
    setForm({ id_candidato: "", id_vacante: "", estado_postulacion: "pendiente" });
  };

  const columns = ["Candidato", "Vacante", "Fecha", "Estado"];

  return (
    <>
      <Navbar title="Postulaciones" />
      <div style={{ padding: "1.5rem 0" }}>
          <div className="page-header">
            <h2>Gestión de Postulaciones</h2>
            <button className="btn btn-primary" onClick={() => setModal(true)}>+ Nueva Postulación</button>
          </div>
          <div className="card">
            <Table
              columns={columns}
              rows={postulaciones}
              renderRow={(p) => (
                <tr key={p.id_postulacion}>
                  <td><strong>{p.candidato_nombre} {p.candidato_apellido}</strong></td>
                  <td>{p.vacante_titulo}</td>
                  <td>{new Date(p.fecha_postulacion).toLocaleDateString("es-MX")}</td>
                  <td><span className={`badge ${getBadge(p.estado_postulacion)}`}>{p.estado_postulacion}</span></td>
                </tr>
              )}
            />
          </div>
      </div>

      {modal && (
        <div className="modal-backdrop">
          <div className="modal">
            <h2>Nueva Postulación</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Candidato</label>
                <select name="id_candidato" value={form.id_candidato} onChange={handleChange} required>
                  <option value="">Selecciona un candidato</option>
                  {MOCK_CANDIDATOS.map((c) => (
                    <option key={c.id_candidato} value={c.id_candidato}>{c.nombre} {c.apellido}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Vacante</label>
                <select name="id_vacante" value={form.id_vacante} onChange={handleChange} required>
                  <option value="">Selecciona una vacante</option>
                  {MOCK_VACANTES.map((v) => (
                    <option key={v.id_vacante} value={v.id_vacante}>{v.titulo_puesto}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Estado</label>
                <select name="estado_postulacion" value={form.estado_postulacion} onChange={handleChange}>
                  <option value="pendiente">Pendiente</option>
                  <option value="revisado">Revisado</option>
                  <option value="aceptado">Aceptado</option>
                  <option value="rechazado">Rechazado</option>
                </select>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-outline" onClick={() => setModal(false)}>Cancelar</button>
                <button type="submit" className="btn btn-primary">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

