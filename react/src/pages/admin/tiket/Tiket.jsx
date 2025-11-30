import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PencilLine, Plus, Trash2 } from "lucide-react";
import NavbarAdmin from "../../../components/default/NavbarAdmin.jsx";
import { fetchTiket, deleteTiket } from "../../../api/apiAdminTiket.jsx";
import { fetchCompanies } from "../../../api/apiAdminCompany.jsx";

import { alertConfirm, alertSuccess } from "../../../lib/Alert.jsx";
import { toast } from "react-toastify";

// Format waktu ke tampilan dd-MM-YYYY HH:mm
const formatDateTime = (value) => {
  if (!value) return "-";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  const pad = (n) => String(n).padStart(2, "0");
  return `${pad(d.getDate())}-${pad(d.getMonth() + 1)}-${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

export default function TiketList() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [companyMap, setCompanyMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const [tiketData, companyData] = await Promise.all([
          fetchTiket(),
          fetchCompanies().catch(() => []),
        ]);
        setItems(tiketData);
        const map = {};
        companyData.forEach((c) => {
          const id = c.id_company || c.id;
          const name = c.nama_company || c.name;
          if (id) map[id] = name;
        });
        setCompanyMap(map);
      } catch (err) {
        setError("Gagal memuat tiket");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleDelete = async (id) => {
    if (!id) return;

    const confirmed = await alertConfirm({
      title: "Hapus Tiket ini?",
      text: "Tindakan ini tidak dapat dibatalkan.",
      icon: "warning",
      confirmButtonText: "Ya",
      cancelButtonText: "Batal",
    });
    if (!confirmed) return;
    try {
      await deleteTiket(id);
      setItems((prev) => prev.filter((item) => String(item.id_tiket || item.id) !== String(id)));
      alertSuccess("Rute berhasil dihapus!"); 
    } catch (err) {
      setError("Gagal menghapus tiket");
      toast.error("Gagal menghapus rute"); 
    }
  };

  return (
    <div className="min-h-screen flex bg-orange-50">
      <NavbarAdmin />
      <main className="flex-1 p-6 lg:p-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-orange-900">Manajemen Tiket</h1>
            <p className="text-sm text-orange-700 mt-1">Kelola data tiket.</p>
          </div>
          <button
            type="button"
            onClick={() => navigate("/admin/tiket/create")}
            className="inline-flex items-center gap-2 rounded-lg bg-orange-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-700"
          >
            <Plus className="w-4 h-4" /> Tambah Tiket
          </button>
        </div>

        <div className="mt-6 rounded-2xl bg-white shadow-sm border border-orange-100">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-orange-100">
              <thead className="bg-orange-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-orange-700">Nama</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-orange-700">Company</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-orange-700">Berangkat</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-orange-700">Tiba</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-orange-700">Durasi (m)</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-orange-700">Harga</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-orange-700">Stok</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-orange-700 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-orange-100">
                {loading && (
                  <tr>
                    <td colSpan={8} className="px-4 py-3 text-sm text-slate-700">Memuat tiket...</td>
                  </tr>
                )}
                {error && !loading && (
                  <tr>
                    <td colSpan={8} className="px-4 py-3 text-sm text-red-600">{error}</td>
                  </tr>
                )}
                {!loading && !items.length && !error && (
                  <tr>
                    <td colSpan={8} className="px-4 py-3 text-sm text-slate-700">Belum ada data tiket.</td>
                  </tr>
                )}
                {items.map((tiket) => {
                  const id = tiket.id_tiket || tiket.id;
                  const companyId = tiket.id_company || tiket.company_id || tiket.company?.id_company;
                  const companyName =
                    tiket.company?.nama_company ||
                    (companyId && companyMap[companyId]) ||
                    companyId ||
                    "-";
                  return (
                    <tr key={id} className="hover:bg-orange-50/70">
                      <td className="px-4 py-3 text-sm font-semibold text-slate-900">{tiket.nama_tiket || "-"}</td>
                      <td className="px-4 py-3 text-sm text-slate-700">{companyName}</td>
                      <td className="px-4 py-3 text-sm text-slate-700">{formatDateTime(tiket.waktu_keberangkatan)}</td>
                      <td className="px-4 py-3 text-sm text-slate-700">{formatDateTime(tiket.waktu_tiba)}</td>
                      <td className="px-4 py-3 text-sm text-slate-700">{tiket.durasi ?? "-"}</td>
                      <td className="px-4 py-3 text-sm text-slate-700">{tiket.harga ?? "-"}</td>
                      <td className="px-4 py-3 text-sm text-slate-700">{tiket.stok ?? "-"}</td>
                      <td className="px-4 py-3 text-sm text-right">
                        <div className="inline-flex items-center gap-3">
                          <Link
                            to={`/admin/tiket/${id}/edit`}
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
