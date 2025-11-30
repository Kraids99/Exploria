import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import NavbarAdmin from "../../../components/default/NavbarAdmin.jsx";
import { fetchRuteById, updateRute } from "../../../api/apiAdminRute.jsx";
import { fetchLokasi } from "../../../api/apiAdminLokasi.jsx";

import { alertSuccess } from "../../../lib/Alert.jsx";
import { toast } from "react-toastify";

const styleForm = "block w-full rounded-xl border border-orange-100 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-orange-400 focus:ring-2 focus:ring-orange-200 transition";

export default function RuteEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lokasiOptions, setLokasiOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [form, setForm] = useState({
    id_lokasi_asal: "",
    id_lokasi_tujuan: "",
  });

  useEffect(() => {
    const load = async () => {
      try {
        const [detail, lokasi] = await Promise.all([
          fetchRuteById(id),
          fetchLokasi(),
        ]);
        setForm({
          id_lokasi_asal: detail.id_lokasi_asal || "",
          id_lokasi_tujuan: detail.id_lokasi_tujuan || "",
        });
        setLokasiOptions(lokasi);
      } catch (err) {
        setErrorMessage("Gagal memuat rute atau lokasi.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      await updateRute(id, form);
      navigate("/admin/rute");
    } catch (err) {
      const apiMessage = err?.response?.data?.message || "Gagal menyimpan perubahan.";
      setErrorMessage(apiMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex bg-gradient-to-br from-orange-50 to-orange-100/40">
        <NavbarAdmin />
        <main className="flex-1 p-6 lg:p-10">
          <p className="text-sm text-orange-800">Memuat data rute...</p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-orange-50 to-orange-100/40">
      <NavbarAdmin />
      <main className="flex-1 p-6 lg:p-10">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-orange-700">Admin Panel</p>
            <h1 className="text-2xl font-bold text-slate-900 mt-1">Edit Rute</h1>
            <p className="text-sm text-orange-800/80">Perbarui lokasi asal dan tujuan.</p>
          </div>
        </div>

        <div className="mt-6 rounded-2xl bg-white shadow-lg border border-orange-100/80">
          <div className="p-6 lg:p-8">
            <form className="space-y-6" onSubmit={handleSubmit}>
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

              {errorMessage && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {errorMessage}
                </div>
              )}

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center justify-center rounded-xl bg-orange-600 px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-orange-700 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Menyimpan..." : "Simpan Perubahan"}
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
