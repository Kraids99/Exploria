import useAxios from "../index.jsx";

// makeLokasi untuk terminal & kota
const makeLokasi = (data = {}) => ({
  terminal: data.terminal || "",
  kota: data.kota || "",
});

// show all lokasi
export async function fetchLokasi() {
  const res = await useAxios.get("/lokasi");
  return res.data?.data || res.data || [];
}

// show lokasi by id
export async function fetchLokasiById(id) {
  const res = await useAxios.get(`/lokasi/${id}`);
  return res.data?.data || res.data || {};
}

// create lokasi
export async function createLokasi(data) {
  const res = makeLokasi(data);
  return useAxios.post("/lokasi/create", res);
}

// update lokasi
export async function updateLokasi(id, data) {
  const res = makeLokasi(data);
  return useAxios.put(`/lokasi/update/${id}`, res);
}

// delete lokasi
export async function deleteLokasi(id) {
  return useAxios.delete(`/lokasi/delete/${id}`);
}
