import useAxios from "./index.jsx";

// makeUser FormData untuk profil user
const makeUser = (data = {}) => {
  const formData = new FormData();
  formData.append("nama", data.nama || "");
  formData.append("email", data.email || "");
  formData.append("no_telp", data.no_telp || "");
  formData.append("tanggal_lahir", data.tanggal_lahir || "");
  formData.append("jenis_kelamin", data.jenis_kelamin || "");
  if (data.foto_user) formData.append("foto_user", data.foto_user);
  return formData;
};

export async function getProfile() {
  const res = await useAxios.get("/user");
  return res.data;
}

export async function updateProfile(data) {
  const formData = makeUser(data);
  formData.append("_method", "PATCH"); // pakai POST + _method untuk multipart

  const res = await useAxios.post("/user/update", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
}

export async function updatePassword(data) {
  const res = await useAxios.patch("/user/update/password", data);
  return res.data;
}

export async function deleteAccount() {
  const res = await useAxios.delete("/user");
  return res.data;
}
