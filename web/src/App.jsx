import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/layout/Layout";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Candidatos from "./pages/Candidatos";
import Vacantes from "./pages/Vacantes";
import Postulaciones from "./pages/Postulaciones";
import Perfil from "./pages/Perfil";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* RUTAS PÚBLICAS */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* RUTAS PRIVADAS (El Cadenero) */}
        <Route element={<ProtectedRoute />}>

          {/* Perfil tiene su propio diseño de pantalla completa */}
          <Route path="/perfil" element={<Perfil />} />

          {/* El resto vive dentro del Layout (Sidebar + main-content) */}
          <Route path="/*" element={
            <Layout>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/candidatos" element={<Candidatos />} />
                <Route path="/vacantes" element={<Vacantes />} />
                <Route path="/postulaciones" element={<Postulaciones />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Layout>
          } />

        </Route>
      </Routes>
    </BrowserRouter>
  );
}
