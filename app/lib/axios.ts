import axios from "axios";
import { getToken } from "~/services/auth-service";
import { BASE_URL } from "~/types/constants";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${getToken()}`,
  },
});

export default api;
