import { useState, useEffect } from "react";
import { vacantesAPI, evaluacionesAPI } from "../services/api";

export default function DashboardComparativo() {
  const [vacantes, setVacantes] = useState([]);
  const [selectedVacante, setSelectedVacante] = useState("");
  const [evaluaciones, setEvaluaciones] = useState([]);
  const [loading, setLoading] = useState(false);

  const [cand1Id, setCand1Id] = useState("");
  const [cand2Id, setCand2Id] = useState("");

  useEffect(() => {
    fetchVacantes();
  }, []);

  const fetchVacantes = async () => {
    try {
      const res = await vacantesAPI.getAll();
      const docs = res.data || res;
      setVacantes(docs);
      if (docs.length > 0) {
        setSelectedVacante(docs[0].id_vacante);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (selectedVacante) {
      fetchEvaluaciones(selectedVacante);
    }
  }, [selectedVacante]);

  const fetchEvaluaciones = async (id_vacante) => {
    setLoading(true);
    try {
      const res = await evaluacionesAPI.getComparativo(id_vacante);
      const docs = res.data || res;
      setEvaluaciones(docs);
      if (docs.length >= 2) {
        setCand1Id(docs[0].id_evaluacion);
        setCand2Id(docs[1].id_evaluacion);
      } else if (docs.length === 1) {
        setCand1Id(docs[0].id_evaluacion);
        setCand2Id("");
      } else {
        setCand1Id("");
        setCand2Id("");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const cand1 = evaluaciones.find(e => e.id_evaluacion === Number(cand1Id));
  const cand2 = evaluaciones.find(e => e.id_evaluacion === Number(cand2Id));

  return (
    <div className="page-container" style={{ padding: "24px" }}>
      <header className="page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <h1 style={{ fontSize: "24px", fontWeight: "bold", margin: "0" }}>Evaluación Comparativa GEAR</h1>
        </div>
        
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <label style={{ fontSize: "14px", fontWeight: "500", color: "#475569" }}>Vacante:</label>
          <select 
            value={selectedVacante} 
            onChange={(e) => setSelectedVacante(e.target.value)}
            style={{ padding: "8px 16px", borderRadius: "8px", border: "1px solid #e2e8f0" }}
          >
            <option value="">Selecciona Vacante</option>
            {vacantes.map(v => (
              <option key={v.id_vacante} value={v.id_vacante}>{v.titulo_puesto}</option>
            ))}
          </select>
        </div>
      </header>

      {evaluaciones.length > 0 && (
        <div style={{ background: "#f8fafc", padding: "16px", borderRadius: "8px", marginBottom: "24px", display: "flex", gap: "24px", alignItems: "center", border: "1px solid #e2e8f0" }}>
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: "14px", fontWeight: "bold", display: "block", marginBottom: "8px" }}>Candidato 1</label>
            <select 
              value={cand1Id} 
              onChange={(e) => setCand1Id(e.target.value)}
              style={{ padding: "8px 12px", width: "100%", borderRadius: "6px", border: "1px solid #cbd5e1" }}
            >
              <option value="">-- Seleccionar --</option>
              {evaluaciones.map(e => (
                <option key={e.id_evaluacion} value={e.id_evaluacion}>{e.nombre} {e.apellido}</option>
              ))}
            </select>
          </div>
          <div style={{ fontWeight: "bold", color: "#94a3b8" }}>VS</div>
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: "14px", fontWeight: "bold", display: "block", marginBottom: "8px" }}>Candidato 2</label>
            <select 
              value={cand2Id} 
              onChange={(e) => setCand2Id(e.target.value)}
              style={{ padding: "8px 12px", width: "100%", borderRadius: "6px", border: "1px solid #cbd5e1" }}
            >
              <option value="">-- Seleccionar --</option>
              {evaluaciones.map(e => (
                <option key={e.id_evaluacion} value={e.id_evaluacion}>{e.nombre} {e.apellido}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      {loading ? (
        <p>Cargando datos...</p>
      ) : evaluaciones.length === 0 ? (
        <p>No hay evaluaciones para esta vacante o selecciona una vacante.</p>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px" }}>
          {cand1 && <CandidateCard candidato={cand1} />}
          {cand2 && <CandidateCard candidato={cand2} />}
        </div>
      )}
    </div>
  );
}

function CandidateCard({ candidato }) {
  return (
    <div 
      style={{ 
        background: "#fff", 
        borderRadius: "12px", 
        padding: "24px", 
        boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
        borderTop: candidato.es_interno ? "5px solid #3b82f6" : "5px solid #10b981",
        position: "relative"
      }}
    >
      {candidato.es_interno ? (
        <span style={{ 
          position: "absolute", top: "12px", right: "12px", 
          background: "#eff6ff", color: "#3b82f6", padding: "4px 8px", 
          borderRadius: "16px", fontSize: "12px", fontWeight: "bold" 
        }}>Talento Interno </span>
      ) : (
        <span style={{ 
          position: "absolute", top: "12px", right: "12px", 
          background: "#d1fae5", color: "#10b981", padding: "4px 8px", 
          borderRadius: "16px", fontSize: "12px", fontWeight: "bold" 
        }}>Candidato Externo </span>
      )}

      <h2 style={{ margin: "0 0 8px 0", fontSize: "20px" }}>{candidato.nombre} {candidato.apellido}</h2>
      <p style={{ margin: "0 0 16px 0", color: "#64748b", fontSize: "14px", fontStyle: "italic" }}>
        {candidato.nivel_estudios || "Sin nivel educativo registrado"}
      </p>

      <div style={{ marginBottom: "20px" }}>
        <div style={{ fontSize: "28px", fontWeight: "bold", color: "#0f172a" }}>
          {Number(candidato.global_score).toFixed(2)}% <span style={{ fontSize: "14px", color: "#64748b", fontWeight: "normal" }}>Global Score</span>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <ScoreBar label="Liderazgo Estratégico" score={candidato.score_liderazgo} />
        <ScoreBar label="Conocimiento Técnico" score={candidato.score_tecnico} />
        <ScoreBar label="Visión Global / Idiomas" score={candidato.score_idiomas} />
        <ScoreBar label="Ajuste Cultural GEAR" score={candidato.score_fit_cultural} />
      </div>
    </div>
  );
}

function ScoreBar({ label, score }) {
  const numScore = Number(score) || 0;
  const getColor = (s) => s >= 90 ? "#10b981" : s >= 80 ? "#f59e0b" : "#ef4444";
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px", fontSize: "13px", fontWeight: "500", color: "#475569" }}>
        <span>{label}</span>
        <span>{numScore}%</span>
      </div>
      <div style={{ height: "8px", background: "#f1f5f9", borderRadius: "4px", overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${numScore}%`, background: getColor(numScore), borderRadius: "4px" }} />
      </div>
    </div>
  );
}