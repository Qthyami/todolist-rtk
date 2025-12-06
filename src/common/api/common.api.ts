import axios from "axios";

// Axios instance с API-KEY
export const instance = axios.create({
  baseURL: "https://social-network.samuraijs.com/api/1.1/",
  headers: {
    "API-KEY": "9f3854f9-1c37-4311-8912-72c5f843df71", // твой публичный API-KEY
  },
});

// Интерсептор добавляет Bearer-токен из localStorage ко всем запросам
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("sn-token");
  if (token) config.headers["Authorization"] = "Bearer " + token;
  return config;
});
