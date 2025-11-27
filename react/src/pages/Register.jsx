import { useState } from "react";
import { SignUpCustomer } from "../api/apiAUth.jsx";
import { useNavigate } from "react-router-dom";
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
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Navbar/>
      <main className="flex flex-1 items-center bg-[#FDE7DD] justify-center px-4 py-12">
          <div className="m-16 w-full max-w-md rounded-[32px] bg-white shadow-2xl">
            <div className="p-12 max-w-lg mx-auto">
              <h1 className="mb-6 text-center text-xl font-bold">Daftar Akun Customer</h1>

                <form className="space-y-4 rounded-[15px]" onSubmit={handleRegister}>
                  <input name="nama" onChange={handleChange} placeholder="Nama" className="border p-2 w-full"/>
                  <input name="no_telp" onChange={handleChange} placeholder="No Telepon" className="border p-2 w-full"/>
                  <input name="email" onChange={handleChange} placeholder="Email" className="border p-2 w-full"/>
                  <input type="date" name="tanggal_lahir" onChange={handleChange} className="border p-2 w-full"/>
                  <input name="jenis_kelamin" onChange={handleChange} placeholder="Jenis kelamin" className="border p-2 w-full"/>

                  <input name="password" type="password" onChange={handleChange} placeholder="Password" className="border p-2 w-full"/>
                  <input name="password_confirmation" type="password" onChange={handleChange} placeholder="Konfirmasi Password" className="border p-2 w-full"/>

                  {errorMsg && <p className="text-red-500 text-sm">{errorMsg}</p>}

                  <button 
                    disabled={loading}
                    className="bg-brand-500  w-full rounded-full text-white px-4 py-2"
                  >
                    {loading ? "Memproses..." : "Daftar"}
                  </button>
                </form>

            </div>

          </div>
      </main>
      <Footer/> 
    </div>
  );
}

export default Register;
