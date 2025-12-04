import useAxios from "../index.jsx";

export async function SignUpCustomer(data) {
  const res = await useAxios.post("/register/customer", data);
  return res.data;
};

export async function SignUpAdmin(data) {
  const res = await useAxios.post("/register/admin", data);
  return res.data;
};

export async function SignIn(data) {
  const res = await useAxios.post("/login", data);
  return res.data;
};

export async function checkAuth() {
  const res = await useAxios.get("/check-auth");
  return res.data;
};

export async function deleteAccount(data) {
  const res = await useAxios.post("/delete", data);
  return res.data;
};