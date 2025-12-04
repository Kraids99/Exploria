import useAxios from "../index.jsx";

export async function fetchLokasi() {
  const res = await useAxios.get("/lokasi");
  return res.data;
};

export async function getRute() {
  const res = await useAxios.get("/rute");
  return res.data;
};

export async function getTiket() {
  const res = await useAxios.get("/tiket");
  return res.data;
};

export async function getTiketByParams(from, to, date) {
  const res = await useAxios.get("/tiket/search", {
    params: { from, to, date },
  });
  return res.data;
};

export async function getTiketById(id_tiket) {
  const res = await useAxios.get(`/tiket/${id_tiket}`);
  return res.data;
};

export async function getKursiByTiket(id_tiket) {
  const res = await useAxios.get(`/tiket/${id_tiket}/kursi`);
  return res.data;
};
