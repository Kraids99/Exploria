import useAxios from "../index.jsx";

// makeRute asal & tujuan
const makeRute = (data = {}) => ({
  id_lokasi_asal: data.id_lokasi_asal || "",
  id_lokasi_tujuan: data.id_lokasi_tujuan || "",
});

// show all rute
export async function fetchRute() {
  const res = await useAxios.get("/rute");
  return res.data?.data || res.data || [];
}

// show rute by id
export async function fetchRuteById(id) {
  const res = await useAxios.get(`/rute/${id}`);
  return res.data?.data || res.data || {};
}

// create rute
export async function createRute(data) {
  const res = makeRute(data);
  return useAxios.post("/rute/create", res);
}

// update rute
export async function updateRute(id, data) {
  const res = makeRute(data);
  return useAxios.put(`/rute/update/${id}`, res);
}

// delete rute
export async function deleteRute(id) {
  return useAxios.delete(`/rute/delete/${id}`);
}
