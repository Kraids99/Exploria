import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import NavbarAdmin from "../../../components/default/NavbarAdmin.jsx";
import { fetchTiketById, updateTiket } from "../../../api/apiAdminTiket.jsx";
import { fetchRute } from "../../../api/apiAdminRute.jsx";
import { fetchCompanies } from "../../../api/apiAdminCompany.jsx";

const styleForm = "block w-full rounded-xl border border-orange-100 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-orange-400 focus:ring-2 focus:ring-orange-200 transition";

// Format ISO/string ke value yang cocok untuk <input type="datetime-local">
const toDateTimeLocal = (value) => {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

// Ubah dari input datetime-local (YYYY-MM-DDTHH:mm) ke format backend (YYYY-MM-DD HH:mm:ss)
const toBackendDateTime = (value) => {
  if (!value) return "";
  if (value.includes("T")) {
    const [date, time] = value.split("T");
    return `${date} ${time}:00`;
  }
  return value;
};

export default function TiketEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ruteOptions, setRuteOptions] = useState([]);
  const [companyOptions, setCompanyOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [form, setForm] = useState({
    id_rute: "",
    id_company: "",
    nama_tiket: "",
    jumlah_kursi: "",
    waktu_keberangkatan: "",
    waktu_tiba: "",
    durasi: "",
    harga: "",
    stok: "",
  });

  useEffect(() => {
    const load = async () => {
      try {
        const [detail, rutes, companies] = await Promise.all([
          fetchTiketById(id),
          fetchRute(),
          fetchCompanies(),
        ]);
        setForm({
          id_rute: detail.id_rute || "",
          id_company: detail.id_company || "",
          nama_tiket: detail.nama_tiket || "",
          jumlah_kursi: detail.jumlah_kursi || "",
          waktu_keberangkatan: toDateTimeLocal(detail.waktu_keberangkatan || ""),
          waktu_tiba: toDateTimeLocal(detail.waktu_tiba || ""),
          durasi: detail.durasi || "",
          harga: detail.harga || "",
          stok: detail.stok || "",
        });
        setRuteOptions(rutes);
        setCompanyOptions(companies);
      } catch (err) {
        setErrorMessage("Gagal memuat data tiket.");
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
      await updateTiket(id, {
        ...form,
        waktu_keberangkatan: toBackendDateTime(form.waktu_keberangkatan),
        waktu_tiba: toBackendDateTime(form.waktu_tiba),
      });
      navigate("/admin/tiket");
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
          <p className="text-sm text-orange-800">Memuat data tiket...</p>
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
            <h1 className="text-2xl font-bold text-slate-900 mt-1">Edit Tiket</h1>
            <p className="text-sm text-orange-800/80">Perbarui detail tiket dan simpan.</p>
          </div>
        </div>

        <div className="mt-6 rounded-2xl bg-white shadow-lg border border-orange-100/80">
          <div className="p-6 lg:p-8">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-slate-800 mb-1">Rute *</label>
                  <select
                    value={form.id_rute}
                    onChange={handleChange("id_rute")}
                    required
                    className={styleForm}
                  >
                    <option value="">Pilih rute</option>
                    {ruteOptions.map((r) => (
                      <option key={r.id_rute || r.id} value={r.id_rute || r.id}>
                        {(r.asal?.kota || r.id_lokasi_asal) + " → " + (r.tujuan?.kota || r.id_lokasi_tujuan)}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-800 mb-1">Company *</label>
                  <select
                    value={form.id_company}
                    onChange={handleChange("id_company")}
                    required
                    className={styleForm}
                  >
                    <option value="">Pilih company</option>
                    {companyOptions.map((c) => (
                      <option key={c.id_company || c.id} value={c.id_company || c.id}>
                        {c.nama_company || c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-slate-800 mb-1">Nama Tiket *</label>
                  <input
                    type="text"
                    value={form.nama_tiket}
                    onChange={handleChange("nama_tiket")}
                    required
                    className={styleForm}
                    placeholder="Nama tiket"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-800 mb-1">Jumlah Kursi *</label>
                  <input
                    type="number"
                    value={form.jumlah_kursi}
                    onChange={handleChange("jumlah_kursi")}
                    required
                    className={styleForm}
                    placeholder="cth: 30"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-slate-800 mb-1">Waktu Keberangkatan *</label>
                  <input
                    type="datetime-local"
                    value={form.waktu_keberangkatan}
                    onChange={handleChange("waktu_keberangkatan")}
                    required
                    className={styleForm}
                    placeholder="YYYY-MM-DDTHH:mm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-800 mb-1">Waktu Tiba *</label>
                  <input
                    type="datetime-local"
                    value={form.waktu_tiba}
                    onChange={handleChange("waktu_tiba")}
                    required
                    className={styleForm}
                    placeholder="YYYY-MM-DDTHH:mm"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <label className="block text-sm font-medium text-slate-800 mb-1">Durasi (menit) *</label>
                  <input
                    type="number"
                    value={form.durasi}
                    onChange={handleChange("durasi")}
                    required
                    className={styleForm}
                    placeholder="cth: 120"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-800 mb-1">Harga *</label>
                  <input
                    type="number"
                    value={form.harga}
                    onChange={handleChange("harga")}
                    required
                    className={styleForm}
                    placeholder="cth: 150000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-800 mb-1">Stok *</label>
                  <input
                    type="number"
                    value={form.stok}
                    onChange={handleChange("stok")}
                    required
                    className={styleForm}
                    placeholder="cth: 20"
                  />
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
                  onClick={() => navigate("/admin/tiket")}
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
