import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem("gear_token", "mock_token");
    localStorage.setItem("gear_user", JSON.stringify({ nombre: "Admin", apellido: "GEAR", email: form.email, rol: "reclutador" }));
    navigate("/");
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
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Correo electrónico</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="correo@empresa.com"
              />
            </div>
            <div className="form-group">
              <label>Contraseña</label>
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
              />
            </div>
            <button className="login-btn" type="submit">
              Iniciar sesión
            </button>
          </form>
          <p style={{ textAlign: "center", marginTop: 20, color: "#64748b", fontSize: 14 }}>
            ¿No tienes cuenta?{" "}
            <Link to="/register" style={{ color: "#3b82f6", fontWeight: "600", textDecoration: "none" }}>
              Regístrate aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
