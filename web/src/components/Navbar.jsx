import { useNavigate } from "react-router-dom";

export default function Navbar({ title }) {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("gear_user") || "{}");
  const initial = user.nombre ? user.nombre[0].toUpperCase() : "U";

  return (
    <header className="navbar">
      <span className="navbar-title">{title}</span>
      <div className="navbar-user" style={{ cursor: "pointer" }} onClick={() => navigate("/perfil")}>
        <span>{user.nombre} {user.apellido}</span>
        <div className="avatar" style={{ transition: "opacity .2s" }} title="Ver perfil">{initial}</div>
      </div>
    </header>
  );
}
