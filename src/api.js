import axios from "axios";

const api = axios.create({
  baseURL: "http://194.163.173.179:3300",
  headers: {
    "Content-Type": "application/json",
  },
});

// 🔹 Hər sorğudan əvvəl token əlavə et
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

// 🔹 Cavabda token müddəti bitibsə (401 gəlirsə)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn("Token müddəti bitib. İstifadəçi çıxış edir...");
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // login səhifəsinə yönləndir
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
