import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import NavbarAdmin from "../../../components/default/NavbarAdmin.jsx";
import { createLokasi } from "../../../api/apiAdminLokasi.jsx";
import { toast } from "react-toastify";
import { alertSuccess } from "../../../lib/Alert.jsx";

const styleForm = "block w-full rounded-xl border border-orange-100 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-orange-400 focus:ring-2 focus:ring-orange-200 transition";

export default function LokasiCreate() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [form, setForm] = useState({ terminal: "", kota: "" });

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const validateData = () => {
    if(!form.kota || !form.terminal){
      setErrorMessage("Kota dan Terminal tidak boleh kosong!"); 
      toast.error("Kota dan Terminal tidak boleh kosong!");
      return false; 
    }

    setErrorMessage(""); 
    return true; 
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    const isValid = validateData(); 
    if(!isValid){
      setIsSubmitting(false); 
      return;
    }

    try {
      await createLokasi(form);
      navigate("/admin/lokasi");
      alertSuccess("Berhasil Menambahkan Lokasi!"); 
    } catch (err) {
      let apiMessage = "Gagal menambah lokasi. Coba lagi.";
      setErrorMessage(apiMessage);
      toast.error(apiMessage); 
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-orange-50 to-orange-100/40">
      <NavbarAdmin />
      <main className="flex-1 p-6 lg:p-10">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-orange-700">Admin Panel</p>
            <h1 className="text-2xl font-bold text-slate-900 mt-1">Tambah Lokasi</h1>
            <p className="text-sm text-orange-800/80">Isi Lokasi</p>
          </div>
        </div>

        <div className="mt-6 rounded-2xl bg-white shadow-lg border border-orange-100/80">
          <div className="p-6 lg:p-8">
            <form className="space-y-6" onSubmit={handleSubmit} noValidate>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-slate-800 mb-1">Terminal *</label>
                  <input
                    type="text"
                    value={form.terminal}
                    onChange={handleChange("terminal")}
                    required
                    className={styleForm}
                    placeholder="Nama terminal"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-800 mb-1">Kota *</label>
                  <input
                    type="text"
                    value={form.kota}
                    onChange={handleChange("kota")}
                    required
                    className={styleForm}
                    placeholder="Nama kota"
                  />
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center justify-center rounded-xl bg-orange-600 px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-orange-700 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Menyimpan..." : "Simpan Lokasi"}
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/admin/lokasi")}
                  className="inline-flex items-center justify-center rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Kembali
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
