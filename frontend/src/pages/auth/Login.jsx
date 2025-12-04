import background from "../../assets/bg-signinsignup.jpg";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { SignIn } from "../../api/auth/apiAuth.jsx";
import Footer from "../../components/default/Footer.jsx";
import Navbar from "../../components/default/Navbar.jsx";
import { toast } from "react-toastify";
import { alertSuccess, alertError } from "../../lib/Alert.jsx";
import { getProfile } from "../../api/apiUser.jsx";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const { refreshAuth } = useAuth();
  const navigate = useNavigate();

  const validateLogin = () => {
    if (!email.trim() || !password.trim()) {
      const msg = "Email dan password wajib diisi";
      setErrorMsg(msg);
      toast.error(msg);
      return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      const msg = "Format email tidak valid";
      setErrorMsg(msg);
      toast.error(msg);
      return false;
    }

    if (password.length < 8) {
      const msg = "Password minimal 8 karakter";
      setErrorMsg(msg);
      toast.error(msg);
      return false;
    }

    setErrorMsg("");
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    const isValid = validateLogin();
    if (!isValid) return;

    try {
      const res = await SignIn({ email, password });

      const cleanedToken =
        typeof res.token === "string"
          ? res.token.replace(/^"+|"+$/g, "").trim()
          : res.token;

      localStorage.setItem("token", cleanedToken);

      const authRes = await refreshAuth();

      let userData = authRes?.user ?? authRes?.data ?? null;

      if (!userData) {
        const profileRes = await getProfile();
        userData = profileRes?.data ?? profileRes;
      }

      if (userData) {
        localStorage.setItem("user", JSON.stringify(userData));
      }

      const isAdmin = authRes?.abilities?.includes("admin");

      setTimeout(() => {
        setShowSuccess(false);
        navigate(isAdmin ? "/admin/company" : "/");
        alertSuccess("Selamat, Login Berhasil!");
      }, 1500);
    } catch (err) {
      console.log(err);
      alertError("Username & Password salah");
      setErrorMsg("Login gagal");
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col font-sans">
      {/* NAVBAR FIXED */}
      <Navbar />

      {/* MAIN: kasih padding top supaya nggak ketabrak navbar */}
      <main
        className="
          relative flex-1 flex justify-center
          px-4
          pt-24 pb-10       /* jarak dari navbar di mobile */
          sm:pt-28
          md:pt-32 md:pb-16 /* lebih lega di layar besar */
        "
      >
        {/* BACKGROUND */}
        <div className="absolute inset-0 -z-10">
          <img
            src={background}
            alt="Background Image Exploria"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-slate-900/90" />
        </div>

        {/* CARD LOGIN */}
        <div
          className="
            w-full max-w-md
            rounded-3xl bg-white/95
            p-6 sm:p-8
            shadow-2xl
          "
        >
          <h1 className="text-center text-2xl font-bold text-slate-900">
            Masuk ke akunmu
          </h1>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50/80 px-3 py-2 text-sm text-slate-900 outline-none focus:border-[#f38f4a] focus:ring-2 focus:ring-[#f38f4a]/30"
                placeholder="Masukkan email"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50/80 px-3 py-2 text-sm text-slate-900 outline-none focus:border-[#f38f4a] focus:ring-2 focus:ring-[#f38f4a]/30"
                placeholder="Masukkan password"
              />
            </div>
            
            <button
              type="submit"
              className="
                mt-2 w-full rounded-full
                bg-[#f38f4a] px-4 py-2.5
                text-sm font-semibold text-white
                shadow-md transition-all duration-200
                hover:bg-[#ea7b2a] hover:-translate-y-0.5
                active:translate-y-0
              "
            >
              Login
            </button>
          </form>

          <p className="mt-4 text-center text-xs text-slate-500">
            Belum punya akun?
            <Link
              to="/register"
              className="ml-1 font-semibold text-[#f38f4a] hover:underline"
            >
              Daftar di sini
            </Link>
          </p>
        </div>
      </main>

      {/* FOOTER di bawah (ketarik karena flex-col + flex-1 di main) */}
      <Footer />
    </div>
  );
}

export default Login;
