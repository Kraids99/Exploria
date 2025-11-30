import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PencilLine, Plus, Trash2 } from "lucide-react";
import NavbarAdmin from "../../../components/default/NavbarAdmin";
import { BASE_URL } from "../../../api/index.jsx";
import { fetchCompanies, deleteCompany } from "../../../api/apiAdminCompany.jsx";
import companyPlaceholder from "../../../assets/building.png";
import { toast } from "react-toastify";
import { alertSuccess, alertConfirm} from "../../../lib/Alert.jsx";

export default function Company() {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  // main () otomatis
  useEffect(() => {
    // ambil data company
    const Companies = async () => {
      try {
        const data = await fetchCompanies();
        setCompanies(data);
      } catch (error) {
        console.error("Gagal memuat data company", error);
      } finally {
        setLoading(false);
      }
    };
    Companies();
  }, []);

  // delete data company
  const handleDelete = async (id) => {
    if (!id) return;

    const confirmed = await alertConfirm({
      title: "Hapus Company ini?",
      text: "Tindakan ini tidak dapat dibatalkan.",
      icon: "warning",
      confirmButtonText: "Ya",
      cancelButtonText: "Batal",
    });

    if (!confirmed) return;

    try {
      await deleteCompany(id);
      // ngefilter array lama dari variabel prev 
      setCompanies((prev) => prev.filter((item) => (item.id_company) !== id));
      alertSuccess("Berhasil menghapus data!"); 
    } catch (error) {
      console.error("Gagal menghapus company", error);
      toast.error("Gagal menghapus company ini, silahkan coba lagi"); 
    }
  };

  return (
    <div className="min-h-screen flex bg-orange-50">
      <NavbarAdmin />

      <main className="flex-1 p-6 lg:p-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-orange-900">Manajemen Company</h1>
            <p className="text-sm text-orange-700 mt-1">
              Kelola Company
            </p>
          </div>

          {/* Link ke halaman tambah company */}
          <button
            type="button"
            onClick={() => navigate("/admin/company/create")}
            className="inline-flex items-center gap-2 rounded-lg bg-orange-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-700"
          >
            <Plus className="w-4 h-4" />
            Tambah Company
          </button>
        </div>

        <div className="mt-6 rounded-2xl bg-white shadow-sm border border-orange-100">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-orange-100">
              <thead className="bg-orange-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-orange-700">Logo</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-orange-700">Nama Company</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-orange-700">Email</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-orange-700">No. Telp</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-orange-700">Alamat</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-orange-700 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-orange-100">
                {loading && (
                  <tr>
                    <td className="px-4 py-3 text-sm text-slate-700" colSpan={6}>
                      Memuat company...
                    </td>
                  </tr>
                )}
                {companies.map((company) => {
                  const id = company.id ?? company.id_company ?? company.idCompany ?? "-";
                  const name = company.name ?? company.nama_company ?? "Tidak ada nama";
                  const email = company.email_company ?? company.email ?? "-";
                  const phone = company.no_telp_company ?? company.phone ?? "-";
                  const address = company.address ?? company.alamat_company ?? "-";
                  const logoPath = company.logo_company ?? company.logo;
                  const logoUrl = logoPath ? logoPath.startsWith("http") ? logoPath : `${BASE_URL}/storage/${logoPath}` : companyPlaceholder;
                  return (
                    <tr key={id} className="hover:bg-orange-50/70">
                      <td className="px-4 py-3">
                        <div className="w-12 h-12 overflow-hidden rounded-lg border border-orange-100 bg-orange-50 flex items-center justify-center">
                          <img
                            src={logoUrl}
                            alt={name}
                            className="w-full h-full object-cover"
                            // perintah ke browser Jangan load gambar sekarang, kecuali gambarnya kelihatan di layar. 
                            loading="lazy"

                            // kebalikan dari loading lazy
                            // loading="eager"
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              {/*kalau gagal load set ke gambar default*/ }
                              e.currentTarget.src = companyPlaceholder;
                            }}
                          />
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm font-semibold text-slate-900">{name}</td>
                      <td className="px-4 py-3 text-sm text-slate-700">{email}</td>
                      <td className="px-4 py-3 text-sm text-slate-700">{phone}</td>
                      <td className="px-4 py-3 text-sm text-slate-700">{address}</td>
                      <td className="px-4 py-3 text-sm text-right">
                        <div className="inline-flex items-center gap-3">
                          {/* Link ke halaman edit company */}
                          <Link
                            to={`/admin/company/${id}/edit`}
                            className="text-orange-600 hover:text-orange-700 transition"
                            title="Edit"
                          >
                            <PencilLine className="w-4 h-4" />
                          </Link>
                          <button
                            type="button"
                            className="text-red-600 hover:text-red-700 transition"
                            title="Hapus"
                            onClick={() => handleDelete(id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
