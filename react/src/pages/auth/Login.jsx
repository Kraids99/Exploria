import background from "../../assets/bg-signinsignup.jpg";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { SignIn } from "../../api/apiAuth.jsx";
import Footer from "../../components/default/Footer.jsx";
import Navbar from "../../components/default/Navbar.jsx";
import { toast } from "react-toastify";
import { alertSuccess, alertError} from "../../lib/Alert.jsx";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const { refreshAuth } = useAuth();
  const navigate = useNavigate();

   const validateLogin = () => {
    // 1. cek kosong
    if (!email.trim() || !password.trim()) {
      const msg = "Email dan password wajib diisi";
      setErrorMsg(msg);
      toast.error(msg);
      return false;
    }

    // 2. cek format email
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      const msg = "Format email tidak valid";
      setErrorMsg(msg);
      toast.error(msg);
      return false;
    }

    // 3. cek panjang password
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
      const res = await SignIn({
        email: email,
        password: password,
      });

      console.log("Login berhasil:", res);

      // simpan token (bersihkan jika token terbungkus tanda kutip)
      const cleanedToken =
        typeof res.token === "string"
          ? res.token.replace(/^"+|"+$/g, "").trim()
          : res.token;
      localStorage.setItem("token", cleanedToken);

      // update auth state dari server
      const authRes = await refreshAuth();
      const isAdmin = authRes?.abilities?.includes("admin");

     

      setTimeout(() => {
        setShowSuccess(false);
        navigate(isAdmin ? "/admin/company" : "/");
        alertSuccess("Selamat, Login Berhasil!")
      }, 1500);

    } catch (err) {
      console.log(err);
      const apiMsg = "Login gagal";
      alertError("Username & Password salah");
      setErrorMsg(apiMsg);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col font-sans">
      <Navbar/>


      {/* FORM LOGIN */}
      <main className=" relative flex-1 flex justify-center
                        px-4 py-35        
                        lg:items-center">
        <div className="absolute inset-0 -z-10">
          <img
            src={background}
            alt="Background Image Exploria"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-r from-slate-900/90 via-slate-900/50 to-slate-900/90" />
        </div>

        <div className="w-full max-w-md rounded-4xl bg-white p-8 shadow-2xl">

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
                className="w-full rounded-xl border border-slate-200 bg-slate-50/80 px-3 py-2 text-sm text-slate-900 outline-none"
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
                className="w-full rounded-xl border border-slate-200 bg-slate-50/80 px-3 py-2 text-sm text-slate-900 outline-none"
                placeholder="Masukkan password"
              />
            </div>

            <button
              type="submit"
              className="mt-2 w-full rounded-full bg-[#f38f4a] px-4 py-2.5 
              text-sm font-semibold text-white
              shadow-md transition-all duration-200 ease-out
              hover:bg-brand-600 hover:-translate-y-0.5"
            >
              Login
            </button>
          </form>

          <p className="mt-4 text-center text-xs text-slate-500">
            Belum punya akun?
            <Link to="/register" className="font-semibold text- ml-1">
              Daftar di sini
            </Link>
          </p>
        </div>
      </main>

      <div className="relative">
        <Footer/>
      </div>
    </div>
  );
}

export default Login;


