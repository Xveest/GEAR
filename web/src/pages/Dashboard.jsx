import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Card from "../components/Card";

const METRICS = { candidatos: 48, vacantes: 12, postulaciones: 37 };

const actividad = [
  { id: 1, tipo: "Candidato", descripcion: "Carlos Mendoza aplicó a Gerente de Ventas", tiempo: "Hace 10 min" },
  { id: 2, tipo: "Vacante", descripcion: "Se publicó la vacante: Director de Operaciones", tiempo: "Hace 1 hr" },
  { id: 3, tipo: "Entrevista", descripcion: "Entrevista agendada para Ana Torres", tiempo: "Hace 2 hrs" },
  { id: 4, tipo: "Evaluación", descripcion: "Evaluación técnica completada por Luis Ramírez", tiempo: "Hace 3 hrs" },
  { id: 5, tipo: "Candidato", descripcion: "Sofía Castillo actualiza su perfil CV", tiempo: "Ayer" },
];

export default function Dashboard() {
  return (
    <div className="layout">
      <Sidebar />
      <div className="main-content">
        <Navbar title="Dashboard" />
        <div style={{ padding: "1.5rem 0" }}>
          <div className="card-grid">
            <Card title="Total Candidatos" value={METRICS.candidatos} color="#1a2b4b" />
            <Card title="Vacantes Activas" value={METRICS.vacantes} color="#3b82f6" />
            <Card title="Postulaciones" value={METRICS.postulaciones} color="#10b981" />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
            <div className="card">
              <h3 style={{ marginBottom: "1rem", color: "#1a2b4b", fontSize: "1rem", fontWeight: 600 }}>
                Actividad reciente
              </h3>
              {actividad.map((a) => (
                <div key={a.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: ".75rem 0", borderBottom: "1px solid #f1f5f9" }}>
                  <div>
                    <span style={{ fontSize: ".7rem", background: "#dbeafe", color: "#1d4ed8", padding: ".15rem .6rem", borderRadius: 999, fontWeight: 600, marginRight: ".6rem" }}>
                      {a.tipo}
                    </span>
                    <span style={{ fontSize: ".88rem", color: "#334155" }}>{a.descripcion}</span>
                  </div>
                  <span style={{ fontSize: ".75rem", color: "#94a3b8", whiteSpace: "nowrap", marginLeft: "1rem" }}>{a.tiempo}</span>
                </div>
              ))}
            </div>

            <div className="card">
              <h3 style={{ marginBottom: "1rem", color: "#1a2b4b", fontSize: "1rem", fontWeight: 600 }}>
                Vacantes por departamento
              </h3>
              {[
                { dept: "Ventas", count: 4, pct: 80 },
                { dept: "Operaciones", count: 3, pct: 60 },
                { dept: "Ingeniería", count: 3, pct: 60 },
                { dept: "Recursos Humanos", count: 2, pct: 40 },
              ].map((d) => (
                <div key={d.dept} style={{ marginBottom: "1rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: ".3rem" }}>
                    <span style={{ fontSize: ".88rem", color: "#334155" }}>{d.dept}</span>
                    <span style={{ fontSize: ".88rem", fontWeight: 600, color: "#1a2b4b" }}>{d.count}</span>
                  </div>
                  <div style={{ background: "#f1f5f9", borderRadius: 999, height: 8 }}>
                    <div style={{ width: `${d.pct}%`, background: "#3b82f6", height: 8, borderRadius: 999, transition: "width .3s" }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
