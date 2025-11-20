import logo from "../assets/logo.png"; 
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // cek sederhana: jangan kosong
    if (!username || !password) {
      // nanti bisa kamu ganti pakai error message
      return;
    }

    // anggap login berhasil
    login();

    // tampilkan popup sukses
    setShowSuccess(true);

    // setelah 1.5 detik, hilangkan popup & pindah ke home
    setTimeout(() => {
      setShowSuccess(false);
      navigate("/");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#FDE7DD] font-sans">
      {/* NAVBAR ATAS */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link to="/" className="flex items-center gap-2">
            <img
              src={logo}
              alt="Exploria"
              className="h-8 w-auto"
            />
          </Link>
          <Link
            to="/"
            className="text-sm font-medium text-slate-600 hover:text-brand-500"
          >
            Kembali ke beranda
          </Link>
        </div>
      </header>

      {/* MAIN: card login di tengah */}
      <main className="flex min-h-[calc(100vh-56px)] items-center justify-center px-4">
        <div className="w-full max-w-md rounded-[32px] bg-white p-8 shadow-2xl">

          <h1 className="text-center text-2xl font-bold text-slate-900">
            Masuk ke akunmu
          </h1>
          <p className="mt-1 text-center text-sm text-slate-500">
            Gunakan username dan password untuk melanjutkan.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/80 px-3 py-2 text-sm text-slate-900 outline-none focus:border-brand-500 focus:bg-white focus:ring-2 focus:ring-brand-100"
                placeholder="Masukkan username"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/80 px-3 py-2 text-sm text-slate-900 outline-none focus:border-brand-500 focus:bg-white focus:ring-2 focus:ring-brand-100"
                placeholder="Masukkan password"
              />
            </div>

            <button
              type="submit"
              className="mt-2 w-full rounded-full bg-brand-500 px-4 py-2.5 text-sm font-semibold text-white shadow-md transition-all duration-200 ease-out hover:bg-brand-600 hover:-translate-y-0.5"
            >
              Login
            </button>
          </form>

          <p className="mt-4 text-center text-xs text-slate-500">
            Belum punya akun?{" "}
            <span className="font-semibold text-brand-500">
              Daftar nanti di backend 😄
            </span>
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
                aria-hidden="true"
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
    </div>
  );
}

export default Login;
