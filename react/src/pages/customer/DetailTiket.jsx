// src/pages/DetailTiket.jsx
import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import Navbar from "../../components/default/Navbar.jsx";
import Footer from "../../components/default/Footer.jsx";
import header from "../../assets/busHeader.jpeg";
import { getTiketByParams } from "../../api/apiTiket.jsx"; 

export default function DetailTiket() {
  const { id } = useParams();               
  const [searchParams] = useSearchParams(); 

  const fromCityFilter = searchParams.get("from") || "";
  const toCityFilter = searchParams.get("to") || "";
  const dateFilter = searchParams.get("date") || "";

  const [tiket, setTiket] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getTiketByParams(fromCityFilter, toCityFilter, dateFilter);
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

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#F5F5F7]">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-sm text-slate-600">Memuat detail pemesanan...</p>
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

  const companyName = tiket.company?.nama_company || "Nama Perusahaan";
  const busName = tiket.nama_tiket || "Nama Bus";

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

  const duration = tiket.durasi
    ? `${tiket.durasi} jam`
    : "Durasi tidak tersedia";

  const ratingScore = tiket.rating || 4.9;
  const ratingTotal = tiket.jumlah_ulasan || 48000;

  return (
    <div className="min-h-screen bg-[#F5F5F7] font-sans flex flex-col">
      <Navbar />

      <main className="flex-1">
        <section className="max-w-5xl mx-auto px-4 pt-6">
          <div className="rounded-3xl overflow-hidden shadow-md">
            <img
              src={header}
              alt="Bus header"
              className="w-full h-36 md:h-44 lg:h-52 object-cover opacity-70"
            />
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-4 pb-12">
          <div className="mt-6 rounded-[32px] bg-white shadow-lg border border-slate-100">
            <div className="px-6 py-6 md:px-10 md:py-8">
            
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
               
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
                    {companyName}
                  </h1>

                  {fromCityFilter && toCityFilter && (
                    <p className="mt-1 text-xs text-slate-500">
                      {fromCityFilter} {"->"} {toCityFilter} | {dateFilter}
                    </p>
                  )}
                </div>
              </div>

              <section className="mt-12">
                <h2 className="text-xs font-semibold tracking-[0.18em] uppercase text-slate-500">
                  Detail Rute
                </h2>

                <div className="mt-4">
                  <div className="relative h-24 md:h-28">
                    <div className="absolute left-0 right-0 top-1/2 h-1 -translate-y-1/2 bg-slate-900 rounded-full" />

                    <div className="relative flex justify-between items-start">
                      {/* titik awal */}
                      <div className="flex flex-col items-center text-center text-[11px] text-slate-500">
                        <div className="mt-6 border-t border-slate-200" />
                        <div className="w-4 h-4 rounded-full border-2 border-slate-900 bg-[#f38f4a]" /><br/>
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
                      <div className="flex flex-col items-center text-center text-[11px] text-slate-500">
                        <div className="mt-6 border-t border-slate-200" />
                        <div className="w-4 h-4 rounded-full border-2 border-slate-900 bg-[#f38f4a]" /><br/>
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
                <h2 className="text-xs font-semibold tracking-[0.18em] uppercase text-slate-500">
                  Penilaian dan Ulasan
                </h2>

                <div className="mt-4 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                  <div className="flex flex-col items-center md:items-start">
                    <p className="text-4xl font-bold text-slate-900">
                      {ratingScore}
                    </p>
                    <div className="mt-1 flex gap-1 text-[#FFB547]">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <FaStar key={i} />
                      ))}
                    </div>
                    <p className="mt-1 text-xs text-slate-500">
                      {ratingTotal.toLocaleString()} ulasan
                    </p>
                  </div>

                  <div className="flex-1">
                    <p className="text-sm font-semibold text-slate-900 mb-2">
                      Review Ulasan
                    </p>
                    <div className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm text-slate-700">
                      "Bus nyaman, sopir ramah, dan tepat waktu. Sangat
                      direkomendasikan untuk perjalanan ini."
                    </div>
                  </div>
                </div>
              </section>

              {/* GARIS PEMISAH */}
              <div className="mt-6 border-t border-slate-200" />

              {/* KEBIJAKAN + BUTTON */}
              <section className="mt-6">
                <h2 className="text-xs font-semibold tracking-[0.18em] uppercase text-slate-500">
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
                  <button className="inline-flex items-center justify-center rounded-full bg-[#E5533D] px-10 py-3 text-sm font-semibold text-white shadow-md hover:bg-[#cf4230] transition-colors">
                    Mulai Pembayaran
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
