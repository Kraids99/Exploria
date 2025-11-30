import { useState } from "react";
import { SignUpCustomer } from "../../api/apiAuth.jsx";
import { useNavigate } from "react-router-dom";
import background from "../../assets/bg-signinsignup.jpg"
import Navbar from "../../components/default/Navbar.jsx";
import Footer from "../../components/default/Footer.jsx";
import { toast } from "react-toastify";
import { alertSuccess } from "../../lib/Alert.jsx";

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

  const validateForm = () => {
    // 1. Cek kalau ada field yang masih kosong
    if (
      !form.nama.trim() ||
      !form.no_telp.trim() ||
      !form.email.trim() ||
      !form.tanggal_lahir.trim() ||
      !form.jenis_kelamin.trim() ||
      form.password.length === 0 ||
      form.password_confirmation.length === 0
    ) {
      setErrorMsg("Data Inputan tidak boleh kosong");
      toast.error("Data Inputan tidak boleh kosong");
      return false;
    }

    // 2. No telepon: hanya angka 10–13 digit
    if (!/^[0-9]{10,13}$/.test(form.no_telp)) {
      setErrorMsg("No telepon harus berupa 10-13 digit angka");
      toast.error("No telepon harus berupa 10-13 digit angka");
      return false;
    }

    // 3. Format email
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setErrorMsg("Format email tidak valid");
      toast.error("Format email tidak valid");
      return false;
    }

    // 4. Tanggal lahir (opsional kalau mau lebih spesifik)
    if (!form.tanggal_lahir) {
      setErrorMsg("Tanggal lahir wajib diisi");
      toast.error("Tanggal lahir wajib diisi");
      return false;
    }

    // 5. Jenis kelamin
    if (!form.jenis_kelamin) {
      setErrorMsg("Jenis kelamin wajib dipilih");
      toast.error("Jenis kelamin wajib dipilih");
      return false;
    }

    // 6. Password minimal 8 karakter
    if (form.password.length < 8) {
      setErrorMsg("Password minimal 8 karakter");
      toast.error("Password minimal 8 karakter");
      return false;
    }

    if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(form.password)) {
      setErrorMsg("Password harus mengandung minimal 1 karakter spesial (misalnya !,@,#, dll)");
      toast.error("Password harus mengandung minimal 1 karakter spesial (misalnya !,@,#, dll)");
      return false;
    }

    // 7. Konfirmasi password
    if (form.password !== form.password_confirmation) {
      setErrorMsg("Konfirmasi password tidak sama");
      toast.error("Konfirmasi password tidak sama");
      return false;
    }

    // Kalau semua lolos
    setErrorMsg("");
    return true;
  };


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

    const isValid = validateForm();
    if (!isValid) return;

    setLoading(true);
    setErrorMsg("");

    try {
      const res = await SignUpCustomer(form);
      console.log("REGISTER SUCCESS:", res);

      const data = res.data ?? res;

      // ganti alertSuccess dengan toast.success biasa
      
      navigate("/login");
      alertSuccess("Registrasi berhasil! Silahkan login terlebih dahulu!");
    } catch (err) {
      console.log("ERROR REGISTER:", err);

      let msg = "Registrasi gagal";

      // kalau axios: err.response.data
      const data = err.response?.data || err;

      // error email sudah dipakai
      if (data?.errors?.email?.length) {
        // dari backend: "The email has already been taken."
        msg = "Email sudah terdaftar, silakan gunakan email lain.";
      } else if (typeof data?.message === "string") {
        msg = data.message;
      }

      setErrorMsg(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="relative min-h-screen flex flex-col font-sans">
      <Navbar />

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
            <input name="nama" onChange={handleChange} placeholder="Nama" className="w-full rounded-xl border border-slate-200 bg-slate-50/80 px-3 py-2 text-sm text-slate-900 outline-none" />
            <input name="no_telp" onChange={handleChange} placeholder="No Telepon" className="w-full rounded-xl border border-slate-200 bg-slate-50/80 px-3 py-2 text-sm text-slate-900 outline-none" />
            <input name="email" onChange={handleChange} placeholder="Email" className="w-full rounded-xl border border-slate-200 bg-slate-50/80 px-3 py-2 text-sm text-slate-900 outline-none" />
            <input type="date" name="tanggal_lahir" onChange={handleChange} className="w-full rounded-xl border border-slate-200 bg-slate-50/80 px-3 py-2 text-sm text-slate-900 outline-none" />

            <div className="space-y-2">
              <p className="text-sm font-semibold text-slate-700">Jenis Kelamin</p>
              <div className="flex gap-4">
                <label className="inline-flex items-center gap-2 text-sm text-slate-700">
                  <input
                    type="radio"
                    name="jenis_kelamin"
                    value="Laki-laki"
                    checked={form.jenis_kelamin === "Laki-laki"}
                    onChange={handleChange}
                    className="h-4 w-4 text-[#f38f4a] focus:ring-[#f38f4a]"
                  />
                  <span>Laki-laki</span>
                </label>
                <label className="inline-flex items-center gap-2 text-sm text-slate-700">
                  <input
                    type="radio"
                    name="jenis_kelamin"
                    value="Perempuan"
                    checked={form.jenis_kelamin === "Perempuan"}
                    onChange={handleChange}
                    className="h-4 w-4 text-[#f38f4a] focus:ring-[#f38f4a]"
                  />
                  <span>Perempuan</span>
                </label>
              </div>
            </div>

            <input name="password" type="password" onChange={handleChange} placeholder="Password" className="w-full rounded-xl border border-slate-200 bg-slate-50/80 px-3 py-2 text-sm text-slate-900 outline-none" />
            <input name="password_confirmation" type="password" onChange={handleChange} placeholder="Konfirmasi Password" className="w-full rounded-xl border border-slate-200 bg-slate-50/80 px-3 py-2 text-sm text-slate-900 outline-none" />

            <button
              type="submit"
              disabled={loading}
              className="bg-[#f38f4a] w-full rounded-full text-white px-4 py-2 shadow-md transition-all duration-200 ease-out hover:bg-brand-600 hover:-translate-y-0.5 disabled:opacity-60"
            >
              {loading ? "Memproses..." : "Daftar"}
            </button>
          </form>
        </div>

      </main>
      <div className="relative">
        <Footer />
      </div>
    </div>
  );
}

export default Register;
