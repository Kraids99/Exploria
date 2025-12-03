
import useAxios from "./index.jsx";

const getPemesananById = async (id) => {
try{
    const response = await useAxios.get(`/pemesanan/${id}`);
    // backend show(): return response()->json($pemesanan);
    return response.data; // langsung objek pemesanan

}catch(error){
    console.error("idPemesanan error:", error);
    // JANGAN langsung ambil error.response.data
    throw error.response.data || error;
}
};

const createPemesanan = async (data) => {
  try {
    const response = await useAxios.post("/pemesanan", data);
    console.log("createPemesanan response:", response.data);
    return response.data; // backend: { message, data: {...} }
  } catch (error) {
    console.error("createPemesanan error:", error);
    // JANGAN langsung ambil error.response.data
    throw error.response?.data || error;
  }
};

const getPemesananList = async () => {
  try {
    const response = await useAxios.get("/pemesanan");
    // backend index(): untuk user => daftar milik sendiri, admin => semua
    return response.data;
  } catch (error) {
    console.error("getPemesananList error:", error);
    throw error.response?.data || error;
  }
};

export { getPemesananById, createPemesanan, getPemesananList }; 
