import useAxios from "./index.jsx";

// Form payload untuk Lokasi (terminal + kota)
const makeLokasiPayload = (data = {}) => ({
  terminal: data.terminal || "",
  kota: data.kota || "",
});

// GET /lokasi – ambil semua lokasi
export async function fetchLokasi() {
  const res = await useAxios.get("/lokasi");
  return res.data || [];
}

// GET /lokasi/{id} – ambil detail lokasi
export async function fetchLokasiById(id) {
  const res = await useAxios.get(`/lokasi/${id}`);
  return res.data || {};
}

// POST /lokasi/create – tambah lokasi
export async function createLokasi(data) {
  const res = makeLokasiPayload(data);
  return useAxios.post("/lokasi/create", res);
}

// PUT /lokasi/update/{id} – update lokasi
export async function updateLokasi(id, data) {
  const payload = makeLokasiPayload(data);
  return useAxios.put(`/lokasi/update/${id}`, payload);
}

// DELETE /lokasi/delete/{id} – hapus lokasi
export async function deleteLokasi(id) {
  return useAxios.delete(`/lokasi/delete/${id}`);
}

export default {
  fetchLokasi,
  fetchLokasiById,
  createLokasi,
  updateLokasi,
  deleteLokasi,
};
