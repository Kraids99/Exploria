import React, { useEffect, useState } from "react";
import { CheckCircle2, XCircle, Mail } from "lucide-react";
import NavbarAdmin from "../../../components/default/NavbarAdmin.jsx";
import Pagination from "../../../components/default/Pagination.jsx";
import { fetchPembayaran, updatePembayaranStatus, sendEticket } from "../../../api/admin/apiAdminPembayaran.jsx";
import { toast } from "react-toastify";
import { formatDateTime } from "../../../lib/FormatWaktu.js";
import { formatRupiah } from "../../../lib/FormatRupiah.js";

export default function PembayaranAdmin() {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sendingId, setSendingId] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchPembayaran();
      setItems(Array.isArray(data) ? data : []);
      console.log(data);
    } catch (err) {
      setError("Gagal memuat data pembayaran");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [items, page, pageSize]);

  const getStatusText = (status) => (Number(status) === 1 ? "Sudah Dibayar" : "Belum Dibayar");

  const handleBayar = async (id) => {
    setUpdatingId(id);
    try {
      await updatePembayaranStatus(id, 1);
      toast.success("Status pembayaran diubah menjadi sudah dibayar");
      await loadData();
    } catch (err) {
      const msg = err?.message || err?.error || "Gagal mengupdate status pembayaran";
      toast.error(msg);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleSendEmail = async (id) => {
    setSendingId(id);
    try {
      await sendEticket(id);
      toast.success("E-ticket dikirim ke email user");
      await loadData();
    } catch (err) {
      const msg = err?.message || err?.error || "Gagal mengirim e-ticket";
      toast.error(msg);
    } finally {
      setSendingId(null);
    }
  };

  const startIndex = (page - 1) * pageSize;
  const paginatedItems = items.slice(startIndex, startIndex + pageSize);

  const renderDetail = (p) => {
    if (!p) return null;
    const pemesanan = p.pemesanan || {};
    const user = pemesanan.user || {};
    const rincian = pemesanan.rincian_pemesanan || pemesanan.rincianPemesanan || [];
    const firstRincian = Array.isArray(rincian) ? rincian[0] : null;
    const tiket = firstRincian?.tiket;
    const company = tiket?.company;
    const rute = tiket?.rute;
    const asal = rute?.asal;
    const tujuan = rute?.tujuan;

    return (
      <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 text-sm text-slate-800 bg-orange-50 border border-orange-100 rounded-xl p-4">
        <div>
          <p className="font-semibold text-orange-900">User</p>
          <p>{user.nama ?? "-"}</p>
          <p className="text-slate-600 text-xs">{user.email ?? "-"}</p>
        </div>
        <div>
          <p className="font-semibold text-orange-900">Pemesanan</p>
          <p>Kode: {pemesanan.kode_tiket ?? "-"}</p>
          <p>Tanggal: {formatDateTime(pemesanan.tanggal_pemesanan)}</p>
          <p>Total: {formatRupiah(pemesanan.total_biaya_pemesanan)}</p>
        </div>
        <div>
          <p className="font-semibold text-orange-900">Pembayaran</p>
          <p>Metode: {p.metode_pembayaran ?? "-"}</p>
          <p>Status: {getStatusText(p.status_pembayaran)}</p>
        </div>
        {tiket && (
          <div className="sm:col-span-2 lg:col-span-3 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <div>
              <p className="font-semibold text-orange-900">Tiket</p>
              <p>{tiket.nama_tiket ?? "-"}</p>
              <p className="text-slate-600 text-xs">{company?.nama_company ?? "-"}</p>
            </div>
            <div>
              <p className="font-semibold text-orange-900">Jadwal</p>
              <p>Berangkat: {formatDateTime(tiket.waktu_keberangkatan)}</p>
              <p>Tiba: {formatDateTime(tiket.waktu_tiba)}</p>
            </div>
            <div>
              <p className="font-semibold text-orange-900">Rute</p>
              <p>
                {(asal?.terminal ?? "-")} ({asal?.kota ?? "-"}) → {(tujuan?.terminal ?? "-")} ({tujuan?.kota ?? "-"})
              </p>
              <p>Jumlah kursi: {firstRincian?.jumlah_tiket ?? "-"}</p>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen w-full flex bg-orange-50">
      <NavbarAdmin />
      <main className="flex-1 p-4 sm:p-6 lg:p-10">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold text-orange-900">Pembayaran</h1>
            <p className="text-xs sm:text-sm text-orange-700 mt-1">Kelola Pembayaran</p>
          </div>
        </div>

        <div className="mt-4 sm:mt-6 rounded-2xl bg-white shadow-sm border border-orange-100">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-orange-100">
              <thead className="bg-orange-50">
                <tr>
                  <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-[11px] sm:text-xs font-semibold uppercase tracking-wide text-orange-700">Kode Tiket</th>
                  <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-[11px] sm:text-xs font-semibold uppercase tracking-wide text-orange-700">User</th>
                  <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-[11px] sm:text-xs font-semibold uppercase tracking-wide text-orange-700">Metode</th>
                  <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-[11px] sm:text-xs font-semibold uppercase tracking-wide text-orange-700">Total</th>
                  <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-[11px] sm:text-xs font-semibold uppercase tracking-wide text-orange-700">Status</th>
                  <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-[11px] sm:text-xs font-semibold uppercase tracking-wide text-orange-700 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-orange-100">
                {loading && (
                  <tr>
                    <td className="px-4 py-4 text-xs sm:text-sm text-slate-700" colSpan={6}>
                      Memuat pembayaran...
                    </td>
                  </tr>
                )}
                {error && !loading && (
                  <tr>
                    <td className="px-4 py-4 text-xs sm:text-sm text-red-600" colSpan={6}>
                      {error}
                    </td>
                  </tr>
                )}
                {!loading && !items.length && !error && (
                  <tr>
                    <td className="px-4 py-4 text-sm text-slate-700" colSpan={6}>
                      Belum ada data pembayaran.
                    </td>
                  </tr>
                )}
                {paginatedItems.map((pembayaran) => {
                  const pemesanan = pembayaran.pemesanan || {};
                  const user = pemesanan.user || {};
                  const isPaid = Number(pembayaran.status_pembayaran) === 1;
                  const alreadySent = Boolean(pembayaran.mail_tiket);
                  const rowKey = pembayaran.id_pembayaran || pemesanan.id_pemesanan || pemesanan.id;

                  return (
                    <React.Fragment key={rowKey}>
                      <tr className="hover:bg-orange-50/70">
                        <td className="px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-semibold text-slate-900">{pemesanan.kode_tiket ?? "-"}</td>
                        <td className="px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-slate-700">
                          <div className="flex flex-col">
                            <span className="font-medium text-slate-900">{user.nama ?? "-"}</span>
                            <span className="text-[11px] text-slate-600">{user.email ?? "-"}</span>
                          </div>
                        </td>
                        <td className="px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-slate-700">{pembayaran.metode_pembayaran ?? "-"}</td>
                        <td className="px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-slate-700">{formatRupiah(pemesanan.total_biaya_pemesanan)}</td>
                        <td className="px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm">
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-[11px] sm:text-xs font-semibold ${
                              isPaid ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"
                            }`}
                          >
                            {isPaid ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                            {getStatusText(pembayaran.status_pembayaran)}
                          </span>
                        </td>
                        <td className="px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-right">
                          <div className="inline-flex flex-wrap items-center gap-2 justify-end">
                            {!isPaid && (
                              <button
                                type="button"
                                onClick={() => handleBayar(pembayaran.id_pembayaran)}
                                className="inline-flex items-center gap-1 rounded-lg bg-green-600 px-3 py-2 text-[11px] sm:text-xs font-semibold text-white shadow-sm hover:bg-green-700 disabled:opacity-50"
                                disabled={updatingId === pembayaran.id_pembayaran}
                              >
                                <CheckCircle2 className="w-4 h-4" />
                                {updatingId === pembayaran.id_pembayaran ? "Menyimpan..." : "Tandai Lunas"}
                              </button>
                            )}
                            {isPaid && (
                              <button
                                type="button"
                                onClick={() => handleSendEmail(pembayaran.id_pembayaran)}
                                className="inline-flex items-center gap-1 rounded-lg bg-orange-600 px-3 py-2 text-xs font-semibold text-white shadow-sm hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={sendingId === pembayaran.id_pembayaran || alreadySent}
                              >
                                <Mail className="w-4 h-4" />
                                {sendingId === pembayaran.id_pembayaran
                                  ? "Mengirim..."
                                  : alreadySent
                                  ? "Sudah dikirim"
                                  : "Kirim E-ticket"}
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    </React.Fragment>
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
