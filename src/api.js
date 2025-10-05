import axios from "axios";

const api = axios.create({
  baseURL: "http://194.163.173.179:3300",
  headers: {
    "Content-Type": "application/json",
  },
});

// hər sorğudan əvvəl token əlavə et
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

export default api;
