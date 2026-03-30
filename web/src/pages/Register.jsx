import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authAPI, vacantesAPI } from "../services/api";

export default function Register() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1=datos personales, 2=perfil profesional
  const [vacantes, setVacantes] = useState([]);
  const [saving, setSaving] = useState(false);
  const [apiError, setApiError] = useState("");
  const [form, setForm] = useState({
    nombre: "", apellido: "", email: "", telefono: "", password: "", confirmPassword: "",
    puesto_actual: "", anios_experiencia: "", especialidad: "", cv_url: "", vacante_interes: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const loadVacantes = async () => {
      try {
        const response = await vacantesAPI.getAll();
        setVacantes(response?.data || []);
      } catch (err) {
        setVacantes([]);
      }
    };
    loadVacantes();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validateStep1 = () => {
    const e = {};
    if (!form.nombre.trim()) e.nombre = "Campo requerido";
    if (!form.apellido.trim()) e.apellido = "Campo requerido";
    if (!form.email.includes("@")) e.email = "Correo inválido";
    if (form.telefono.length < 10) e.telefono = "Mínimo 10 dígitos";
    if (form.password.length < 6) e.password = "Mínimo 6 caracteres";
    if (form.password !== form.confirmPassword) e.confirmPassword = "Las contraseñas no coinciden";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateStep2 = () => {
    const e = {};
    if (!form.puesto_actual.trim()) e.puesto_actual = "Campo requerido";
    if (!form.anios_experiencia) e.anios_experiencia = "Campo requerido";
    if (!form.vacante_interes) e.vacante_interes = "Selecciona una vacante";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = async (e) => {
    e.preventDefault();
    if (validateStep1()) {
      const email = form.email.toLowerCase();
      const isCorporate = email.endsWith("@admingear.com") || email.endsWith("@gearrh.com") || email.endsWith("@gearreclutador.com") || email.endsWith("@gearreclutador");
      
      if (isCorporate) {
        // Los perfiles corporativos no necesitan llenar el paso 2 (datos de postulante)
        try {
          setSaving(true);
          setApiError("");
          await authAPI.register({
            nombre: form.nombre,
            apellido: form.apellido,
            email: form.email,
            password: form.password,
          });
          window.alert(`Cuenta corporativa creada exitosamente para ${form.nombre}. Ya puedes iniciar sesion.`);
          navigate("/login");
        } catch (err) {
          setApiError(err.message || "No se pudo crear la cuenta");
        } finally {
          setSaving(false);
        }
      } else {
        setStep(2);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep2()) return;

    try {
      setSaving(true);
      setApiError("");
      await authAPI.register({
        nombre: form.nombre,
        apellido: form.apellido,
        email: form.email,
        password: form.password,
        // El rol se determinará automáticamente en el backend según el dominio del correo
      });
      window.alert(`Cuenta creada exitosamente para ${form.nombre}. Ya puedes iniciar sesion.`);
      navigate("/login");
    } catch (err) {
      setApiError(err.message || "No se pudo crear la cuenta");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <h1>GEAR</h1>
        <p>Gestión Estratégica de Alto Rendimiento · Reclutamiento Automotriz</p>
        <div style={{ marginTop: 40 }}>
          <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 16 }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: step >= 1 ? "#3b82f6" : "rgba(255,255,255,.2)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: "700", fontSize: 14 }}>1</div>
            <div>
              <p style={{ color: step >= 1 ? "#fff" : "rgba(255,255,255,.4)", fontWeight: "600", margin: 0, fontSize: 14 }}>Datos personales</p>
              <p style={{ color: "rgba(255,255,255,.4)", margin: 0, fontSize: 12 }}>Nombre, email y contraseña</p>
            </div>
          </div>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: step >= 2 ? "#3b82f6" : "rgba(255,255,255,.2)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: "700", fontSize: 14 }}>2</div>
            <div>
              <p style={{ color: step >= 2 ? "#fff" : "rgba(255,255,255,.4)", fontWeight: "600", margin: 0, fontSize: 14 }}>Perfil profesional</p>
              <p style={{ color: "rgba(255,255,255,.4)", margin: 0, fontSize: 12 }}>Experiencia y vacante de interés</p>
            </div>
          </div>
        </div>
      </div>

      <div className="login-right">
        <div className="login-box" style={{ maxWidth: 480 }}>
          <h2>{step === 1 ? "Crear cuenta" : "Perfil profesional"}</h2>
          <p>{step === 1 ? "Ingresa tus datos personales" : "Cuéntanos sobre tu experiencia"}</p>
          {apiError && <div className="login-error" style={{ marginBottom: 16 }}>{apiError}</div>}

          {step === 1 && (
            <form onSubmit={handleNext}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div className="form-group">
                  <label>Nombre *</label>
                  <input name="nombre" value={form.nombre} onChange={handleChange} placeholder="Carlos" />
                  {errors.nombre && <span style={{ color: "#ef4444", fontSize: 12 }}>{errors.nombre}</span>}
                </div>
                <div className="form-group">
                  <label>Apellido *</label>
                  <input name="apellido" value={form.apellido} onChange={handleChange} placeholder="Mendoza" />
                  {errors.apellido && <span style={{ color: "#ef4444", fontSize: 12 }}>{errors.apellido}</span>}
                </div>
              </div>
              <div className="form-group">
                <label>Correo electrónico *</label>
                <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="correo@gmail.com" />
                {errors.email && <span style={{ color: "#ef4444", fontSize: 12 }}>{errors.email}</span>}
              </div>
              <div className="form-group">
                <label>Teléfono *</label>
                <input name="telefono" type="tel" value={form.telefono} onChange={handleChange} placeholder="5512345678" />
                {errors.telefono && <span style={{ color: "#ef4444", fontSize: 12 }}>{errors.telefono}</span>}
              </div>
              <div className="form-group">
                <label>Contraseña *</label>
                <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="Mínimo 6 caracteres" />
                {errors.password && <span style={{ color: "#ef4444", fontSize: 12 }}>{errors.password}</span>}
              </div>
              <div className="form-group">
                <label>Confirmar contraseña *</label>
                <input name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange} placeholder="Repite tu contraseña" />
                {errors.confirmPassword && <span style={{ color: "#ef4444", fontSize: 12 }}>{errors.confirmPassword}</span>}
              </div>
              <button className="login-btn" type="submit" disabled={saving}>
                {saving ? "Creando cuenta..." : "Continuar"}
              </button>
              <p style={{ textAlign: "center", marginTop: 16, color: "#64748b", fontSize: 14 }}>
                ¿Ya tienes cuenta?{" "}
                <Link to="/login" style={{ color: "#3b82f6", fontWeight: "600", textDecoration: "none" }}>
                  Inicia sesión
                </Link>
              </p>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleSubmit}>
              {apiError && <div className="login-error">{apiError}</div>}
              <div className="form-group">
                <label>Puesto actual *</label>
                <input name="puesto_actual" value={form.puesto_actual} onChange={handleChange} placeholder="Ej. Gerente de ventas" />
                {errors.puesto_actual && <span style={{ color: "#ef4444", fontSize: 12 }}>{errors.puesto_actual}</span>}
              </div>
              <div className="form-group">
                <label>Años de experiencia *</label>
                <select name="anios_experiencia" value={form.anios_experiencia} onChange={handleChange} style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 14, color: "#1e293b", backgroundColor: "#fff" }}>
                  <option value="">Selecciona...</option>
                  {["0-1", "1-3", "3-5", "5-10", "10+"].map(v => <option key={v} value={v}>{v} años</option>)}
                </select>
                {errors.anios_experiencia && <span style={{ color: "#ef4444", fontSize: 12 }}>{errors.anios_experiencia}</span>}
              </div>
              <div className="form-group">
                <label>Especialidad</label>
                <input name="especialidad" value={form.especialidad} onChange={handleChange} placeholder="Ej. Ventas, Logística, Finanzas..." />
              </div>
              <div className="form-group">
                <label>Vacante de interés *</label>
                <select name="vacante_interes" value={form.vacante_interes} onChange={handleChange} style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 14, color: "#1e293b", backgroundColor: "#fff" }}>
                  <option value="">Selecciona una vacante...</option>
                  {vacantes.map(v => <option key={v.id_vacante} value={v.id_vacante}>{v.titulo_puesto}</option>)}
                </select>
                {errors.vacante_interes && <span style={{ color: "#ef4444", fontSize: 12 }}>{errors.vacante_interes}</span>}
              </div>
              <div className="form-group">
                <label>Link de CV (opcional)</label>
                <input name="cv_url" value={form.cv_url} onChange={handleChange} placeholder="https://drive.google.com/..." />
              </div>
              <div style={{ display: "flex", gap: 12 }}>
                <button type="button" onClick={() => setStep(1)} style={{ flex: 1, padding: "14px", borderRadius: 10, border: "1px solid #e2e8f0", background: "#fff", color: "#64748b", fontWeight: "600", cursor: "pointer", fontSize: 15 }}>
                  Atras
                </button>
                <button className="login-btn" type="submit" style={{ flex: 2 }} disabled={saving}>
                  {saving ? "Creando..." : "Crear cuenta"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
