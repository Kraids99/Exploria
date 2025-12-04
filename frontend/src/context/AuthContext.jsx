import { createContext, useContext, useEffect, useState } from "react";
import { checkAuth } from "../api/auth/apiAuth";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [initializing, setInitializing] = useState(true);

  // showLoading true hanya untuk init pertama supaya tidak unmount children saat refreshAuth dipanggil
  // cek token ke /check-auth lalu set user + role berdasarkan abilities token
  const fetchAuth = async (showLoading = false) => {
    let responseData = null;
    if (showLoading) setInitializing(true);
    try {
      const res = await checkAuth();
      responseData = res;
      setUser(res.user);

      // tentukan role dari abilities Sanctum
      if (res.abilities?.includes("admin")) {
        setRole("admin");
      } else if (res.abilities?.includes("customer")) {
        setRole("customer");
      } else {
        setRole(null);
      }
    } catch (err) {
      // token invalid/expired
      setUser(null);
      setRole(null);
      localStorage.removeItem("token");
    } finally {
      if (showLoading) setInitializing(false);
    }

    return responseData;
  };

  useEffect(() => {
    fetchAuth(true);
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setRole(null);
  };

  const value = {
    user,
    role,
    isAuthenticated: !!user,
    isAdmin: role === "admin",
    isCustomer: role === "customer",
    refreshAuth: () => fetchAuth(false),
    logout,
    initializing,
  };

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
