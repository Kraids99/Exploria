import useAxios from "./index.jsx";

const SignUpCustomer = async (data) => {
  try {
    const response = await useAxios.post("/register/customer", data);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

const SignUpAdmin = async (data) => {
  try {
    const response = await useAxios.post("/register/admin", data);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

const SignIn = async (data) => {
  try {
    const response = await useAxios.post("/login", data);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

const checkAuth = async () => {
  const response = await useAxios.get("/check-auth");
  return response.data;
};

export { SignUpCustomer, SignUpAdmin, SignIn, checkAuth};