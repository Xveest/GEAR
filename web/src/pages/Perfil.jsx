import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Perfil() {
  const navigate = useNavigate();
  const stored = JSON.parse(localStorage.getItem("gear_user") || "{}");
  const [user, setUser] = useState({
    nombre:   stored.nombre   || "Admin",
    apellido: stored.apellido || "GEAR",
    email:    stored.email    || "admin@gear.mx",
    rol:      stored.rol      || "reclutador",
    telefono: stored.telefono || "",
    empresa:  stored.empresa  || "GEAR Automotriz",
  });
  const [editing, setEditing] = useState(false);
  const [form, setForm]       = useState({ ...user });
  const [saved, setSaved]     = useState(false);

  const initial = user.nombre[0].toUpperCase();
  const rolLabels = { reclutador: "Reclutador", admin: "Administrador", rh: "Recursos Humanos" };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = (e) => {
    e.preventDefault();
    setUser({ ...form });
    localStorage.setItem("gear_user", JSON.stringify({ ...stored, ...form }));
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleLogout = () => {
    localStorage.removeItem("gear_token");
    localStorage.removeItem("gear_user");
    navigate("/login");
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f1f5f9", display: "flex", flexDirection: "column" }}>

      {/* Header */}
      <div style={{ background: "#1a2b4b", padding: "0 40px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <button
            onClick={() => navigate("/")}
            style={{ background: "rgba(255,255,255,.1)", border: "none", color: "#fff", borderRadius: 8, padding: "8px 16px", cursor: "pointer", fontSize: 14, fontWeight: 500, display: "flex", alignItems: "center", gap: 8 }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            Volver
          </button>
          <span style={{ color: "rgba(255,255,255,.3)", fontSize: 18 }}>|</span>
          <span style={{ color: "#fff", fontWeight: 700, fontSize: 18, letterSpacing: 1 }}>GEAR</span>
          <span style={{ color: "rgba(255,255,255,.4)", fontSize: 14 }}>/ Mi Perfil</span>
        </div>
        <button
          onClick={handleLogout}
          style={{ background: "rgba(239,68,68,.15)", border: "1px solid rgba(239,68,68,.35)", color: "#fca5a5", borderRadius: 8, padding: "8px 18px", cursor: "pointer", fontSize: 13, fontWeight: 600 }}
        >
          Cerrar sesion
        </button>
      </div>

      {/* Hero banner */}
      <div style={{ background: "linear-gradient(135deg, #1a2b4b 0%, #243a63 100%)", padding: "48px 0 80px" }}>
        <div style={{ maxWidth: 860, margin: "0 auto", padding: "0 40px", display: "flex", alignItems: "center", gap: 32 }}>
          <div style={{ width: 100, height: 100, borderRadius: "50%", background: "#3b82f6", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 42, fontWeight: 700, color: "#fff", flexShrink: 0, border: "4px solid rgba(255,255,255,.15)" }}>
            {initial}
          </div>
          <div>
            <h1 style={{ margin: "0 0 6px", fontSize: 28, fontWeight: 700, color: "#fff" }}>{user.nombre} {user.apellido}</h1>
            <p style={{ margin: "0 0 12px", color: "rgba(255,255,255,.55)", fontSize: 15 }}>{user.email}</p>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <span style={{ background: "rgba(59,130,246,.3)", color: "#93c5fd", padding: "4px 14px", borderRadius: 999, fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: .5 }}>
                {rolLabels[user.rol] || user.rol}
              </span>
              <span style={{ color: "rgba(255,255,255,.4)", fontSize: 13 }}>{user.empresa}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Card flotante */}
      <div style={{ maxWidth: 860, margin: "-40px auto 60px", padding: "0 40px", width: "100%", boxSizing: "border-box" }}>

        {saved && (
          <div style={{ background: "#dcfce7", border: "1px solid #86efac", color: "#15803d", padding: "13px 20px", borderRadius: 12, marginBottom: 20, fontWeight: 600, fontSize: 14 }}>
            Perfil actualizado correctamente.
          </div>
        )}

        <div style={{ background: "#fff", borderRadius: 16, boxShadow: "0 4px 24px rgba(0,0,0,.08)", overflow: "hidden" }}>

          {/* Cabecera del card */}
          <div style={{ padding: "24px 32px", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: "#1a2b4b" }}>Informacion personal</h2>
            {!editing && (
              <button
                onClick={() => { setForm({ ...user }); setEditing(true); }}
                style={{ padding: "9px 22px", borderRadius: 8, border: "1px solid #3b82f6", background: "#eff6ff", color: "#3b82f6", fontWeight: 600, cursor: "pointer", fontSize: 13 }}
              >
                Editar
              </button>
            )}
          </div>

          {/* Contenido */}
          <div style={{ padding: "28px 32px" }}>
            {!editing ? (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "24px 32px" }}>
                {[
                  { label: "Nombre",   value: user.nombre },
                  { label: "Apellido", value: user.apellido },
                  { label: "Email",    value: user.email },
                  { label: "Telefono", value: user.telefono || "—" },
                  { label: "Empresa",  value: user.empresa },
                  { label: "Rol",      value: rolLabels[user.rol] || user.rol },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <p style={{ margin: "0 0 4px", fontSize: 11, color: "#94a3b8", textTransform: "uppercase", fontWeight: 700, letterSpacing: .5 }}>{label}</p>
                    <p style={{ margin: 0, fontSize: 15, color: "#0f172a", fontWeight: 500 }}>{value}</p>
                  </div>
                ))}
              </div>
            ) : (
              <form onSubmit={handleSave}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "18px 24px" }}>
                  {[
                    { name: "nombre",   label: "Nombre",   type: "text" },
                    { name: "apellido", label: "Apellido", type: "text" },
                    { name: "email",    label: "Email",    type: "email" },
                    { name: "telefono", label: "Telefono", type: "tel" },
                    { name: "empresa",  label: "Empresa",  type: "text" },
                  ].map(({ name, label, type }) => (
                    <div key={name}>
                      <label style={{ display: "block", fontSize: 11, color: "#94a3b8", textTransform: "uppercase", fontWeight: 700, marginBottom: 6, letterSpacing: .5 }}>{label}</label>
                      <input
                        name={name} type={type} value={form[name]} onChange={handleChange}
                        style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 14, color: "#0f172a", boxSizing: "border-box", outline: "none" }}
                      />
                    </div>
                  ))}
                  <div>
                    <label style={{ display: "block", fontSize: 11, color: "#94a3b8", textTransform: "uppercase", fontWeight: 700, marginBottom: 6, letterSpacing: .5 }}>Rol</label>
                    <select
                      name="rol" value={form.rol} onChange={handleChange}
                      style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 14, color: "#0f172a", background: "#fff", boxSizing: "border-box" }}
                    >
                      <option value="reclutador">Reclutador</option>
                      <option value="admin">Administrador</option>
                      <option value="rh">Recursos Humanos</option>
                    </select>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 12, marginTop: 28, paddingTop: 24, borderTop: "1px solid #f1f5f9" }}>
                  <button type="submit" style={{ padding: "11px 28px", borderRadius: 8, background: "#1a2b4b", color: "#fff", fontWeight: 700, border: "none", cursor: "pointer", fontSize: 14 }}>
                    Guardar cambios
                  </button>
                  <button type="button" onClick={() => setEditing(false)} style={{ padding: "11px 22px", borderRadius: 8, border: "1px solid #e2e8f0", background: "#fff", color: "#64748b", fontWeight: 600, cursor: "pointer", fontSize: 14 }}>
                    Cancelar
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
