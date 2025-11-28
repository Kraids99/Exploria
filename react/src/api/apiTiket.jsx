import useAxios from "./index.jsx";

const getLokasi = async () => {
  try {
    const response = await useAxios.get("/lokasi");
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

const getRute = async () => {
  try {
    const response = await useAxios.get("/rute");
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

const getTiket = async () => {
  try {
    const response = await useAxios.get("/tiket");
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

const getTiketByParams = async (from, to, date) => {
  try {
    const res = await useAxios.get("/tiket/search", {
      params: {
        from: from,
        to: to,
        date: date,
      },
    });
    return res.data;
  } catch (error) {
    throw error.response.data;
  }
};

export { getLokasi, getRute, getTiket, getTiketByParams};