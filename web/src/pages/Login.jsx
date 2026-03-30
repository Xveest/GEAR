import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authAPI } from "../services/api";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await authAPI.login(form);
      const payload = response?.data;
      if (!payload?.token) throw new Error("Respuesta de login invalida");

      const usuario = payload.usuario || {};

      // Permitir acceso web solo a roles administrativos y de reclutamiento
      const rolesPermitidosWeb = ["admin", "recursos_humanos", "reclutador"];
      
      if (!rolesPermitidosWeb.includes(usuario.rol)) {
        throw new Error("Acceso denegado. Visita la app móvil para ver tus postulaciones.");
      }

      localStorage.setItem("gear_token", payload.token);
      localStorage.setItem("gear_user", JSON.stringify(usuario));
      navigate("/");
    } catch (err) {
      setError(err.message || "Credenciales invalidas");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <h1>GEAR</h1>
        <p>Gestión Estratégica de Alto Rendimiento · Reclutamiento Automotriz</p>
      </div>
      <div className="login-right">
        <div className="login-box">
          <h2>Bienvenido</h2>
          <p>Ingresa tus credenciales para continuar</p>
          {error && <div className="login-error">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Correo electronico</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="correo@empresa.com"
                required
              />
            </div>
            <div className="form-group">
              <label>Contrasena</label>
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                required
                placeholder="********"
              />
            </div>
            <button className="login-btn" type="submit" disabled={loading}>
              {loading ? "Entrando..." : "Iniciar sesion"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
