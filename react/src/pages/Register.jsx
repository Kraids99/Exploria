import { useState } from "react";
import { SignUpCustomer } from "../api/apiAUth.jsx";
import { useNavigate } from "react-router-dom";
import background from "../assets/bg-signinsignup.jpg"
import Navbar from "../components/landingpage/Navbar.jsx";
import Footer from "../components/landingpage/Footer.jsx";
function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nama: "",
    no_telp: "",
    email: "",
    password: "",
    password_confirmation: "",
    tanggal_lahir: "",
    jenis_kelamin: "",
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const res = await SignUpCustomer(form);
      console.log(res);

      alert("Registrasi berhasil!");
      navigate("/login");
    } catch (err) {
      console.log(err);
      setErrorMsg(err?.message || "Registrasi gagal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col font-sans">
      <Navbar/>

      <main className="relative flex-1 flex justify-center
                        px-4 py-20      
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
              <h1 className="mb-6 text-centertext-center text-2xl font-bold text-slate-900 text-xl font-bold text-center">Daftar Akun Customer</h1>

                <form className="space-y-4 rounded-[15px]" onSubmit={handleRegister}>
                  <input name="nama" onChange={handleChange} placeholder="Nama" className="w-full rounded-xl border border-slate-200 bg-slate-50/80 px-3 py-2 text-sm text-slate-900 outline-none"/>
                  <input name="no_telp" onChange={handleChange} placeholder="No Telepon" className="w-full rounded-xl border border-slate-200 bg-slate-50/80 px-3 py-2 text-sm text-slate-900 outline-none"/>
                  <input name="email" onChange={handleChange} placeholder="Email" className="w-full rounded-xl border border-slate-200 bg-slate-50/80 px-3 py-2 text-sm text-slate-900 outline-none"/>
                  <input type="date" name="tanggal_lahir" onChange={handleChange} className="w-full rounded-xl border border-slate-200 bg-slate-50/80 px-3 py-2 text-sm text-slate-900 outline-none"/>
                  <input name="jenis_kelamin" onChange={handleChange} placeholder="Jenis kelamin" className="w-full rounded-xl border border-slate-200 bg-slate-50/80 px-3 py-2 text-sm text-slate-900 outline-none"/>

                  <input name="password" type="password" onChange={handleChange} placeholder="Password" className="w-full rounded-xl border border-slate-200 bg-slate-50/80 px-3 py-2 text-sm text-slate-900 outline-none"/>
                  <input name="password_confirmation" type="password" onChange={handleChange} placeholder="Konfirmasi Password" className="w-full rounded-xl border border-slate-200 bg-slate-50/80 px-3 py-2 text-sm text-slate-900 outline-none"/>

                  <button
                    type="submit"
                    className="mt-2 w-full rounded-full bg-[#f38f4a] px-4 py-2.5 
                    text-sm font-semibold text-white 
                    shadow-md transition-all duration-200 ease-out
                    hover:bg-brand-600 hover:-translate-y-0.5"
                  >
                    Register
                  </button>
                  {errorMsg && <p className="text-red-500 text-sm">{errorMsg}</p>}

                  <button 
                    disabled={loading}
                    className="bg-brand-500  w-full rounded-full text-white px-4 py-2"
                  >
                    {loading ? "Memproses..." : "Daftar"}
                  </button>
                </form>
          </div>

      </main>
          <div className="relative">
            <Footer/> 
          </div>
    </div>
  );
}

export default Register;
