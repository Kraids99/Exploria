import useAxios from "./index.jsx";

const getProfile = async () => {
  try {
    const response = await useAxios.get("/user");
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

const updateProfile = async (data) => {
  try {
    // Jika ada file foto, data akan berupa FormData sehingga header perlu multipart.
    const isFormData = typeof FormData !== "undefined" && data instanceof FormData;
    // Beberapa backend (termasuk Laravel) lebih stabil untuk upload file pakai POST + _method=PATCH.
    const method = isFormData ? "post" : "patch";
    if (isFormData && !data.has("_method")) {
      data.append("_method", "PATCH");
    }

    const response = await useAxios[method]("/user/update", data, {
      headers: isFormData ? { "Content-Type": "multipart/form-data" } : {},
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

const updatePassword = async (data) => {
  try {
    const response = await useAxios.patch("/user/update/password", data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

const deleteAccount = async () => {
  try {
    const response = await useAxios.delete("/user");
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export {getProfile, updateProfile, updatePassword, deleteAccount}
