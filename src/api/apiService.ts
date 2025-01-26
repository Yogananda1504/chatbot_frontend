/// <reference types="vite/client" />
import axios from "axios";


export const apiService = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
});