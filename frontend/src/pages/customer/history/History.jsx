import { useEffect, useState } from "react";
import Footer from "../../../components/default/Footer";
import Navbar from "../../../components/default/Navbar";
import { fetchPemesanan, getPemesananById } from "../../../api/customer/apiPemesanan.jsx";
import { createReview, getReviewByTiket } from "../../../api/customer/apiReview.jsx";
import { formatDate, formatTime } from "../../../lib/FormatWaktu.js";
import { formatRupiah } from "../../../lib/FormatRupiah.js";
import { toast } from "react-toastify";
import BusLoader from "../../../components/default/BusLoader.jsx";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { alertConfirm } from "../../../lib/Alert.jsx";

function History() {
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

  // menandai pemesanan mana saja yang sudah pernah direview 
  const [reviewedMap, setReviewedMap] = useState({});
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  // handler untuk lanjut pembayaran dari riwayat
  const handleContinuePayment = async (pemesananId) => {
    if (!pemesananId) {
      toast.error("ID pemesanan tidak ditemukan");
      return;
    }

    const confirmed = await alertConfirm({
      title: "Apakah kamu ingin melakukan pembayaran?",
      text: "Kamu harus segera menyelesaikannya.",
      icon: "info",
      confirmButtonText: "Ya",
      cancelButtonText: "Batal",
    });

    if (!confirmed) return;

    navigate(`/selectpayment/${pemesananId}`);
  };


  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await fetchPemesanan();
        const list = Array.isArray(res) ? res : [];

        // ambil detail lengkap pemesanan berdasarkan id dan cek status review
        const enriched = await Promise.all(
          list.map(async (order) => {
            const id = order.id_pemesanan || order.id;
            let detailOrder = order;

            // ambil detail pemesanan dulu (biar relasinya ke-load)
            if (id) {
              try {
                const detail = await getPemesananById(id);
                detailOrder = detail?.data ?? detail ?? order;
              } catch {
                // kalau gagal, fallback ke order awal
              }
            }

            // cek apakah sudah ada review di tabel review untuk tiket + pembayaran ini
            try {
              const rincian =
                detailOrder.rincian_pemesanan ||
                detailOrder.rincian_pemesanans ||
                detailOrder.rincianPemesanan ||
                [];
              const firstRincian = Array.isArray(rincian) ? rincian[0] : null;

              const tiket = firstRincian?.tiket;
              const tiketId = tiket?.id_tiket || firstRincian?.id_tiket;

              // ambil id pembayaran dari beberapa kemungkinan field
              const idPembayaran =
                firstRincian?.id_pembayaran ||
                detailOrder.pembayaran?.id_pembayaran ||
                detailOrder.id_pembayaran;

              if (tiketId && idPembayaran) {
                const reviews = await getReviewByTiket(tiketId);

                // ada review utk pembayaran ini & status_review true
                const hasReview =
                  Array.isArray(reviews) &&
                  reviews.some(
                    (rev) =>
                      Number(rev.id_pembayaran) === Number(idPembayaran) &&
                      (rev.status_review === true ||
                        rev.status_review === 1 ||
                        rev.status_review === "1")
                  );

                if (hasReview && firstRincian) {
                  // tanamkan flag ke object rincian supaya bisa dibaca saat render
                  firstRincian.status_review = true;
                  firstRincian.review_submitted =
                    firstRincian.review_submitted ?? true;
                }
              }
            } catch (e) {
              console.error("Gagal cek review untuk pemesanan", e);
            }

            return detailOrder;
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

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] font-sans flex flex-col">
        <Navbar />

        <main className="flex-1 mx-auto max-w-6xl px-4 pb-16 flex items-center justify-center pl-14 md:pl-0 pt-6 md:pt-24">
          <BusLoader message="Memuat History...." />
        </main>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
      <Navbar />

      <main className="flex-1 pl-14 md:pl-0 pt-6 md:pt-24 pb-16">
        <section className="max-w-6xl mx-auto px-4">
          <div className="flex items-center gap-2 mb-3">
            <button
              type="button"
              onClick={handleBack}
              className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white h-9 w-9 shadow-sm hover:bg-slate-50 transition-colors"
            >
              <FaArrowLeft className="h-4 w-4 text-slate-700" />
            </button>
            <span className="text-xs text-slate-500 hidden sm:inline">
              Kembali
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <div>
              <h1 className="text-xl font-bold">Riwayat Pemesanan</h1>
              <p className="text-sm text-slate-600">
                Pesanan yang pernah kamu buat.
              </p>
            </div>
          </div>

          {error ? (
            <p className="text-sm text-red-600">{error}</p>
          ) : orders.length === 0 ? (
            <p className="text-gray-600 text-sm">
              Belum ada riwayat pemesanan.
            </p>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => {
                const pemesananId = order.id_pemesanan || order.id;

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
                const status =
                  order.status_pemesanan || order.status || "Tidak diketahui";

                // flag status review dari backend
                const statusReviewBackend =
                  firstRincian?.status_review ??
                  firstRincian?.review?.status_review ??
                  firstRincian?.review_status ??
                  null;

                const backendSubmitted =
                  Boolean(firstRincian?.review_submitted) ||
                  Boolean(statusReviewBackend);

                const reviewSubmitted = Boolean(
                  reviewedMap[pemesananId] || backendSubmitted
                );
                let canReview = Boolean(firstRincian?.can_review);
                const reviewDeadline = firstRincian?.review_deadline;
                const idPembayaran =
                  firstRincian?.id_pembayaran ||
                  order.pembayaran?.id_pembayaran ||
                  order.id_pembayaran;

                // cek apakah statusnya "menunggu pembayaran"
                const isMenungguPembayaran =
                  typeof status === "string" &&
                  status.toLowerCase().includes("menunggu");

                if (firstRincian && !firstRincian?.can_review) {
                  const paid =
                    order.pembayaran &&
                    Number(order.pembayaran.status_pembayaran) === 1;
                  const tibaRaw = tiket?.waktu_tiba;
                  if (paid && tibaRaw) {
                    const tibaDate = new Date(tibaRaw);
                    const now = new Date();
                    const deadline = new Date(
                      tibaDate.getTime() + 30 * 24 * 60 * 60 * 1000
                    );
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
                        <p className="text-lg font-bold">
                          {tiket?.nama_tiket || "Tiket"}
                        </p>
                        <p className="text-sm font-semibold text-gray-600">
                          {order.kode_tiket || "-"} |{" "}
                          {company?.nama_company || "-"}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col md:flex-row justify-between items-center border-b pb-4 gap-3">
                      <div>
                        <p className="text-sm font-semibold">
                          {formatDate(order.tanggal_pemesanan)} |{" "}
                          {formatTime(order.tanggal_pemesanan)}
                        </p>
                        <p className="text-sm">
                          {asal?.terminal || asal?.kota || "-"}
                        </p>
                      </div>

                      <div className="text-center py-2 font-bold text-orange-600 text-4xl">
                        →
                      </div>

                      <div className="text-right">
                        <p className="text-sm">
                          {tujuan?.terminal || tujuan?.kota || "-"}
                        </p>
                      </div>
                    </div>

                    <div className="flex justify-between items-center mt-3">
                      <span
                        className={`text-xs font-semibold px-3 py-1 rounded-full ${status.toLowerCase().includes("batal")
                          ? "bg-red-100 text-red-600"
                          : isMenungguPembayaran
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

                        {/*  pembayaran hanya muncul jika status menunggu pembayaran */}
                        {isMenungguPembayaran && (
                          <button
                            type="button"
                            onClick={() =>
                              handleContinuePayment(pemesananId)
                            }
                            className="mt-2 inline-flex items-center justify-center rounded-full bg-orange-500 px-3 py-1 text-[11px] font-semibold text-white hover:bg-orange-600"
                          >
                            Lanjutkan Pembayaran
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="mt-3 flex items-center justify-between text-xs text-slate-600">
                      <div className="flex items-center gap-2">
                        {reviewSubmitted ? (
                          <span className="inline-flex items-center gap-2 rounded-full bg-slate-50 px-3 py-1 text-slate-700 font-semibold">
                            Review sudah dikirim
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
                                pemesananId,
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
      </main>

      <Footer />

      {reviewModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-xl p-6 relative">
            <h3 className="text-lg font-semibold text-slate-900">
              Tambah Review
            </h3>
            <p className="text-sm text-slate-600 mb-4">
              Berikan rating dan komentar untuk perjalananmu.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-800 mb-1">
                  Rating
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => {
                    const active = reviewForm.rating >= star;
                    return (
                      <button
                        type="button"
                        key={star}
                        onClick={() =>
                          setReviewForm((prev) => ({
                            ...prev,
                            rating: star,
                          }))
                        }
                        className="text-2xl leading-none"
                        aria-label={`Pilih rating ${star}`}
                      >
                        <span
                          className={
                            active ? "text-orange-500" : "text-slate-300"
                          }
                        >
                          ★
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-800 mb-1">
                  Komentar (opsional)
                </label>
                <textarea
                  value={reviewForm.komentar}
                  onChange={(e) =>
                    setReviewForm((prev) => ({
                      ...prev,
                      komentar: e.target.value,
                    }))
                  }
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
                onClick={() =>
                  setReviewModal({
                    open: false,
                    tiketId: null,
                    pembayaranId: null,
                    pemesananId: null,
                  })
                }
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
                      status_review: true,
                    });
                    toast.success("Review berhasil dikirim");

                    setReviewedMap((prev) => ({
                      ...prev,
                      [reviewModal.pemesananId]: true,
                    }));

                    setReviewModal({
                      open: false,
                      tiketId: null,
                      pembayaranId: null,
                      pemesananId: null,
                    });

                    setLoading(true);
                    const res = await fetchPemesanan();
                    const list = Array.isArray(res) ? res : [];
                    const enriched = await Promise.all(
                      list.map(async (order) => {
                        const id = order.id_pemesanan || order.id;
                        if (!id) return order;
                        try {
                          const detail = await getPemesananById(id);
                          return detail?.data ?? detail ?? order;
                        } catch {
                          return order;
                        }
                      })
                    );
                    setOrders(enriched);
                    setReviewModal({
                      open: false,
                      tiketId: null,
                      pembayaranId: null,
                      pemesananId: null,
                    });
                  } catch (err) {
                    const status = err.response?.status;
                    const data = err.response?.data;
                    const serverMsg =
                      (data &&
                        typeof data.message === "string" &&
                        data.message) ||
                      (typeof data === "string" ? data : null);

                    console.log("ERROR REVIEW = ", data);

                    const msgLower =
                      typeof serverMsg === "string"
                        ? serverMsg.toLowerCase()
                        : "";

                    if (
                      status === 422 &&
                      msgLower.includes("sudah memberikan review")
                    ) {
                      setReviewedMap((prev) => ({
                        ...prev,
                        [reviewModal.pemesananId]: true,
                      }));

                      toast.info(
                        serverMsg ||
                        "Kamu sudah memberikan review untuk tiket ini"
                      );

                      setReviewModal({
                        open: false,
                        tiketId: null,
                        pembayaranId: null,
                        pemesananId: null,
                      });
                    } else if (
                      status === 422 &&
                      typeof serverMsg === "string" &&
                      msgLower.includes("batas review")
                    ) {
                      toast.error(
                        serverMsg || "Batas review 30 hari sudah lewat"
                      );
                    } else if (serverMsg) {
                      toast.error(serverMsg);
                    } else {
                      toast.error("Gagal mengirim review");
                    }
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

export default History;
