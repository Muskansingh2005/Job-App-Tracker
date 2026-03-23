import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

console.log("🔗 API Base URL:", apiUrl); // Debug log

const client = axios.create({
  baseURL: apiUrl,
  timeout: 10000,
});

client.interceptors.request.use((config) => {
  const token = localStorage.getItem("applyflow_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  console.log("📤 Request:", config.method?.toUpperCase(), config.url); // Debug log
  return config;
});

client.interceptors.response.use(
  (response) => {
    console.log("📥 Response:", response.status, response.config.url); // Debug log
    return response;
  },
  (error) => {
    console.error("❌ API Error:", error.response?.status, error.message); // Debug log
    return Promise.reject(error);
  },
);

export default client;
