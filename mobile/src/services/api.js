import AsyncStorage from "@react-native-async-storage/async-storage";

export const API_URL = "https://gear-backend-n5v3.onrender.com/api";

const getHeaders = async () => {
  const token = await AsyncStorage.getItem("gear_token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const handleResponse = async (res) => {
  if (res.status === 401) {
    await AsyncStorage.removeItem("gear_token");
    await AsyncStorage.removeItem("gear_user");
    // Handle redirect in app or component if needed
  }
  const json = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(json?.message || `Error HTTP: ${res.status}`);
  }
  return json;
};

const api = {
  get: async (endpoint) => {
    const response = await fetch(`${API_URL}${endpoint}`, {
      headers: await getHeaders(),
    });
    return handleResponse(response);
  },

  post: async (endpoint, body) => {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: "POST",
      headers: await getHeaders(),
      body: JSON.stringify(body),
    });
    return handleResponse(response);
  },

  put: async (endpoint, body) => {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: "PUT",
      headers: await getHeaders(),
      body: JSON.stringify(body),
    });
    return handleResponse(response);
  },

  delete: async (endpoint) => {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: "DELETE",
      headers: await getHeaders(),
    });
    return handleResponse(response);
  },
};

export default api;
