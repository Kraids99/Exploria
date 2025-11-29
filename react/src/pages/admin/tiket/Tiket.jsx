import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PencilLine, Plus, Trash2 } from "lucide-react";
import NavbarAdmin from "../../../components/default/NavbarAdmin.jsx";
import { fetchTiket, deleteTiket } from "../../../api/apiAdminTiket.jsx";

export default function TiketList() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchTiket();
        setItems(data);
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
    const confirmed = window.confirm("Hapus tiket ini?");
    if (!confirmed) return;
    try {
      await deleteTiket(id);
      setItems((prev) => prev.filter((item) => String(item.id_tiket || item.id) !== String(id)));
    } catch (err) {
      setError("Gagal menghapus tiket");
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
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-orange-700">Harga</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-orange-700">Stok</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-orange-700 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-orange-100">
                {loading && (
                  <tr>
                    <td colSpan={4} className="px-4 py-3 text-sm text-slate-700">Memuat tiket...</td>
                  </tr>
                )}
                {error && !loading && (
                  <tr>
                    <td colSpan={4} className="px-4 py-3 text-sm text-red-600">{error}</td>
                  </tr>
                )}
                {!loading && !items.length && !error && (
                  <tr>
                    <td colSpan={4} className="px-4 py-3 text-sm text-slate-700">Belum ada data tiket.</td>
                  </tr>
                )}
                {items.map((tiket) => {
                  const id = tiket.id_tiket || tiket.id;
                  return (
                    <tr key={id} className="hover:bg-orange-50/70">
                      <td className="px-4 py-3 text-sm font-semibold text-slate-900">{tiket.nama_tiket || "-"}</td>
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
