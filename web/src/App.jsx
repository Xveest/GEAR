import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Candidatos from "./pages/Candidatos";
import Vacantes from "./pages/Vacantes";
import Postulaciones from "./pages/Postulaciones";
import Perfil from "./pages/Perfil";

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("gear_token");
  return token ? children : <Navigate to="/login" />;
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/candidatos" element={<PrivateRoute><Candidatos /></PrivateRoute>} />
        <Route path="/vacantes" element={<PrivateRoute><Vacantes /></PrivateRoute>} />
        <Route path="/postulaciones" element={<PrivateRoute><Postulaciones /></PrivateRoute>} />
        <Route path="/perfil" element={<PrivateRoute><Perfil /></PrivateRoute>} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}
