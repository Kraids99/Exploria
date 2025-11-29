// src/api/apiReview.jsx
import useAxios from "./index.jsx";

const createReview = async (data) => {
  try {
    const res = await useAxios.post("/review/create", data);
    return res.data;
  } catch (error) {
    console.error("createReview error:", error.response?.data || error);
    throw (error.response?.data || error);
  }
};

const getReviewByTiket = async (id_tiket) => {
  try {
    const res = await useAxios.get("/review", {
      params: { id_tiket },   // ?id_tiket=...
    });
    return res.data;          // array review
  } catch (error) {
    console.error("getReviewByTiket error:", error.response?.data || error);
    throw (error.response?.data || error);
  }
};

export { createReview, getReviewByTiket };
