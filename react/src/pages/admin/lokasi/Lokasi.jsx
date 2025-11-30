import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PencilLine, Plus, Trash2 } from "lucide-react";
import NavbarAdmin from "../../../components/default/NavbarAdmin.jsx";
// API admin lokasi (list/detail/delete)

import { toast } from "react-toastify";
import { alertSuccess, alertConfirm } from "../../../lib/Alert.jsx";
import {
  fetchLokasi,
  deleteLokasi,
} from "../../../api/apiAdminLokasi.jsx";

export default function LokasiList() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Saat mount: ambil data lokasi
  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchLokasi();
        setItems(data);
      } catch (err) {
        setError("Gagal memuat lokasi");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // Hapus data
  const handleDelete = async (id) => {
    if (!id) return;

    const confirmed = await alertConfirm({
      title: "Hapus Lokasi ini?",
      text: "Tindakan ini tidak dapat dibatalkan.",
      icon: "warning",
      confirmButtonText: "Ya",
      cancelButtonText: "Batal",
    });

    if (!confirmed) return;

    try {
      await deleteLokasi(id);
      setItems((prev) => prev.filter((item) => String(item.id_lokasi || item.id) !== String(id)));
      alertSuccess("Berhasil menghapus data!"); 
    } catch (err) {
      setError("Gagal menghapus lokasi");
      toast.error("Gagal menghapus company ini, silahkan coba lagi"); 
    }
  };

  return (
    <div className="min-h-screen flex bg-orange-50">
      <NavbarAdmin />
      <main className="flex-1 p-6 lg:p-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-orange-900">Manajemen Lokasi</h1>
            <p className="text-sm text-orange-700 mt-1">Kelola terminal dan kota.</p>
          </div>
          <button
            type="button"
            onClick={() => navigate("/admin/lokasi/create")}
            className="inline-flex items-center gap-2 rounded-lg bg-orange-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-700"
          >
            <Plus className="w-4 h-4" /> Tambah Lokasi
          </button>
        </div>

        <div className="mt-6 rounded-2xl bg-white shadow-sm border border-orange-100">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-orange-100">
              <thead className="bg-orange-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-orange-700">Terminal</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-orange-700">Kota</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-orange-700 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-orange-100">
                {loading && (
                  <tr>
                    <td colSpan={3} className="px-4 py-3 text-sm text-slate-700">Memuat lokasi...</td>
                  </tr>
                )}
                {error && !loading && (
                  <tr>
                    <td colSpan={3} className="px-4 py-3 text-sm text-red-600">{error}</td>
                  </tr>
                )}
                {!loading && !items.length && !error && (
                  <tr>
                    <td colSpan={3} className="px-4 py-3 text-sm text-slate-700">Belum ada data lokasi.</td>
                  </tr>
                )}
                {items.map((lokasi) => {
                  const id = lokasi.id_lokasi || lokasi.id;
                  return (
                    <tr key={id} className="hover:bg-orange-50/70">
                      <td className="px-4 py-3 text-sm font-semibold text-slate-900">{lokasi.terminal || "-"}</td>
                      <td className="px-4 py-3 text-sm text-slate-700">{lokasi.kota || "-"}</td>
                      <td className="px-4 py-3 text-sm text-right">
                        <div className="inline-flex items-center gap-3">
                          <Link
                            to={`/admin/lokasi/${id}/edit`}
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
