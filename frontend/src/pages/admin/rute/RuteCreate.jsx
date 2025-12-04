import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavbarAdmin from "../../../components/default/NavbarAdmin.jsx";
import { createRute } from "../../../api/admin/apiAdminRute.jsx";
import { fetchLokasi } from "../../../api/admin/apiAdminLokasi.jsx";
import { toast } from "react-toastify";
import { alertSuccess } from "../../../lib/Alert.jsx";
import { styleForm } from "../../../lib/FormStyles.js";

export default function RuteCreate() {
  const navigate = useNavigate();
  const [lokasiOptions, setLokasiOptions] = useState([]);
  const [loadingLokasi, setLoadingLokasi] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [form, setForm] = useState({
    id_lokasi_asal: "",
    id_lokasi_tujuan: "",
  });

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchLokasi();
        setLokasiOptions(data);
      } catch (err) {
        setErrorMessage("Gagal memuat daftar lokasi.");
        toast.error("Gagal memuat daftar lokasi.");
      } finally {
        setLoadingLokasi(false);
      }
    };
    load();
  }, []);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const validateData = () => {
    if(!form.id_lokasi_asal || !form.id_lokasi_tujuan){
      setErrorMessage("Lokasi tidak boleh kosong!")
      toast.error("Lokasi tidak boleh kosong!");
      return false; 
    }
    
    if(form.id_lokasi_asal === form.id_lokasi_tujuan){
      setErrorMessage("Lokasi Tujuan dan Asal tidak boleh sama!")
      toast.error("Lokasi Tujuan dan Asal tidak boleh sama!");
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
      await createRute(form);
      navigate("/admin/rute");
      alertSuccess("Berhasil Menambahkan Rute!"); 
    } catch (err) {
      const apiMessage = err?.response?.data?.message || "Gagal menambah rute.";
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
            <h1 className="text-2xl font-bold text-slate-900 mt-1">Tambah Rute</h1>
            <p className="text-sm text-orange-800/80">isi Rute</p>
          </div>
        </div>

        <div className="mt-6 rounded-2xl bg-white shadow-lg border border-orange-100/80">
          <div className="p-6 lg:p-8">
            <form className="space-y-6" onSubmit={handleSubmit} noValidate>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-slate-800 mb-1">Lokasi Asal *</label>
                  <select
                    value={form.id_lokasi_asal}
                    onChange={handleChange("id_lokasi_asal")}
                    required
                    className={styleForm}
                  >
                    <option value="">Pilih asal</option>
                    {lokasiOptions.map((loc) => (
                      <option key={loc.id_lokasi || loc.id} value={loc.id_lokasi || loc.id}>
                        {loc.kota ? `${loc.kota} - ${loc.terminal}` : loc.terminal}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-800 mb-1">Lokasi Tujuan *</label>
                  <select
                    value={form.id_lokasi_tujuan}
                    onChange={handleChange("id_lokasi_tujuan")}
                    required
                    className={styleForm}
                  >
                    <option value="">Pilih tujuan</option>
                    {lokasiOptions.map((loc) => (
                      <option key={loc.id_lokasi || loc.id} value={loc.id_lokasi || loc.id}>
                        {loc.kota ? `${loc.kota} - ${loc.terminal}` : loc.terminal}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center justify-center rounded-xl bg-orange-600 px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-orange-700 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Menyimpan..." : "Simpan Rute"}
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/admin/rute")}
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
