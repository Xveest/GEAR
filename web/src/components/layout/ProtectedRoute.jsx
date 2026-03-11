import { Navigate, Outlet } from "react-router-dom";

// El Cadenero: solo deja pasar si hay token
export default function ProtectedRoute() {
  const token = localStorage.getItem("gear_token");
  return token ? <Outlet /> : <Navigate to="/login" replace />;
}
