import useAxios from "../index.jsx";

// makeTiket tiket (tidak perlu FormData)
const makeTiket = (data = {}) => ({
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

// show all tiket
export async function fetchTiket() {
  const res = await useAxios.get("/tiket");
  return res.data?.data || res.data || [];
}

// show tiket by id
export async function fetchTiketById(id) {
  const res = await useAxios.get(`/tiket/${id}`);
  return res.data?.data || res.data || {};
}

// create tiket
export async function createTiket(data) {
  const res = makeTiket(data);
  return useAxios.post("/tiket/create", res);
}

// update tiket
export async function updateTiket(id, data) {
  const res = makeTiket(data);
  return useAxios.put(`/tiket/update/${id}`, res);
}

// delete tiket
export async function deleteTiket(id) {
  return useAxios.delete(`/tiket/delete/${id}`);
}
