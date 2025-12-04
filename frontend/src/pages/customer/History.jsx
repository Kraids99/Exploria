import { useEffect, useState } from "react";
import Footer from "../../components/default/Footer";
import Navbar from "../../components/default/Navbar";
import { fetchPemesanan, fetchPemesananById } from "../../api/customer/apiPemesanan.jsx";
import { createReview } from "../../api/customer/apiReview.jsx";
import { toast } from "react-toastify";

const formatDate = (value) => {
  if (!value) return "-";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" });
};

const formatTime = (value) => {
  if (!value) return "-";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
};

const formatRupiah = (value) => {
  const num = Number(value);
  if (Number.isNaN(num)) return "-";
  return `Rp ${num.toLocaleString("id-ID")}`;
};

export default function History() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reviewModal, setReviewModal] = useState({
    open: false,
    tiketId: null,
    pembayaranId: null,
    pemesananId: null,
  });
  const [reviewForm, setReviewForm] = useState({ rating: 5, komentar: "" });
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await fetchPemesanan();
        const list = Array.isArray(res) ? res : [];
        // ambil detail per pemesanan supaya dapat flag can_review/review_submitted dari backend
        const enriched = await Promise.all(
          list.map(async (order) => {
            const id = order.id_pemesanan || order.id;
            if (!id) return order;
            try {
              const detail = await fetchPemesananById(id);
              return detail?.data ?? detail ?? order;
            } catch {
              return order;
            }
          })
        );
        setOrders(enriched);
      } catch (err) {
        setError(err?.message || "Gagal memuat riwayat.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 fint-sans">
      <Navbar />

      <section className="max-w-6xl mx-auto px-4 py-10">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div>
            <h1 className="text-xl font-bold">Riwayat Pemesanan</h1>
            <p className="text-sm text-slate-600">Pesanan yang pernah kamu buat.</p>
          </div>
        </div>

        {loading ? (
          <p className="text-sm text-slate-600">Memuat riwayat...</p>
        ) : error ? (
          <p className="text-sm text-red-600">{error}</p>
        ) : orders.length === 0 ? (
          <p className="text-gray-600 text-sm">Belum ada riwayat pemesanan.</p>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const rincian =
                order.rincian_pemesanan ||
                order.rincian_pemesanans ||
                order.rincianPemesanan ||
                [];
              const firstRincian = Array.isArray(rincian) ? rincian[0] : null;
              const tiket = firstRincian?.tiket;
              const tiketId = tiket?.id_tiket || firstRincian?.id_tiket;
              const company = tiket?.company;
              const asal = tiket?.rute?.asal;
              const tujuan = tiket?.rute?.tujuan;
              const status = order.status_pemesanan || order.status || "Tidak diketahui";
              const reviewSubmitted = Boolean(firstRincian?.review_submitted);
              let canReview = Boolean(firstRincian?.can_review);
              const reviewDeadline = firstRincian?.review_deadline;
              const idPembayaran =
                firstRincian?.id_pembayaran ||
                order.pembayaran?.id_pembayaran ||
                order.id_pembayaran;

              // fallback: hitung canReview jika flag tidak ada
              if (firstRincian && !firstRincian?.can_review) {
                const paid =
                  order.pembayaran && Number(order.pembayaran.status_pembayaran) === 1;
                const tibaRaw = tiket?.waktu_tiba;
                if (paid && tibaRaw) {
                  const tibaDate = new Date(tibaRaw);
                  const now = new Date();
                  const deadline = new Date(tibaDate.getTime() + 30 * 24 * 60 * 60 * 1000);
                  if (tibaDate <= now && now <= deadline && !reviewSubmitted) {
                    canReview = true;
                  }
                }
              }

              return (
                <div
                  key={order.id_pemesanan || order.id}
                  className="bg-white shadow-sm rounded-2xl p-6 md:p-8"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="text-lg font-bold">{tiket?.nama_tiket || "Tiket"}</p>
                      <p className="text-sm font-semibold text-gray-600">
                        {order.kode_tiket || "-"} | {company?.nama_company || "-"}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row justify-between items-center border-b pb-4 gap-3">
                    <div>
                      <p className="text-sm font-semibold">
                        {formatDate(order.tanggal_pemesanan)} | {formatTime(order.tanggal_pemesanan)}
                      </p>
                      <p className="text-sm">{asal?.terminal || asal?.kota || "-"}</p>
                    </div>

                    <div className="text-center py-2 font-bold text-orange-600 text-4xl">-&gt;</div>

                    <div className="text-right">
                      <p className="text-sm">{tujuan?.terminal || tujuan?.kota || "-"}</p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center mt-3">
                    <span
                      className={`text-xs font-semibold px-3 py-1 rounded-full ${
                        status.toLowerCase().includes("batal")
                          ? "bg-red-100 text-red-600"
                          : status.toLowerCase().includes("menunggu")
                          ? "bg-amber-100 text-amber-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {status}
                    </span>

                    <div className="text-right">
                      <p className="text-xs text-gray-500">Total Bayar</p>
                      <p className="text-md font-bold">
                        {formatRupiah(order.total_biaya_pemesanan)}
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-xs text-slate-600">
                    <div className="flex items-center gap-2">
                      {reviewSubmitted ? (
                        <span className="inline-flex items-center gap-2 rounded-full bg-slate-50 px-3 py-1 text-slate-700 font-semibold">
                          Review tidak tersedia
                        </span>
                      ) : canReview ? (
                        <button
                          type="button"
                          className="inline-flex items-center gap-2 rounded-full bg-orange-50 px-3 py-1 text-orange-700 font-semibold hover:bg-orange-100"
                          onClick={() =>
                            setReviewModal({
                              open: true,
                              tiketId: tiketId,
                              pembayaranId: idPembayaran,
                              pemesananId: order.id_pemesanan || order.id,
                            })
                          }
                        >
                          Tambah Review
                        </button>
                      ) : (
                        <span className="inline-flex items-center gap-2 rounded-full bg-slate-50 px-3 py-1 text-slate-700 font-semibold">
                          Review tidak tersedia
                        </span>
                      )}
                      {reviewDeadline && !reviewSubmitted && canReview && (
                        <span className="text-[11px] text-slate-500">
                          Batas review: {formatDate(reviewDeadline)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <Footer />

      {reviewModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-xl p-6 relative">
            <h3 className="text-lg font-semibold text-slate-900">Tambah Review</h3>
            <p className="text-sm text-slate-600 mb-4">Berikan rating dan komentar untuk perjalananmu.</p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-800 mb-1">Rating</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => {
                    const active = reviewForm.rating >= star;
                    return (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setReviewForm((prev) => ({ ...prev, rating: star }))}
                        className="text-2xl leading-none"
                        aria-label={`Pilih rating ${star}`}
                      >
                        <span className={active ? "text-orange-500" : "text-slate-300"}>
                          ★
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-800 mb-1">Komentar (opsional)</label>
                <textarea
                  value={reviewForm.komentar}
                  onChange={(e) => setReviewForm((prev) => ({ ...prev, komentar: e.target.value }))}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                  rows={4}
                  placeholder="Tulis pengalamanmu..."
                />
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                className="px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 rounded-lg"
                onClick={() => setReviewModal({ open: false, tiketId: null, pembayaranId: null, pemesananId: null })}
                disabled={reviewSubmitting}
              >
                Batal
              </button>
              <button
                type="button"
                className="px-4 py-2 text-sm font-semibold text-white bg-orange-600 rounded-lg hover:bg-orange-700 disabled:opacity-60"
                onClick={async () => {
                  if (!reviewModal.tiketId || !reviewModal.pembayaranId) {
                    toast.error("Data review tidak lengkap");
                    return;
                  }
                  setReviewSubmitting(true);
                  try {
                    await createReview({
                      id_tiket: reviewModal.tiketId,
                      id_pembayaran: reviewModal.pembayaranId,
                      rating: reviewForm.rating,
                      komentar: reviewForm.komentar,
                    });
                    toast.success("Review berhasil dikirim");
                    // refresh list to update status
                    setOrders([]);
                    setLoading(true);
                    const res = await fetchPemesanan();
                    const list = Array.isArray(res) ? res : [];
                    const enriched = await Promise.all(
                      list.map(async (order) => {
                        const id = order.id_pemesanan || order.id;
                        if (!id) return order;
                        try {
                          const detail = await fetchPemesananById(id);
                          return detail?.data ?? detail ?? order;
                        } catch {
                          return order;
                        }
                      })
                    );
                    setOrders(enriched);
                    setReviewModal({ open: false, tiketId: null, pembayaranId: null, pemesananId: null });
                  } catch (err) {
                    toast.error(err?.message || "Gagal mengirim review");
                  } finally {
                    setReviewSubmitting(false);
                    setLoading(false);
                  }
                }}
                disabled={reviewSubmitting}
              >
                {reviewSubmitting ? "Menyimpan..." : "Kirim Review"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
