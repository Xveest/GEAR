import { Navigate, Outlet } from "react-router-dom";

// El Cadenero: solo deja pasar si hay token y si NO es postulante
export default function ProtectedRoute() {
  const token = localStorage.getItem("gear_token");
  const userString = localStorage.getItem("gear_user");
  
  if (!token) return <Navigate to="/login" replace />;
  
  try {
    const user = JSON.parse(userString || "{}");
    if (user.rol === "postulante") {
      // Bloquear acceso al panel web a postulantes, solo la app móvil
      localStorage.removeItem("gear_token");
      localStorage.removeItem("gear_user");
      return <Navigate to="/login" replace />;
    }
  } catch (error) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
