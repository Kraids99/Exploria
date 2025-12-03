import useAxios from "./index.jsx";

// Form payload untuk Rute (asal & tujuan)
const makeRutePayload = (data = {}) => ({
  id_lokasi_asal: data.id_lokasi_asal || "",
  id_lokasi_tujuan: data.id_lokasi_tujuan || "",
});

// GET /rute – ambil semua rute (dengan relasi asal/tujuan)
export async function fetchRute() {
  const res = await useAxios.get("/rute");
  return res.data || [];
}

// GET /rute/{id} – ambil detail rute (termasuk relasi detailRute bila ada)
export async function fetchRuteById(id) {
  const res = await useAxios.get(`/rute/${id}`);
  return res.data || {};
}

// POST /rute/create – tambah rute baru
export async function createRute(data) {
  const payload = makeRutePayload(data);
  return useAxios.post("/rute/create", payload);
}

// PUT /rute/update/{id} – update rute
export async function updateRute(id, data) {
  const payload = makeRutePayload(data);
  return useAxios.put(`/rute/update/${id}`, payload);
}

// DELETE /rute/delete/{id} – hapus rute
export async function deleteRute(id) {
  return useAxios.delete(`/rute/delete/${id}`);
}

export default {
  fetchRute,
  fetchRuteById,
  createRute,
  updateRute,
  deleteRute,
};
