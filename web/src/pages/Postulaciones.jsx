import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Table from "../components/Table";
import { candidatosAPI, postulacionesAPI, vacantesAPI, evaluacionesAPI } from "../services/api";

const getBadge = (estado) => ({ pendiente: "badge-yellow", revisado: "badge-blue", aceptado: "badge-green", rechazado: "badge-red" }[estado] || "badge-gray");

export default function Postulaciones() {
  const user = JSON.parse(localStorage.getItem("gear_user") || "{}");
  const isRHOrAdmin = user.rol === "recursos_humanos" || user.rol === "admin";

  const [postulaciones, setPostulaciones] = useState([]);
  const [candidatos, setCandidatos] = useState([]);
  const [vacantes, setVacantes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ id_candidato: "", id_vacante: "", estado_postulacion: "pendiente" });

  const [evalModal, setEvalModal] = useState(false);
  const [evalForm, setEvalForm] = useState({ id_postulacion: "", candidato_nombre: "", vacante_titulo: "", evaluacion_rh: "", evaluacion_tecnica: "", evaluacion_psicometrica: "", comentarios: "" });

  const fetchData = async () => {
    try {
      setError("");
      const [postRes, canRes, vacRes] = await Promise.all([
        postulacionesAPI.getAll(),
        candidatosAPI.getAll(),
        vacantesAPI.getAll(),
      ]);

      setPostulaciones(postRes?.data || []);
      setCandidatos(canRes?.data || []);
      setVacantes(vacRes?.data || []);
    } catch (err) {
      setError(err.message || "No se pudieron cargar las postulaciones");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await postulacionesAPI.create({
        id_candidato: Number(form.id_candidato),
        id_vacante: Number(form.id_vacante),
        estado_postulacion: form.estado_postulacion,
      });
      await fetchData();
      setModal(false);
      setForm({ id_candidato: "", id_vacante: "", estado_postulacion: "pendiente" });
    } catch (err) {
      window.alert(err.message || "No se pudo guardar la postulacion");
    }
  };

  const handleUpdateStatus = async (id, estado) => {
    try {
      await postulacionesAPI.update(id, { estado_postulacion: estado });
      await fetchData();
    } catch (err) {
      window.alert(err.message || "No se pudo actualizar el estado de la postulación");
    }
  };

  const handleOpenEval = (p) => {
    setEvalForm({
      id_postulacion: p.id_postulacion,
      candidato_nombre: `${p.candidato_nombre} ${p.candidato_apellido}`,
      vacante_titulo: p.vacante_titulo,
      evaluacion_rh: "",
      evaluacion_tecnica: "",
      evaluacion_psicometrica: "",
      comentarios: ""
    });
    setEvalModal(true);
  };

  const handleEvalChange = (e) => setEvalForm({ ...evalForm, [e.target.name]: e.target.value });

  const handleEvalSubmit = async (e) => {
    e.preventDefault();
    try {
      await evaluacionesAPI.create({
        id_postulacion: Number(evalForm.id_postulacion),
        evaluacion_rh: Number(evalForm.evaluacion_rh),
        evaluacion_tecnica: Number(evalForm.evaluacion_tecnica),
        evaluacion_psicometrica: Number(evalForm.evaluacion_psicometrica),
        comentarios: evalForm.comentarios
      });
      window.alert("¡Evaluación de candidato guardada exitosamente!");
      setEvalModal(false);
    } catch (err) {
      window.alert(err.message || "No se pudo guardar la evaluación");
    }
  };

  const columns = ["Candidato", "Vacante", "Fecha", "Estado", "Acciones"];

  return (
    <>
      <Navbar title="Postulaciones" />
      <div style={{ padding: "1.5rem 0" }}>
        <div className="page-header">
          <h2>Gestion de Postulaciones</h2>
          <button className="btn btn-primary" onClick={() => setModal(true)}>+ Nueva Postulacion</button>
        </div>
        {error && <div className="login-error" style={{ marginBottom: "1rem" }}>{error}</div>}
        <div className="card">
          {loading ? (
            <div className="loading">Cargando postulaciones...</div>
          ) : (
            <Table
              columns={columns}
              rows={postulaciones}
              renderRow={(p) => (
                <tr key={p.id_postulacion}>
                  <td><strong>{p.candidato_nombre} {p.candidato_apellido}</strong></td>
                  <td>{p.vacante_titulo}</td>
                  <td>{new Date(p.fecha_postulacion).toLocaleDateString("es-MX")}</td>
                  <td><span className={`badge ${getBadge(p.estado_postulacion)}`}>{p.estado_postulacion}</span></td>
                  <td>
                    {p.estado_postulacion === "pendiente" || p.estado_postulacion === "revisado" ? (
                      <div style={{ display: "flex", gap: "0.5rem" }}>
                        <button className="btn btn-primary" style={{ padding: "0.2rem 0.5rem", fontSize: "0.8rem", backgroundColor: "#6366f1" }} onClick={() => handleOpenEval(p)}>Evaluar</button>
                        {isRHOrAdmin && (
                          <>
                            <button className="btn btn-primary" style={{ padding: "0.2rem 0.5rem", fontSize: "0.8rem", backgroundColor: "#28a745" }} onClick={() => handleUpdateStatus(p.id_postulacion, "aceptado")}>Aceptar</button>
                            <button className="btn btn-primary" style={{ padding: "0.2rem 0.5rem", fontSize: "0.8rem", backgroundColor: "#dc3545" }} onClick={() => handleUpdateStatus(p.id_postulacion, "rechazado")}>Rechazar</button>
                          </>
                        )}
                      </div>
                    ) : p.estado_postulacion === "aceptado" ? (
                      <button className="btn btn-primary" style={{ padding: "0.2rem 0.5rem", fontSize: "0.8rem", backgroundColor: "#6366f1" }} onClick={() => handleOpenEval(p)}>Evaluar Candidato</button>
                    ) : (
                      <span style={{ fontSize: "0.85rem", color: "#666" }}>--</span>
                    )}
                  </td>
                </tr>
              )}
            />
          )}
        </div>
      </div>

      {modal && (
        <div className="modal-backdrop">
          <div className="modal">
            <h2>Nueva Postulacion</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Candidato</label>
                <select name="id_candidato" value={form.id_candidato} onChange={handleChange} required>
                  <option value="">Selecciona un candidato</option>
                  {candidatos.map((c) => (
                    <option key={c.id_candidato} value={c.id_candidato}>{c.nombre} {c.apellido}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Vacante</label>
                <select name="id_vacante" value={form.id_vacante} onChange={handleChange} required>
                  <option value="">Selecciona una vacante</option>
                  {vacantes.map((v) => (
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

      {evalModal && (
        <div className="modal-backdrop">
          <div className="modal">
            <h2>Evaluar Candidato</h2>
            <p><strong>{evalForm.candidato_nombre}</strong> - {evalForm.vacante_titulo}</p>
            <form onSubmit={handleEvalSubmit}>
              <div className="form-group">
                <label>Evaluación RRHH / Cultural (0-100)</label>
                <input type="number" name="evaluacion_rh" min="0" max="100" value={evalForm.evaluacion_rh} onChange={handleEvalChange} required />
              </div>
              <div className="form-group">
                <label>Evaluación Técnica (0-100)</label>
                <input type="number" name="evaluacion_tecnica" min="0" max="100" value={evalForm.evaluacion_tecnica} onChange={handleEvalChange} required />
              </div>
              <div className="form-group">
                <label>Evaluación Psicométrica / Idiomas (0-100)</label>
                <input type="number" name="evaluacion_psicometrica" min="0" max="100" value={evalForm.evaluacion_psicometrica} onChange={handleEvalChange} required />
              </div>
              <div className="form-group">
                <label>Comentarios del Evaluador</label>
                <textarea name="comentarios" value={evalForm.comentarios} onChange={handleEvalChange} rows="3" required></textarea>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-outline" onClick={() => setEvalModal(false)}>Cancelar</button>
                <button type="submit" className="btn btn-primary" style={{ backgroundColor: "#6366f1" }}>Guardar Evaluación</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

