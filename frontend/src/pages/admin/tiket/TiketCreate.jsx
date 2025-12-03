import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavbarAdmin from "../../../components/default/NavbarAdmin.jsx";
import { createTiket } from "../../../api/apiAdminTiket.jsx";
import { fetchRute } from "../../../api/apiAdminRute.jsx";
import { fetchCompanies } from "../../../api/apiAdminCompany.jsx";

import { toast } from "react-toastify";
import { alertSuccess } from "../../../lib/Alert.jsx";

const styleForm = "block w-full rounded-xl border border-orange-100 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-orange-400 focus:ring-2 focus:ring-orange-200 transition";
// warna berbeda supaya terlihat auto generate, bukan inputan
const styleFormDisabled = "block w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500 shadow-sm cursor-not-allowed";

// Format input datetime-local ke format backend (m/d/Y H:i:s)
const dateTime = (value) => {
  if (!value) return "";
  if (value.includes("T")) {
    const [date, time] = value.split("T");
    const [y, m, d] = date.split("-");
    return `${m}/${d}/${y} ${time}:00`;
  }
  return value;
};

// Hitung durasi dalam menit; jika tanggal tidak valid, kembalikan string kosong
const countDuration = (start, end) => {
  const d1 = new Date(start);
  const d2 = new Date(end);
  if (Number.isNaN(d1.getTime()) || Number.isNaN(d2.getTime())) return "";
  const count = d2.getTime() - d1.getTime();
  return count > 0 ? Math.round(count / 60000) : "";
};

// Ambil waktu sekarang dalam format yang cocok untuk input datetime-local (YYYY-MM-DDTHH:mm)
const toLocalInputValue = () => new Date().toISOString().slice(0, 16);

export default function TiketCreate() {
  const navigate = useNavigate();
  const [ruteOptions, setRuteOptions] = useState([]);
  const [companyOptions, setCompanyOptions] = useState([]);
  const [loadingMeta, setLoadingMeta] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [form, setForm] = useState({
    id_rute: "",
    id_company: "",
    nama_tiket: "",
    jumlah_kursi: 25,
    waktu_keberangkatan: "",
    waktu_tiba: "",
    durasi: "",
    harga: "",
    stok: 25,
  });


  useEffect(() => {
    const load = async () => {
      try {
        const [rutes, companies] = await Promise.all([
          fetchRute(),
          fetchCompanies(),
        ]);
        setRuteOptions(rutes);
        setCompanyOptions(companies);
      } catch (err) {
        setErrorMessage("Gagal memuat referensi rute/company.");
      } finally {
        setLoadingMeta(false);
      }
    };
    load();
  }, []);

  const handleChange = (field) => (e) => {
    const value = e.target.value;
    setForm((prev) => {
      const next = { ...prev, [field]: value };
      // auto hitung durasi jika waktu berubah
      if (field === "waktu_keberangkatan" || field === "waktu_tiba") {
        const dur = countDuration(
          field === "waktu_keberangkatan" ? value : next.waktu_keberangkatan,
          field === "waktu_tiba" ? value : next.waktu_tiba
        );
        if (dur !== "") next.durasi = dur;
      }
      return next;
    });
  };

  const validateData = () => {
    // 1. Cek field wajib (tanpa durasi dulu)
    if (
      !form.id_rute ||
      !form.id_company ||
      !form.nama_tiket ||
      !form.jumlah_kursi ||
      !form.waktu_keberangkatan ||
      !form.waktu_tiba ||
      !form.harga ||
      !form.stok
    ) {
      setErrorMessage("Inputan tidak boleh kosong!");
      toast.error("Inputan tidak boleh kosong!");
      return false;
    }

    // 2. jumlah_kursi minimal 1
    if (form.jumlah_kursi < 1) {
      setErrorMessage("Jumlah kursi minimal 1");
      toast.error("Jumlah kursi minimal 1");
      return false;
    }

    // 3. Validasi waktu: keberangkatan harus < tiba (tidak boleh sama/lebih)
    const start = new Date(form.waktu_keberangkatan);
    const end = new Date(form.waktu_tiba);
    const now = new Date();

    if(!Number.isNaN(start.getTime()) && start < now) 
    {
      setErrorMessage("Waktu keberangkatan tidak boleh di masa lalu");
      toast.error("Waktu keberangkatan tidak boleh di masa lalu");
      return false;
    }

    if (!Number.isNaN(start.getTime()) && !Number.isNaN(end.getTime())) {
      if (start >= end) {
        setErrorMessage(
          "Waktu keberangkatan harus lebih awal dari waktu tiba (tidak boleh sama atau setelahnya)"
        );
        toast.error(
          "Waktu keberangkatan harus lebih awal dari waktu tiba (tidak boleh sama atau setelahnya)"
        );
        return false;
      }
    }

    // 4. Durasi hasil hitung otomatis (opsional, kalau mau dipastikan keisi)
    if (!form.durasi) {
      setErrorMessage("Durasi tidak valid, periksa kembali waktu keberangkatan & tiba");
      toast.error("Durasi tidak valid, periksa kembali waktu keberangkatan & tiba");
      return false;
    }

    // 5. Harga & stok
    if (form.harga < 1) {
      setErrorMessage("Harga tidak boleh kurang dari 1");
      toast.error("Harga tidak boleh kurang dari 1");
      return false;
    }

    if (form.stok < 1) {
      setErrorMessage("Stok tidak boleh kurang dari 1");
      toast.error("Stok tidak boleh kurang dari 1");
      return false;
    }

    setErrorMessage("");
    return true;
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    const isValid = validateData();
    if (!isValid) {
      setIsSubmitting(false);
      return;
    }

    try {
      await createTiket({
        ...form,
        waktu_keberangkatan: dateTime(form.waktu_keberangkatan),
        waktu_tiba: dateTime(form.waktu_tiba),
      });

      navigate("/admin/tiket");
      alertSuccess("Berhasil menambahkan tiket!");
    } catch (err) {
      const apiMessage = err?.response?.data?.message || "Gagal menambah tiket.";
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
            <h1 className="text-2xl font-bold text-slate-900 mt-1">Tambah Tiket</h1>
            <p className="text-sm text-orange-800/80">Isi Tiket</p>
          </div>
        </div>

        <div className="mt-6 rounded-2xl bg-white shadow-lg border border-orange-100/80">
          <div className="p-6 lg:p-8">
            <form className="space-y-6" onSubmit={handleSubmit} noValidate>
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
                    disabled
                    className={styleFormDisabled}
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
                    min={toLocalInputValue()}
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
                  <label className="block text-sm font-medium text-slate-800 mb-1">Durasi (menit)</label>
                  <input
                    type="number"
                    value={form.durasi}
                    disabled
                    className={styleFormDisabled}
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
                    disabled
                    className={styleFormDisabled}
                  />
                </div>
              </div>
              {loadingMeta && (
                <div className="text-sm text-slate-600">Memuat daftar rute dan company...</div>
              )}

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center justify-center rounded-xl bg-orange-600 px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-orange-700 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Menyimpan..." : "Simpan Tiket"}
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
