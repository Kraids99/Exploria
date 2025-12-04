import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PencilLine, Plus, Trash2 } from "lucide-react";
import NavbarAdmin from "../../../components/default/NavbarAdmin.jsx";
import Pagination from "../../../components/Pagination.jsx";
import { fetchRute, deleteRute } from "../../../api/admin/apiAdminRute.jsx";

import { alertConfirm, alertSuccess } from "../../../lib/Alert.jsx";
import { toast } from "react-toastify";
export default function RuteList() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Ambil semua rute beserta relasi asal/tujuan
    const load = async () => {
      try {
        const data = await fetchRute();
        setItems(data);
      } catch (err) {
        setError("Gagal memuat rute");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  useEffect(() => {
    const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [items, page, pageSize]);

  const handleDelete = async (id) => {
    if (!id) return;

    const confirmed = await alertConfirm({
      title: "Hapus Rute ini?",
      text: "Tindakan ini tidak dapat dibatalkan.",
      icon: "warning",
      confirmButtonText: "Ya",
      cancelButtonText: "Batal",
    });
    if (!confirmed) return;
    try {
      await deleteRute(id);
      setItems((prev) => prev.filter((item) => String(item.id_rute || item.id) !== String(id)));
      alertSuccess("Rute berhasil dihapus!"); 
    } catch (err) {
      setError("Gagal menghapus rute");
      toast.error("Gagal menghapus rute"); 
    }
  };

  const startIndex = (page - 1) * pageSize;
  const paginatedItems = items.slice(startIndex, startIndex + pageSize);

  return (
    <div className="min-h-screen flex bg-orange-50">
      <NavbarAdmin />
      <main className="flex-1 p-6 lg:p-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-orange-900">Manajemen Rute</h1>
            <p className="text-sm text-orange-700 mt-1">Kelola Rute</p>
          </div>
          <button
            type="button"
            onClick={() => navigate("/admin/rute/create")}
            className="inline-flex items-center gap-2 rounded-lg bg-orange-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-700"
          >
            <Plus className="w-4 h-4" /> Tambah Rute
          </button>
        </div>

        <div className="mt-6 rounded-2xl bg-white shadow-sm border border-orange-100">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-orange-100">
              <thead className="bg-orange-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-orange-700">Asal</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-orange-700">Tujuan</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-orange-700 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-orange-100">
                {loading && (
                  <tr>
                    <td colSpan={3} className="px-4 py-3 text-sm text-slate-700">Memuat rute...</td>
                  </tr>
                )}
                {error && !loading && (
                  <tr>
                    <td colSpan={3} className="px-4 py-3 text-sm text-red-600">{error}</td>
                  </tr>
                )}
                {!loading && !items.length && !error && (
                  <tr>
                    <td colSpan={3} className="px-4 py-3 text-sm text-slate-700">Belum ada data rute.</td>
                  </tr>
                )}
                {paginatedItems.map((rute) => {
                  const id = rute.id_rute || rute.id;
                  const asal = rute.asal?.kota || rute.asal?.terminal || rute.id_lokasi_asal;
                  const tujuan = rute.tujuan?.kota || rute.tujuan?.terminal || rute.id_lokasi_tujuan;
                  return (
                    <tr key={id} className="hover:bg-orange-50/70">
                      <td className="px-4 py-3 text-sm font-semibold text-slate-900">{asal || "-"}</td>
                      <td className="px-4 py-3 text-sm text-slate-700">{tujuan || "-"}</td>
                      <td className="px-4 py-3 text-sm text-right">
                        <div className="inline-flex items-center gap-3">
                          <Link
                            to={`/admin/rute/${id}/edit`}
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
          <Pagination
            page={page}
            totalItems={items.length}
            pageSize={pageSize}
            onChange={setPage}
          />
        </div>
      </main>
    </div>
  );
}
