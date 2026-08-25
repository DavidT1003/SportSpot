import axios from "axios";

const api = axios.create({
  baseURL: "/api",
});

// Dodaj token na svaki zahtjev ako postoji
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
