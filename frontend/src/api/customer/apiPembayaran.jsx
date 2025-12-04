import useAxios from "../index.jsx";

export async function createPembayaran(data){
  const res = await useAxios.post("/pembayaran/create", data);
  return res.data;
};

export async function getPembayaranById(id) {
  const response = await useAxios.get(`/pembayaran/${id}`);
  return response.data;
};

export async function updatePembayaranStatus(id, status) {
  const response = await useAxios.put(`/pembayaran/update/${id}`, {
    status_pembayaran: status, // 0 atau 1
  });
  return response.data;
};