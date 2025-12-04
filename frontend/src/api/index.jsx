import axios from "axios";

export const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

const useAxios = axios.create({
  baseURL: `${BASE_URL}/api`,
});

// tambahkan token
useAxios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // ambil token login dari localStorage
  if (token) {
    //Tanpa kata “Bearer”, backend tidak tahu cara memproses token.
    config.headers.Authorization = `Bearer ${token}`; // selipkan ke header Authorization
  }
  return config; // lanjutkan request
});

export default useAxios;
