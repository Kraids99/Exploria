import { BASE_URL } from "../api";

export const normalizeUrl = (url) => {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  const host = BASE_URL.replace(/\/+$/, "");

  // Buang host jika ikut terkirim, lalu normalisasi path relatif storage
  let cleanedPath = url.replace(/^https?:\/\/[^/]+/i, "");
  cleanedPath = cleanedPath.replace(/^public\//, "");

  if (!cleanedPath.startsWith("storage/")) {
    cleanedPath = `storage/${cleanedPath}`;
  }

  return `${host}/${cleanedPath}`;
};
