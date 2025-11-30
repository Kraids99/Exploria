import useAxios from "./index.jsx";

const createPembayaran = async (data) => {
  try {
    const response = await useAxios.post("/pembayaran/create", data);
    return response.data;
  } catch (error) {
    console.error(
      "createPembayaran error status:",
      error.response?.status
    );
    console.error(
      "createPembayaran error data:",
      error.response?.data
    );

    throw error.response?.data || error;
  }
};

const fetchPembayaran = async () => {
  try {
    const response = await useAxios.get("/pembayaran");
    return response.data;
  } catch (error) {
    console.error("Pembayaran error:", error.response?.data || error);
    throw error.response?.data || error;
  }
};

const getPembayaranById = async (id) => {
  try {
    const response = await useAxios.get(`/pembayaran/${id}`);
    return response.data;
  } catch (error) {
    console.error("getPembayaranById error:", error);
    throw error.response?.data || error;
  }
};

const updatePembayaranStatus = async (id, status) => {
  try {
    const response = await useAxios.put(`/pembayaran/update/${id}`, {
      status_pembayaran: status, // 0 atau 1
    });
    return response.data;
  } catch (error) {
    console.error("updatePembayaranStatus error:", error.response?.data || error);
    throw error.response?.data || error;
  }
};

const sendEticket = async (id) => {
  try {
    const response = await useAxios.put(`/pembayaran/update/${id}`, {
      status_pembayaran: 1,
      send_email: true,
    });
    return response.data;
  } catch (error) {
    console.error("sendEticket error:", error.response?.data || error);
    throw error.response?.data || error;
  }
};

export { createPembayaran, fetchPembayaran, getPembayaranById, updatePembayaranStatus, sendEticket };
