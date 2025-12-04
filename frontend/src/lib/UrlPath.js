import { BASE_URL } from "../api";

export const normalizeUrl = (url) => {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  const host = BASE_URL.replace(/\/+$/, "");
  const cleanedPath = url.startsWith("/") ? url : `/${url}`;
  return `${host}${cleanedPath}`;
};
