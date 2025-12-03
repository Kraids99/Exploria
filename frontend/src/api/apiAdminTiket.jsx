import useAxios from "./index.jsx";

// Payload Tiket (string/number sederhana, tidak perlu FormData)
const makeTiketPayload = (data = {}) => ({
  id_rute: data.id_rute || "",
  id_company: data.id_company || "",
  nama_tiket: data.nama_tiket || "",
  jumlah_kursi: data.jumlah_kursi || "",
  waktu_keberangkatan: data.waktu_keberangkatan || "",
  waktu_tiba: data.waktu_tiba || "",
  durasi: data.durasi || "",
  harga: data.harga || "",
  stok: data.stok || "",
});

// GET /tiket – ambil semua tiket
export async function fetchTiket() {
  const res = await useAxios.get("/tiket");
  return res.data || [];
}

// GET /tiket/{id} – detail tiket (dengan relasi company, rute)
export async function fetchTiketById(id) {
  const res = await useAxios.get(`/tiket/${id}`);
  return res.data || {};
}

// POST /tiket/create – buat tiket baru
export async function createTiket(data) {
  const payload = makeTiketPayload(data);
  return useAxios.post("/tiket/create", payload);
}

// PUT /tiket/update/{id} – update tiket
export async function updateTiket(id, data) {
  const payload = makeTiketPayload(data);
  return useAxios.put(`/tiket/update/${id}`, payload);
}

// DELETE /tiket/delete/{id} – hapus tiket
export async function deleteTiket(id) {
  return useAxios.delete(`/tiket/delete/${id}`);
}

export default {
  fetchTiket,
  fetchTiketById,
  createTiket,
  updateTiket,
  deleteTiket,
};
