import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import NavbarAdmin from "../../../components/default/NavbarAdmin.jsx";
import { BASE_URL } from "../../../api/index.jsx";
// API admin company (get detail + update)
import { fetchCompanyById, updateCompany } from "../../../api/apiAdminCompany.jsx";
import companyPlaceholder from "../../../assets/building.png";
import { alertSuccess } from "../../../lib/Alert.jsx";
import { toast } from "react-toastify";

const styleForm = "block w-full rounded-xl border border-orange-100 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-orange-400 focus:ring-2 focus:ring-orange-200 transition";

export default function CompanyEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    logo: null,
    prevLogo: null,
  });

  useEffect(() => {
    // ambil data company sesuai id
    const fetchCompany = async () => {
      try {
        const data = await fetchCompanyById(id);
        setForm({
          name: data.nama_company || "",
          email: data.email_company || "",
          phone: data.no_telp_company || "",
          address: data.alamat_company || "",
          logo: null,
          prevLogo: data.logo_company || null,
        });
      } catch (err) {
        const msg =
          err?.response?.data?.message || "Gagal memuat data company.";
        setErrorMessage(msg);
      } finally {
        setLoading(false);
      }
    };

    fetchCompany();
  }, [id]);

  const preview = useMemo(() => {
    if (form.logo instanceof File) {
      return URL.createObjectURL(form.logo);
    }
    if (form.prevLogo) {
      return form.prevLogo.startsWith("http")
        ? form.prevLogo
        : `${BASE_URL}/storage/${form.prevLogo}`;
    }
    return companyPlaceholder;
  }, [form.logo, form.prevLogo]);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  // Simpan file logo baru ke state
  const handleLogo = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;


    //pengecekan 
    const tipeFiles = ["image/png", "image/jpeg"];
    if (!tipeFiles.includes(file.type)) {
      setErrorMessage("Format file harus PNG, JPG, atau JPEG!");
      toast.error("Format file harus PNG, JPG, atau JPEG!");
      e.target.value = "";
      return;
    }
    if (file) {
      setForm((prev) => ({ ...prev, logo: file }));
    }
  };

  const handleReset = () => {
    setForm((prev) => ({
      name: "",
      email: "",
      phone: "",
      address: "",
      logo: null,
      prevLogo: prev.prevLogo,
    }));
    setErrorMessage("");
  };

  const validateDataForm = () => {
    if (!form.name || !form.email || !form.phone
      || !form.address
    ) {
      setErrorMessage("Inputan tidak boleh kosong!");
      toast.error("Inputan data tidak boleh kosong!");
      return false;
    }

    if (!/^[0-9]{10,13}$/.test(form.phone)) {
      setErrorMessage("No telepon harus berupa 10-13 digit angka");
      toast.error("No telepon harus berupa 10-13 digit angka");
      return false;
    }

    // 3. Format email
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setErrorMessage("Format email tidak valid");
      toast.error("Format email tidak valid");
      return false;
    }

    setErrorMessage("");
    return true;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    const isValid = validateDataForm();
    if (!isValid) {
      setIsSubmitting(false);
      return;
    }

    try {
      // update
      await updateCompany(id, form);
      navigate("/admin/company");
      alertSuccess("Berhasil mengubah data Company" + form.name);
    } catch (err) {
      let apiMessage = "Gagal menambah company. Silahkan Coba lagi."; // ⬅️ pakai let

      const data = err.response?.data;

      // buat debug kalau mau liat bentuk responsenya
      // console.log("error data", data);

      if (data?.errors?.email_company?.length) {
        // dari Laravel validator 'email_company'
        // contoh isi: ["The email company has already been taken."]
        apiMessage = "Email sudah terdaftar, silakan gunakan email lain.";
      } else if (typeof data?.message === "string") {
        apiMessage = data.message;
      }

      setErrorMessage(apiMessage);
      toast.error(apiMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex bg-gradient-to-br from-orange-50 to-orange-100/40">
        <NavbarAdmin />
        <main className="flex-1 p-6 lg:p-10">
          <p className="text-sm text-orange-800">Memuat data company...</p>
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
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-orange-700">
              Admin Panel
            </p>
            <h1 className="text-2xl font-bold text-slate-900 mt-1">Edit Company</h1>
            <p className="text-sm text-orange-800/80">
              Perbarui Company
            </p>
          </div>
        </div>

        <div className="mt-6 rounded-2xl bg-white shadow-lg border border-orange-100/80">
          <div className="p-6 lg:p-8">
            <form className="space-y-6" onSubmit={handleSubmit} noValidate>
              <div className="grid grid-cols-1 lg:grid-cols-[auto,1fr] gap-6">
                <div className="flex flex-col items-start gap-3">
                  <div className="w-28 h-28 rounded-2xl border border-orange-100 bg-orange-50 shadow-inner overflow-hidden flex items-center justify-center">
                    <img
                      src={preview}
                      alt="Logo company"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = companyPlaceholder;
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-800 mb-1">
                      Logo Company
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogo}
                      className="block w-full text-sm text-slate-700 file:mr-4 file:rounded-lg file:border-0 file:bg-orange-100 file:px-3 file:py-2 file:text-orange-800 hover:file:bg-orange-200 cursor-pointer"
                    />
                    <p className="text-xs text-slate-500 mt-1">Opsional. PNG/JPG, max 2MB.</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-800 mb-1">
                        Nama Company *
                      </label>
                      <input
                        type="text"
                        value={form.name}
                        onChange={handleChange("name")}
                        required
                        className={styleForm}
                        placeholder="Nama perusahaan"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-800 mb-1">
                        Email *
                      </label>
                      <input
                        type="email"
                        value={form.email}
                        onChange={handleChange("email")}
                        required
                        className={styleForm}
                        placeholder="email@perusahaan.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-800 mb-1">
                        No. Telepon *
                      </label>
                      <input
                        type="text"
                        value={form.phone}
                        onChange={handleChange("phone")}
                        required
                        className={styleForm}
                        placeholder="08xxxxxxxxxx"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-800 mb-1">
                        Alamat *
                      </label>
                      <input
                        type="text"
                        value={form.address}
                        onChange={handleChange("address")}
                        required
                        className={styleForm}
                        placeholder="Alamat lengkap perusahaan"
                      />
                    </div>
                  </div>
                </div>
              </div>

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
                  onClick={handleReset}
                  className="inline-flex items-center justify-center rounded-xl border border-orange-200 px-4 py-3 text-sm font-semibold text-orange-800 transition hover:bg-orange-50"
                >
                  Reset
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/admin/company")}
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
