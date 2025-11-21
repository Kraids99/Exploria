import { useState } from "react";
import { SignUpCustomer } from "../api/apiAUth.jsx";
import { useNavigate } from "react-router-dom";

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
    <div className="p-8 max-w-lg mx-auto">
      <h1 className="text-xl font-bold mb-3">Daftar Akun Customer</h1>

      <form className="space-y-4" onSubmit={handleRegister}>
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
          className="bg-brand-500 text-white px-4 py-2 rounded"
        >
          {loading ? "Memproses..." : "Daftar"}
        </button>
      </form>
    </div>
  );
}

export default Register;
