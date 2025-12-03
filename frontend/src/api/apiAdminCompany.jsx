import useAxios from "./index.jsx";

// makeCompany
const makeCompany = (data = {}) => {
  const formData = new FormData();
  formData.append("nama_company", data.name || "");
  formData.append("email_company", data.email || "");
  formData.append("no_telp_company", data.phone || "");
  formData.append("alamat_company", data.address || "");
  if (data.logo) formData.append("logo_company", data.logo);
  return formData;
};

// show all
export async function fetchCompanies() {
  const res = await useAxios.get("/company");
  return res.data?.data || [];
}

// show by id
export async function fetchCompanyById(id) {
  const res = await useAxios.get(`/company/${id}`);
  return res.data?.data || {};
}

// create company
export async function createCompany(data) {
  const formData = makeCompany(data);
  return useAxios.post("/company/create", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}

// update company
export async function updateCompany(id, data) {
  const formData = makeCompany(data);
  // karna ada file jadi harus ada type multipart
  return useAxios.post(`/company/update/${id}?_method=PUT`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}

// delete company
export async function deleteCompany(id) {
  return useAxios.delete(`/company/delete/${id}`);
}

export default {
  fetchCompanies,
  fetchCompanyById,
  createCompany,
  updateCompany,
  deleteCompany,
};
