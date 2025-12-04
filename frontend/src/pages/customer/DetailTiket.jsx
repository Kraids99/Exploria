// src/pages/DetailTiket.jsx
import { useEffect, useState } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { FaStar, FaArrowLeft } from "react-icons/fa";

import Navbar from "../../components/default/Navbar.jsx";
import Footer from "../../components/default/Footer.jsx";
import BusLoader from "../../components/default/BusLoader.jsx";
import header from "../../assets/busHeader.jpeg";

import { getTiketByParams } from "../../api/customer/apiTiket.jsx";
import { getReviewByTiket } from "../../api/customer/apiReview.jsx";

export default function DetailTiket() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();

  const fromCityFilter = searchParams.get("from") || "";
  const toCityFilter = searchParams.get("to") || "";
  const dateFilter = searchParams.get("date") || "";

  const [tiket, setTiket] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [creatingOrder, setCreatingOrder] = useState(false);

  // state untuk review
  const [reviews, setReviews] = useState([]);
  const [ratingScore, setRatingScore] = useState(null);
  const [ratingTotal, setRatingTotal] = useState(0);

  // --- ambil detail tiket ---
  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getTiketByParams(
          fromCityFilter,
          toCityFilter,
          dateFilter
        );
        console.log("detail getTiketByParams =", data);

        const list = Array.isArray(data)
          ? data
          : Array.isArray(data.data)
          ? data.data
          : [];

        const found = list.find(
          (item) => String(item.id_tiket) === String(id)
        );

        if (!found) {
          setError("Tiket tidak ditemukan untuk rute dan tanggal ini.");
          setTiket(null);
        } else {
          setTiket(found);
        }
      } catch (err) {
        console.log(err);
        setError("Gagal mengambil detail tiket");
      } finally {
        setLoading(false);
      }
    };

    if (id && fromCityFilter && toCityFilter && dateFilter) {
      fetchDetail();
    } else {
      setError("Data rute tidak lengkap pada URL.");
    }
  }, [id, fromCityFilter, toCityFilter, dateFilter]);

  // --- ambil review berdasarkan id_tiket ---
  useEffect(() => {
    const fetchReviews = async () => {
      if (!tiket?.id_tiket) return;

      try {
        const data = await getReviewByTiket(tiket.id_tiket);
        console.log("reviews by tiket =", data);

        const list = Array.isArray(data)
          ? data
          : Array.isArray(data?.data)
          ? data.data
          : [];

        setReviews(list);

        if (list.length === 0) {
          setRatingScore(null);
          setRatingTotal(0);
        } else {
          const total = list.length;
          const sum = list.reduce(
            (acc, r) => acc + (Number(r.rating) || 0),
            0
          );
          const avg = sum / total;

          setRatingScore(Number(avg.toFixed(1))); // misal 4.3
          setRatingTotal(total);
        }
      } catch (err) {
        console.log("fetchReviews error =", err);
        // kalau error, biarkan rating fallback saja
      }
    };

    fetchReviews();
  }, [tiket?.id_tiket]);

  // ========= LOADING / ERROR / NOT FOUND (responsif + sidebar padding) =========
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#F5F5F7]">
        <Navbar />
        <main className="flex-1 flex items-center justify-center pl-14 md:pl-0 pt-6 md:pt-24 px-4">
          <BusLoader message="Memuat detail tiket..." />
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col bg-[#F5F5F7]">
        <Navbar />
        <main className="flex-1 flex items-center justify-center pl-14 md:pl-0 pt-6 md:pt-24 px-4">
          <p className="text-sm text-red-500 text-center">{error}</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (!tiket) {
    return (
      <div className="min-h-screen flex flex-col bg-[#F5F5F7]">
        <Navbar />
        <main className="flex-1 flex items-center justify-center pl-14 md:pl-0 pt-6 md:pt-24 px-4">
          <p className="text-sm text-slate-600 text-center">
            Tiket tidak ditemukan.
          </p>
        </main>
        <Footer />
      </div>
    );
  }

  const handleSubmit = () => {
    navigate(
      `/pesan/${tiket.id_tiket}?from=${fromCityFilter}&to=${toCityFilter}&date=${dateFilter}`
    );
  };

  const handleBack = () => {
    navigate(-1);
  };

  const companyName = tiket.company?.nama_company || "Nama Perusahaan";

  const departureTime =
    tiket.waktu_keberangkatan?.substring(11, 16) || "--:--";
  const arrivalTime = tiket.waktu_tiba?.substring(11, 16) || "--:--";

  const departureCity =
    tiket.rute?.asal?.kota || fromCityFilter || "-";
  const departureTerminal =
    tiket.rute?.asal?.terminal || "-";

  const arrivalCity =
    tiket.rute?.tujuan?.kota || toCityFilter || "-";
  const arrivalTerminal =
    tiket.rute?.tujuan?.terminal || "-";

  // fallback kalau belum ada review sama sekali
  const displayRatingScore =
    ratingScore ?? tiket.rating ?? 0;
  const displayRatingTotal =
    ratingTotal || tiket.jumlah_ulasan || 0;

  const latestReviewText =
    reviews.length > 0 && reviews[0].komentar
      ? `“${reviews[0].komentar}”`
      : "Belum ada ulasan untuk perjalanan ini.";

  return (
    <div className="min-h-screen bg-[#F5F5F7] font-sans flex flex-col">
      <Navbar />

      <main className="flex-1 pl-14 md:pl-0 pt-6 md:pt-24 pb-12">
        {/* HEADER + TOMBOL KEMBALI */}
        <section className="max-w-5xl mx-auto px-4">
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

          <div className="rounded-3xl overflow-hidden shadow-md">
            <img
              src={header}
              alt={companyName}
              className="w-full h-36 md:h-44 lg:h-52 object-cover opacity-70"
            />
          </div>
        </section>

        {/* CARD DETAIL */}
        <section className="max-w-6xl mx-auto px-4 pb-0 mt-6">
          <div className="mt-2 rounded-[32px] bg-white shadow-lg border border-slate-100">
            <div className="px-5 py-5 md:px-10 md:py-8">
              {/* Judul + info singkat */}
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="text-center md:text-left">
                  <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
                    {companyName}
                  </h1>

                  {fromCityFilter && toCityFilter && (
                    <p className="mt-1 text-xs text-slate-500">
                      {fromCityFilter} → {toCityFilter} • {dateFilter}
                    </p>
                  )}
                </div>
              </div>

              {/* DETAIL RUTE */}
              <section className="mt-10 md:mt-12">
                <h2 className="text-xs font-semibold tracking-[0.18em] uppercase text-slate-500 text-center md:text-left">
                  Detail Rute
                </h2>

                <div className="mt-4">
                  <div className="relative h-28 md:h-28">
                    {/* garis tengah */}
                    <div className="absolute left-6 right-6 top-1/2 h-1 -translate-y-1/2 bg-slate-900 rounded-full" />

                    <div className="relative flex justify-between items-start px-2 md:px-4">
                      {/* titik awal */}
                      <div className="flex flex-col items-center text-center text-[11px] text-slate-500"><br /><br />
                        <div className="w-4 h-4 rounded-full border-2 border-slate-900 bg-[#f38f4a]" />
                        <span className="mt-2 font-semibold text-slate-700">
                          {departureCity}
                        </span>
                        <span className="text-[10px]">
                          {departureTerminal}
                        </span>
                        <span className="mt-1 text-[10px]">
                          {departureTime}
                        </span>
                      </div>

                      {/* titik akhir */}
                      <div className="flex flex-col items-center text-center text-[11px] text-slate-500"><br /><br />
                        <div className="w-4 h-4 rounded-full border-2 border-slate-900 bg-[#f38f4a]" />
                        <span className="mt-2 font-semibold text-slate-700">
                          {arrivalCity}
                        </span>
                        <span className="text-[10px]">
                          {arrivalTerminal}
                        </span>
                        <span className="mt-1 text-[10px]">
                          {arrivalTime}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <div className="mt-6 border-t border-slate-200" />

              {/* PENILAIAN DAN ULASAN */}
              <section className="mt-6">
                <h2 className="text-xs font-semibold tracking-[0.18em] uppercase text-slate-500 text-center md:text-left">
                  Penilaian dan Ulasan
                </h2>

                <div className="mt-4 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                  <div className="flex flex-col items-center md:items-start">
                    <p className="text-4xl font-bold text-slate-900">
                      {displayRatingScore}
                    </p>
                    <div className="mt-1 flex gap-1 text-[#FFB547]">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <FaStar key={i} />
                      ))}
                    </div>
                    <p className="mt-1 text-xs text-slate-500">
                      {displayRatingTotal > 0
                        ? `${displayRatingTotal.toLocaleString()} ulasan`
                        : "Belum ada ulasan"}
                    </p>
                  </div>

                  <div className="flex-1">
                    <p className="text-sm font-semibold text-slate-900 mb-2">
                      Review Ulasan
                    </p>
                    <div className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm text-slate-700">
                      {latestReviewText}
                    </div>
                  </div>
                </div>
              </section>

              <div className="mt-6 border-t border-slate-200" />

              {/* KEBIJAKAN + BUTTON */}
              <section className="mt-6">
                <h2 className="text-xs font-semibold tracking-[0.18em] uppercase text-slate-500 text-center md:text-left">
                  Kebijakan
                </h2>

                <div className="mt-3 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm text-slate-700">
                  <p className="font-semibold text-slate-900">
                    Ketentuan barang yang dilarang
                  </p>
                  <p className="mt-1 text-xs text-slate-600">
                    Penumpang dilarang membawa barang yang dinyatakan
                    terlarang/ilegal, dan berbau menyengat.
                  </p>
                </div>

                <div className="mt-6 flex justify-center">
                  <button
                    className="inline-flex items-center justify-center rounded-full 
                                  bg-[#E5533D] px-10 py-3 text-sm font-semibold text-white shadow-md 
                                  hover:bg-[#cf4230] transition-colors"
                    onClick={handleSubmit}
                  >
                    Mulai Pemesanan
                  </button>
                </div>
              </section>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
