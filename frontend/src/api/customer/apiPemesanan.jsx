import useAxios from "../index.jsx";

// daftar pemesanan (user akan mendapat miliknya, admin semua)
export async function fetchPemesanan() {
  const res = await useAxios.get("/pemesanan");
  return res.data;
}

// detail pemesanan by id
export async function getPemesananById(id) {
  const res = await useAxios.get(`/pemesanan/${id}`);
  return res.data;
}

// buat pemesanan baru
export async function createPemesanan(data) {
  const res = await useAxios.post("/pemesanan", data);
  return res.data;
}
