import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Table from "../components/Table";
import { vacantesAPI } from "../services/api";

const EMPTY = { titulo_puesto: "", departamento: "", descripcion: "", salario: "", estado: "activa" };

const getBadge = (estado) => ({ activa: "badge-green", pausada: "badge-yellow", cerrada: "badge-red" }[estado] || "badge-gray");

export default function Vacantes() {
  const [vacantes, setVacantes] = useState([]);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const storedUser = JSON.parse(localStorage.getItem("gear_user") || "{}");
  const isRHOrAdmin = storedUser.rol === "recursos_humanos" || storedUser.rol === "admin";

  const fetchVacantes = async () => {
    try {
      setError("");
      const response = await vacantesAPI.getAll();
      setVacantes(response?.data || []);
    } catch (err) {
      setError(err.message || "No se pudieron cargar las vacantes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVacantes();
  }, []);

  const openCreate = () => { setEditing(null); setForm(EMPTY); setModal(true); };
  const openEdit = (v) => { setEditing(v.id_vacante); setForm({ ...EMPTY, ...v }); setModal(true); };
  const close = () => setModal(false);
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...form,
      salario: form.salario === "" ? null : Number(form.salario),
    };

    if (!editing) {
      payload.id_reclutador = storedUser.id || 1;
    }

    try {
      if (editing) {
        await vacantesAPI.update(editing, payload);
      } else {
        await vacantesAPI.create(payload);
      }
      await fetchVacantes();
      close();
    } catch (err) {
      window.alert(err.message || "No se pudo guardar la vacante");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Eliminar vacante?")) return;
    try {
      await vacantesAPI.remove(id);
      await fetchVacantes();
    } catch (err) {
      window.alert(err.message || "No se pudo eliminar la vacante");
    }
  };

  const columns = ["Puesto", "Departamento", "Salario", "Estado", "Acciones"];

  return (
    <>
      <Navbar title="Vacantes" />
      <div style={{ padding: "1.5rem 0" }}>
        <div className="page-header">
          <h2>Gestion de Vacantes</h2>
          {isRHOrAdmin && (
            <button className="btn btn-primary" onClick={openCreate}>+ Nueva Vacante</button>
          )}
        </div>
        {error && <div className="login-error" style={{ marginBottom: "1rem" }}>{error}</div>}
        <div className="card">
          {loading ? (
            <div className="loading">Cargando vacantes...</div>
          ) : (
            <Table
              columns={columns}
              rows={vacantes}
              renderRow={(v) => (
                <tr key={v.id_vacante}>
                  <td><strong>{v.titulo_puesto}</strong></td>
                  <td>{v.departamento}</td>
                  <td>${Number(v.salario || 0).toLocaleString()}</td>
                  <td><span className={`badge ${getBadge(v.estado)}`}>{v.estado}</span></td>
                  <td style={{ display: "flex", gap: ".5rem" }}>
                    {isRHOrAdmin ? (
                      <>
                        <button className="btn btn-outline btn-sm" onClick={() => openEdit(v)}>Editar</button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(v.id_vacante)}>Eliminar</button>
                      </>
                    ) : (
                      <span style={{ fontSize: "0.85rem", color: "#666" }}>Solo lectura</span>
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
            <h2>{editing ? "Editar Vacante" : "Nueva Vacante"}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group"><label>Titulo del puesto</label><input name="titulo_puesto" value={form.titulo_puesto} onChange={handleChange} required /></div>
              <div className="form-row">
                <div className="form-group"><label>Departamento</label><input name="departamento" value={form.departamento} onChange={handleChange} /></div>
                <div className="form-group"><label>Salario</label><input name="salario" type="number" value={form.salario ?? ""} onChange={handleChange} /></div>
              </div>
              <div className="form-group"><label>Descripcion</label><textarea name="descripcion" rows={3} value={form.descripcion} onChange={handleChange} /></div>
              <div className="form-group">
                <label>Estado</label>
                <select name="estado" value={form.estado} onChange={handleChange}>
                  <option value="activa">Activa</option>
                  <option value="pausada">Pausada</option>
                  <option value="cerrada">Cerrada</option>
                </select>
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

