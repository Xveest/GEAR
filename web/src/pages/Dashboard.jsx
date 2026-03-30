import { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import Card from "../components/Card";
import { candidatosAPI, postulacionesAPI, vacantesAPI } from "../services/api";

const humanDate = (dateValue) => {
  const date = new Date(dateValue);
  return Number.isNaN(date.getTime()) ? "-" : date.toLocaleDateString("es-MX");
};

const escapePdfText = (text) => {
  if (!text) return "";
  const MAP = {
    'á': '\\341', 'é': '\\351', 'í': '\\355', 'ó': '\\363', 'ú': '\\372', 'ñ': '\\361',
    'Á': '\\301', 'É': '\\311', 'Í': '\\315', 'Ó': '\\323', 'Ú': '\\332', 'Ñ': '\\321',
    'ü': '\\374', 'Ü': '\\334', '¿': '\\377'
  };
  return String(text)
    .replace(/[áéíóúñÁÉÍÓÚÑüÜ¿]/g, (match) => MAP[match])
    .replace(/\\(?!3)/g, "\\\\") // Escapar barras invertidas que no sean de nuestros códigos
    .replace(/\(/g, "\\(")
    .replace(/\)/g, "\\)");
};

const buildPdf = (lines) => {
  const content = ["BT", "/F1 10 Tf"];
  let y = 800;

  lines.forEach((line) => {
    content.push(`1 0 0 1 40 ${y} Tm (${escapePdfText(line)}) Tj`);
    y -= 14;
  });

  content.push("ET");

  const stream = content.join("\n");
  const objects = [
    "1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj",
    "2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj",
    "3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 5 0 R >> >> /Contents 4 0 R >>\nendobj",
    `4 0 obj\n<< /Length ${stream.length} >>\nstream\n${stream}\nendstream\nendobj`,
    "5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>\nendobj",
  ];

  let pdf = "%PDF-1.4\n";
  const offsets = [0];

  objects.forEach((obj) => {
    offsets.push(pdf.length);
    pdf += `${obj}\n`;
  });

  const xrefStart = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n`;
  pdf += "0000000000 65535 f \n";

  for (let i = 1; i <= objects.length; i += 1) {
    pdf += `${String(offsets[i]).padStart(10, "0")} 00000 n \n`;
  }

  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF`;

  return new Blob([pdf], { type: "application/pdf" });
};

export default function Dashboard() {
  const [candidatos, setCandidatos] = useState([]);
  const [vacantes, setVacantes] = useState([]);
  const [postulaciones, setPostulaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setError("");
        const [cRes, vRes, pRes] = await Promise.all([
          candidatosAPI.getAll(),
          vacantesAPI.getAll(),
          postulacionesAPI.getAll(),
        ]);
        setCandidatos(cRes?.data || []);
        setVacantes(vRes?.data || []);
        setPostulaciones(pRes?.data || []);
      } catch (err) {
        setError(err.message || "No se pudo cargar el dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const vacantesPorEstado = useMemo(() => {
    const counters = { activa: 0, pausada: 0, cerrada: 0 };
    vacantes.forEach((v) => {
      const estado = (v.estado || "").toLowerCase();
      counters[estado] = (counters[estado] || 0) + 1;
    });
    return [
      { key: "activa", label: "Activas", value: counters.activa || 0, color: "#10b981" },
      { key: "pausada", label: "Pausadas", value: counters.pausada || 0, color: "#f59e0b" },
      { key: "cerrada", label: "Cerradas", value: counters.cerrada || 0, color: "#ef4444" },
    ];
  }, [vacantes]);

  const postulacionesPorEstado = useMemo(() => {
    const counters = { pendiente: 0, revisado: 0, aceptado: 0, rechazado: 0 };
    postulaciones.forEach((p) => {
      const estado = (p.estado_postulacion || "").toLowerCase();
      counters[estado] = (counters[estado] || 0) + 1;
    });
    return [
      { key: "pendiente", label: "Pendiente", value: counters.pendiente || 0, color: "#f59e0b" },
      { key: "revisado", label: "Revisado", value: counters.revisado || 0, color: "#3b82f6" },
      { key: "aceptado", label: "Aceptado", value: counters.aceptado || 0, color: "#10b981" },
      { key: "rechazado", label: "Rechazado", value: counters.rechazado || 0, color: "#ef4444" },
    ];
  }, [postulaciones]);

  const topDept = useMemo(() => {
    const map = {};
    vacantes.forEach((v) => {
      const dept = v.departamento || "Sin departamento";
      map[dept] = (map[dept] || 0) + 1;
    });
    return Object.entries(map)
      .map(([label, value]) => ({ label, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);
  }, [vacantes]);

  const totalVacantes = Math.max(vacantes.length, 1);
  const totalPostulaciones = Math.max(postulaciones.length, 1);

  const downloadReport = () => {
    const now = new Date();
    const lines = [
      "GEAR - REPORTE EJECUTIVO",
      `Fecha: ${now.toLocaleDateString("es-MX")} ${now.toLocaleTimeString("es-MX")}`,
      "",
      "RESUMEN GENERAL",
      `Total candidatos: ${candidatos.length}`,
      `Vacantes activas: ${vacantesPorEstado.find((x) => x.key === "activa")?.value || 0}`,
      `Total postulaciones: ${postulaciones.length}`,
      "",
      "VACANTES POR ESTADO",
      ...vacantesPorEstado.map((item) => `${item.label}: ${item.value}`),
      "",
      "POSTULACIONES POR ESTADO",
      ...postulacionesPorEstado.map((item) => `${item.label}: ${item.value}`),
      "",
      "TOP DEPARTAMENTOS",
      ...topDept.map((d) => `${d.label}: ${d.value}`),
      "",
      "ULTIMAS POSTULACIONES",
      ...postulaciones.slice(0, 5).map((p) => `${humanDate(p.fecha_postulacion)} - ${p.candidato_nombre} ${p.candidato_apellido} -> ${p.vacante_titulo} (${p.estado_postulacion})`),
    ];

    const blob = buildPdf(lines);
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `reporte-gear-${now.toISOString().slice(0, 10)}.pdf`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  return (
    <>
      <Navbar title="Dashboard" />
      <div style={{ padding: "1.5rem 0" }}>
        <div className="page-header">
          <h2>Resumen Operativo</h2>
          <button className="btn btn-outline" onClick={downloadReport}>Descargar reporte PDF</button>
        </div>

        {error && <div className="login-error" style={{ marginBottom: "1rem" }}>{error}</div>}

        <div className="card-grid">
          <Card title="Total Candidatos" value={loading ? "..." : candidatos.length} color="#1a2b4b" />
          <Card title="Vacantes Activas" value={loading ? "..." : vacantesPorEstado.find((x) => x.key === "activa")?.value || 0} color="#3b82f6" />
          <Card title="Postulaciones" value={loading ? "..." : postulaciones.length} color="#10b981" />
        </div>

        {loading ? (
          <div className="loading">Cargando indicadores...</div>
        ) : (
          <div className="dashboard-grid">
            <div className="card">
              <h3 className="dashboard-title">Actividad reciente</h3>
              {postulaciones.slice(0, 6).map((p) => (
                <div key={p.id_postulacion} className="activity-row">
                  <div>
                    <span className="badge badge-blue">Postulacion</span>
                    <span className="activity-text">{p.candidato_nombre} {p.candidato_apellido} aplico a {p.vacante_titulo}</span>
                  </div>
                  <span className="activity-date">{humanDate(p.fecha_postulacion)}</span>
                </div>
              ))}
              {postulaciones.length === 0 && <div className="empty">Sin actividad reciente</div>}
            </div>

            <div className="card">
              <h3 className="dashboard-title">Vacantes por estado</h3>
              {vacantesPorEstado.map((item) => {
                const pct = Math.round((item.value / totalVacantes) * 100);
                return (
                  <div key={item.key} className="chart-row">
                    <div className="chart-label-row">
                      <span>{item.label}</span>
                      <strong>{item.value}</strong>
                    </div>
                    <div className="chart-track">
                      <div className="chart-bar" style={{ width: `${pct}%`, background: item.color }} />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="card">
              <h3 className="dashboard-title">Postulaciones por estado</h3>
              {postulacionesPorEstado.map((item) => {
                const pct = Math.round((item.value / totalPostulaciones) * 100);
                return (
                  <div key={item.key} className="chart-row">
                    <div className="chart-label-row">
                      <span>{item.label}</span>
                      <strong>{item.value}</strong>
                    </div>
                    <div className="chart-track">
                      <div className="chart-bar" style={{ width: `${pct}%`, background: item.color }} />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="card">
              <h3 className="dashboard-title">Top departamentos con vacantes</h3>
              {topDept.map((item) => {
                const pct = Math.round((item.value / totalVacantes) * 100);
                return (
                  <div key={item.label} className="chart-row">
                    <div className="chart-label-row">
                      <span>{item.label}</span>
                      <strong>{item.value}</strong>
                    </div>
                    <div className="chart-track">
                      <div className="chart-bar" style={{ width: `${pct}%`, background: "#1a2b4b" }} />
                    </div>
                  </div>
                );
              })}
              {topDept.length === 0 && <div className="empty">No hay vacantes registradas</div>}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
