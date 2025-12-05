import { BASE_URL } from "../api";

export const normalizeUrl = (url) => {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  // Contoh: host "https://127.0.0.1:8000"
  const host = BASE_URL.replace(/\/+$/, "");

  // Buang host jika ikut terkirim, lalu normalisasi path relatif storage
  let cleanedPath = url.replace(/^https?:\/\/[^/]+/i, ""); // buang host jika URL full
  cleanedPath = cleanedPath.replace(/^\/+/, ""); //contoh "/user_profile/foto.jpg"

  if (!cleanedPath.startsWith("storage/")) {
    cleanedPath = `storage/${cleanedPath}`;
  }

  return `${host}/${cleanedPath}`;
};
