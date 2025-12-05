import axios from "axios";

export const instance = axios.create({
  baseURL: "/api/proxy?path=", 
  headers: {
    "API-KEY": "9f3854f9-1c37-4311-8912-72c5f843df71",
  },
});
