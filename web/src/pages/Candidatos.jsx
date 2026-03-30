import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Table from "../components/Table";
import { candidatosAPI } from "../services/api";

const getBadge = (estado) => ({ activo: "badge-green", inactivo: "badge-gray", contratado: "badge-blue" }[estado] || "badge-gray");

export default function Candidatos() {
  const [candidatos, setCandidatos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchCandidatos = async () => {
    try {
      setError("");
      const response = await candidatosAPI.getAll();
      setCandidatos(response?.data || []);
    } catch (err) {
      setError(err.message || "No se pudieron cargar los candidatos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidatos();
  }, []);

  const columns = ["Nombre", "Email", "Telefono", "Experiencia", "Estado", "Perfil / Puesto"];

  return (
    <>
      <Navbar title="Candidatos" />
      <div style={{ padding: "1.5rem 0" }}>
        <div className="page-header">
          <h2>Gestion de Candidatos</h2>
        </div>
        {error && <div className="login-error" style={{ marginBottom: "1rem" }}>{error}</div>}
        <div className="card">
          {loading ? (
            <div className="loading">Cargando candidatos...</div>
          ) : (
            <Table
              columns={columns}
              rows={candidatos}
              renderRow={(c) => (
                <tr key={c.id_candidato}>
                  <td><strong>{c.nombre} {c.apellido}</strong></td>
                  <td>{c.email}</td>
                  <td>{c.telefono}</td>
                  <td>{c.experiencia_anios ?? 0} años</td>
                  <td><span className={`badge ${getBadge(c.estado)}`}>{c.estado}</span></td>
                  <td>{c.nivel_estudios || "No especificado"}</td>
                </tr>
              )}
            />
          )}
        </div>
      </div>
    </>
  );
}

