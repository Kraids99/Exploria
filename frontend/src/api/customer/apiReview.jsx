// src/api/apiReview.jsx
import useAxios from "../index.jsx";

export async function createReview(data) {
  const res = await useAxios.post("/review/create", data);
  return res.data;
};

export async function getReviewByTiket(id_tiket) {
  const res = await useAxios.get("/review", {
    params: { id_tiket },   
  });
  return res.data;         
};
