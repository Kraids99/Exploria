import background from "../../assets/bg-signinsignup.jpg";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { SignIn } from "../../api/apiAuth.jsx";
import Footer from "../../components/default/Footer.jsx";
import Navbar from "../../components/default/Navbar.jsx";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const { refreshAuth } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!email || !password) {
      setErrorMsg("Email dan password wajib diisi");
      return;
    }

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
      await refreshAuth();

      // popup sukses
      setShowSuccess(true);

      setTimeout(() => {
        setShowSuccess(false);
        navigate("/");
      }, 1500);

    } catch (err) {
      console.log(err);
      const apiMsg =
        err?.message ||
        err?.error ||
        err?.errors ||
        "Login gagal";
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

            {errorMsg && (
              <p className="text-red-500 text-sm text-center">{errorMsg}</p>
            )}

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

      {/* POPUP SUKSES */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-xl">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <svg
                viewBox="0 0 24 24"
                className="h-6 w-6 text-green-600"
              >
                <path
                  d="M20 6L9 17l-5-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-slate-900">
              Login berhasil
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Kamu akan diarahkan ke halaman utama…
            </p>
          </div>
        </div>
      )}

      <div className="relative">
        <Footer/>
      </div>
    </div>
  );
}

export default Login;
