// src/pages/customer/Payment3.jsx
import { useState, useEffect } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";

import Navbar from "../../components/default/Navbar";
import Footer from "../../components/default/Footer";
import header from "../../assets/busHeader.jpeg";
import BusLoader from "../../components/default/BusLoader.jsx";

import { getTiketById } from "../../api/apiTiket.jsx";
import { createReview } from "../../api/apiReview.jsx";
import { toast } from "react-toastify";

import QRCode from "react-qr-code";

function Payment3() {
  const navigate = useNavigate();
  const { id } = useParams(); // id_tiket dari /ereceipt/:id
  const [searchParams] = useSearchParams();

  const id_pembayaran = searchParams.get("payment") || null;
  const kodeTiketQuery = searchParams.get("code") || "";

  const [tiket, setTiket] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  // Ambil detail tiket berdasarkan id_tiket
  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getTiketById(id);
        console.log("Payment3 getTiketById =", data);

        const t = data?.data ?? data;
        if (!t) {
          setError("Tiket tidak ditemukan.");
          setTiket(null);
        } else {
          setTiket(t);
        }
      } catch (err) {
        console.error(err);
        setError("Gagal mengambil detail tiket");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchDetail();
    } else {
      setError("ID tiket tidak ditemukan di URL.");
    }
  }, [id]);

  // ---- state loading / error ----
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#F5F5F7]">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <BusLoader message="Memuat detail pembayaran..." />
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col bg-[#F5F5F7]">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-sm text-red-500">{error}</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (!tiket) {
    return (
      <div className="min-h-screen flex flex-col bg-[#F5F5F7]">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-sm text-slate-600">Tiket tidak ditemukan.</p>
        </main>
        <Footer />
      </div>
    );
  }

  // ---- mapping data tiket ----
  const companyName = tiket.company?.nama_company || "Nama Perusahaan";

  const departureTime =
    tiket.waktu_keberangkatan?.substring(11, 16) || "--:--";
  const arrivalTime = tiket.waktu_tiba?.substring(11, 16) || "--:--";

  const departureDate = tiket.waktu_keberangkatan?.substring(0, 10) || "";
  const arrivalDate =
    tiket.waktu_tiba?.substring(0, 10) || departureDate || "";

  const departureCity = tiket.rute?.asal?.kota || "-";
  const departureTerminal = tiket.rute?.asal?.terminal || "-";

  const arrivalCity = tiket.rute?.tujuan?.kota || "-";
  const arrivalTerminal = tiket.rute?.tujuan?.terminal || "-";

  // kode E-Ticket — pakai yang dari DB (kode_tiket), fallback kalau tidak ada
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const userCode = user ? (user.id_user || user.id) : "guest";

  const eticketCode =
    kodeTiketQuery ||
    tiket.kode_tiket ||
    `EXP-${userCode}-${tiket.id_tiket}-${departureDate || "nodate"}`;

  // ---- submit review ----
  const handleSubmitReview = async (e) => {
    e.preventDefault();

    if (!id_pembayaran) {
      toast.error("ID pembayaran tidak ditemukan, tidak bisa menyimpan review");
      return;
    }

    if (!rating) {
      toast.error("Silakan pilih rating terlebih dahulu");
      return;
    }

    try {
      setSubmittingReview(true);

      await createReview({
        id_pembayaran: id_pembayaran,
        id_tiket: tiket.id_tiket || Number(id),   
        rating,
        komentar: comment,
      });

      toast.success("Terima kasih atas ulasanmu!");
      navigate("/"); // kembali ke beranda
    } catch (err) {
      console.error(err);
      // coba ambil pesan dari backend kalau ada
      const backendMsg =
        err?.errors?.id_tiket?.[0] ||
        err?.message ||
        "Gagal mengirim review";
      toast.error(backendMsg);
    } finally {
      setSubmittingReview(false);
    }
  };


  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Navbar />

      <section className="max-w-5xl mx-auto px-4 pt-6">
        <div className="rounded-3xl overflow-hidden shadow-md">
          <img
            src={header}
            alt={companyName}
            className="w-full h-36 md:h-44 lg:h-52 object-cover opacity-70"
          />
        </div>
      </section>


      <div className="bg-white rounded-2xl shadow-md p-6 md:p-8 max-w-4xl mx-auto px-4 py-10 mt-10">
        <h1 className="text-2xl font-semibold text-slate-900 mb-4">
          {companyName}
        </h1>

        <div className="flex flex-wrap items-center gap-6 justify-start md:justify-center mb-6">
          {["Pesan", "Review", "Bayar", "E-Ticket"].map((label, idx) => (
            <div
              key={label}
              className="flex items-center gap-2 text-sm font-medium"
            >
              <div
                className={`w-8 h-8 flex items-center justify-center rounded-full border-2 ${idx === 3
                  ? "bg-orange-500 border-orange-500 text-white"
                  : "border-slate-300 text-slate-500"
                  }`}
              >
                {idx + 1}
              </div>
              <span
                className={
                  idx === 2 ? "text-slate-900" : "text-slate-500"
                }
              >
                {label}
              </span>
              {idx < 3 && (
                <div className="hidden md:block w-16 h-px bg-slate-200 mx-1" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* KONTEN */}
      <div className="w-[90%] md:w-[80%] mx-auto bg-white p-6 rounded-xl shadow mt-6">
        {/* Ringkasan perjalanan */}
        <div className="mt-2 bg-gray-50 rounded-2xl shadow-md p-6 md:p-8">
          <p className="text-lg font-bold mb-4">Pembayaran Berhasil!</p>

          <div className="flex justify-between items-center w-full">
            <div className="text-left">
              <p className="text-sm font-bold">
                {departureDate} - {departureTime}
              </p>
              <p className="text-gray-600 text-sm">
                {departureCity} - {departureTerminal}
              </p>
            </div>

            <div className="text-center mx-4 shrink-0">
              <p className="text-blue-950 font-extrabold text-sm">
                {companyName}
              </p>
              <p className="text-4xl text-orange-600 font-extrabold">→</p>
            </div>

            <div className="text-right">
              <p className="text-sm font-bold">
                {arrivalDate} - {arrivalTime}
              </p>
              <p className="text-gray-600 text-sm">
                {arrivalCity} - {arrivalTerminal}
              </p>
            </div>
          </div>
        </div>

        {/* QR / Barcode E-Ticket */}
        <div className="mt-6 flex flex-col items-center gap-2">
          <p className="text-sm text-slate-600">
            E-Ticket (tunjukkan saat naik bus)
          </p>
          <div className="bg-white p-4 rounded-2xl shadow">
            <QRCode value={eticketCode} size={128} />
          </div>
          <p className="text-[10px] text-slate-400 break-all mt-1">
            {eticketCode}
          </p>
        </div>

        {/* Bagian review */}
        <p className="text-center text-black text-3xl mt-12 mb-2">
          Bagaimana Pengalaman Anda?
        </p>
        <p className="text-center text-gray-500 text-xs mb-4">
          Berikan rating dan ulasan terkait dengan layanan kami
        </p>

        <form onSubmit={handleSubmitReview} className="mt-2 space-y-4">
          {/* Rating bintang */}
          <div className="flex justify-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className="text-3xl transition-transform"
              >
                <span
                  className={
                    star <= rating ? "text-yellow-400" : "text-gray-300"
                  }
                >
                  ★
                </span>
              </button>
            ))}
          </div>

          {/* Textarea komentar */}
          <div>
            <textarea
              className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm
                         focus:outline-none focus:ring-1 focus:ring-orange-400"
              rows={3}
              placeholder="Tulis ulasanmu di sini (opsional)..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>

          {/* Tombol kirim review */}
          <button
            type="submit"
            disabled={submittingReview}
            className="w-full bg-orange-500 text-white py-2 rounded-xl 
                       font-semibold text-sm hover:bg-[#cf4230] transition-colors
                       disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submittingReview
              ? "Mengirim ulasan..."
              : "Kirim Review & Kembali ke Beranda"}
          </button>
        </form>

        <button
          type="button"
          className="mt-2 w-full text-xs text-gray-500 underline"
          onClick={() => navigate("/")}
        >
          Lewati, langsung kembali ke beranda
        </button>
      </div>

      <Footer />
    </div>
  );
}

export default Payment3;
