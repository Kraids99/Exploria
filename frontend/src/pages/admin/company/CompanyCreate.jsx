import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavbarAdmin from "../../../components/default/NavbarAdmin.jsx";
import { createCompany } from "../../../api/admin/apiAdminCompany.jsx";
import companyPlaceholder from "../../../assets/building.png";
import { toast } from "react-toastify";
import { alertSuccess } from "../../../lib/Alert.jsx";
import { styleForm } from "../../../lib/FormStyles.js";

export default function CompanyCreate() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    logo: null,
  });

  // menampilkan preview logo sebelum upload
  const preview = useMemo(() => {
    if (form.logo instanceof File) {
      return URL.createObjectURL(form.logo);
    }
    return companyPlaceholder;
  }, [form.logo]);

  // Input handler umum (error handler)
  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  // error handler logo
  const handleLogo = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;


    //pengecekan 
    const tipeFiles = ["image/png", "image/jpeg"];
    if (!tipeFiles.includes(file.type)) {
      toast.error("Format file harus PNG, JPG, atau JPEG!");
      e.target.value = "";
      return;
    }

    //lolos validasi 
    if (file) {
      setForm((prev) => ({ ...prev, logo: file }));
    }
  };

  // kondisi tekan reset
  const handleReset = () => {
    setForm({
      name: "",
      email: "",
      phone: "",
      address: "",
      logo: null,
    });
  };

  const validateDataForm = () => {
    if (!form.name || !form.email || !form.phone
      || !form.address
    ) {
      toast.error("Inputan data tidak boleh kosong!");
      return false;
    }

    // No telp hanya angka 10-13 digit
    if (!/^[0-9]{10,13}$/.test(form.phone)) {
      toast.error("No telepon harus berupa 10-13 digit angka");
      return false;
    }

    // validasi email
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      toast.error("Format email tidak valid");
      return false;
    }

    return true;
  }

  // kalau submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const isValid = validateDataForm();
    if (!isValid) {
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await createCompany(form);

      navigate("/admin/company");
      alertSuccess("Berhasil menambahkan Company!");
    } catch (err) {
      let apiMessage = "Gagal menambah company. Silahkan Coba lagi."; 

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

return (
  <div className="min-h-screen flex bg-gradient-to-br from-orange-50 to-orange-100/40">
    <NavbarAdmin />
    <main className="flex-1 w-full overflow-x-hidden p-4 sm:p-6 lg:p-10">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-orange-700">
            Admin Panel
          </p>
          <h1 className="text-2xl font-bold text-slate-900 mt-1">Tambah Company</h1>
          <p className="text-sm text-orange-800/80">
            Isi Company
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

            <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl bg-orange-600 px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-orange-700 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Menyimpan..." : "Simpan Company"}
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl border border-orange-200 px-4 py-3 text-sm font-semibold text-orange-800 transition hover:bg-orange-50"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={() => navigate("/admin/company")}
                className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
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
