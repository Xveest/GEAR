import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

const api = axios.create({ baseURL: API_BASE });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("gear_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("gear_token");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export const authAPI = {
  login: (data) => api.post("/auth/login", data),
  register: (data) => api.post("/auth/register", data),
};

export const candidatosAPI = {
  getAll: () => api.get("/candidatos"),
  getById: (id) => api.get(`/candidatos/${id}`),
  create: (data) => api.post("/candidatos", data),
  update: (id, data) => api.put(`/candidatos/${id}`, data),
  remove: (id) => api.delete(`/candidatos/${id}`),
};

export const vacantesAPI = {
  getAll: () => api.get("/vacantes"),
  getById: (id) => api.get(`/vacantes/${id}`),
  create: (data) => api.post("/vacantes", data),
  update: (id, data) => api.put(`/vacantes/${id}`, data),
  remove: (id) => api.delete(`/vacantes/${id}`),
};

export const postulacionesAPI = {
  getAll: () => api.get("/postulaciones"),
  create: (data) => api.post("/postulaciones", data),
};

export const evaluacionesAPI = {
  getAll: () => api.get("/evaluaciones"),
  create: (data) => api.post("/evaluaciones", data),
};

export const entrevistasAPI = {
  getAll: () => api.get("/entrevistas"),
  create: (data) => api.post("/entrevistas", data),
};

export default api;
