const API_URL = import.meta.env.VITE_API_URL || "https://gear-backend-n5v3.onrender.com/api";

//cliente base 
const getHeaders = () => {
  const token = localStorage.getItem('gear_token');
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const handleResponse = async (res) => {
  if (res.status === 401 && !res.url.includes("login")) {
    localStorage.removeItem('gear_token');
    window.location.href = "/login";
    return;
  }
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || `Error HTTP: ${res.status}`);
  }
  return res.status === 204 ? null : res.json();
};

export const api = {
  get: async (endpoint) => {
    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        headers: getHeaders(),
      });
      return await handleResponse(response);
    } catch (error) {
      console.error("Error API GET:", error);
      throw error;
    }
  },

  post: async (endpoint, body) => {
    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(body),
      });
      return await handleResponse(response);
    } catch (error) {
      console.error("Error API POST:", error);
      throw error;
    }
  },

  put: async (endpoint, body) => {
    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify(body),
      });
      return await handleResponse(response);
    } catch (error) {
      console.error("Error API PUT:", error);
      throw error;
    }
  },

  delete: async (endpoint) => {
    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: "DELETE",
        headers: getHeaders(),
      });
      return await handleResponse(response);
    } catch (error) {
      console.error("Error API DELETE:", error);
      throw error;
    }
  },
};

//aqui van las apis por dominio es decir las funciones que llaman a api.get/post/put/delete con los endpoints de cada recurso
export const authAPI = {
  login:    (data) => api.post("/auth/login",    data),
  register: (data) => api.post("/auth/register", data),
  changePassword: (data) => api.put("/auth/change-password", data),
};

export const candidatosAPI = {
  getAll:  ()           => api.get("/candidatos"),
  getById: (id)         => api.get(`/candidatos/${id}`),
  create:  (data)       => api.post("/candidatos", data),
  update:  (id, data)   => api.put(`/candidatos/${id}`, data),
  remove:  (id)         => api.delete(`/candidatos/${id}`),
};

export const vacantesAPI = {
  getAll:  ()           => api.get("/vacantes"),
  getById: (id)         => api.get(`/vacantes/${id}`),
  create:  (data)       => api.post("/vacantes", data),
  update:  (id, data)   => api.put(`/vacantes/${id}`, data),
  remove:  (id)         => api.delete(`/vacantes/${id}`),
};

export const postulacionesAPI = {
  getAll:  ()           => api.get("/postulaciones"),
  create:  (data)       => api.post("/postulaciones", data),
  update:  (id, data)   => api.put(`/postulaciones/${id}`, data),
};

export const evaluacionesAPI = {
  getAll:  ()     => api.get("/evaluaciones"),
  create:  (data) => api.post("/evaluaciones", data),
  getComparativo: (id_vacante) => api.get(`/evaluaciones/comparativo${id_vacante ? `?id_vacante=${id_vacante}` : ''}`),
};
