import useAxios from "../index.jsx";

export async function fetchPembayaran() {
  const response = await useAxios.get("/pembayaran");
  return response.data;
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

export async function sendEticket(id) {
  const response = await useAxios.put(`/pembayaran/update/${id}`, {
    status_pembayaran: 1,
    send_email: true,
  });
  return response.data;
};

// cara lain 
// const sendEticket = async (id) => {
//   const response = await useAxios.put(`/pembayaran/update/${id}`, {
//     status_pembayaran: 1,
//     send_email: true,
//   });
//   return response.data;
// };
// export { sendEticket };
