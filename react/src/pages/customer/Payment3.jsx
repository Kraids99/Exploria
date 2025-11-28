import { useState, useEffect } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";

import Navbar from "../../components/default/Navbar"; 
import Footer from "../../components/default/Footer";
import header from "../../assets/busHeader.jpeg";
import { getTiketByParams } from "../../api/apiTiket.jsx"; 
 

function Payment3() {
  const navigate = useNavigate();
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

  // state loading / error
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#F5F5F7]">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-sm text-slate-600">Memuat detail pemesanan…</p>
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

      {/* KONTEN */}
      <div className="w-[90%] md:w-[80%] mx-auto bg-white p-6 rounded-xl shadow mt-6">
        <div className="mt-2 bg-gray-50 rounded-2xl shadow-md p-6 md:p-8">
          <p className="text-lg font-bold mb-4">Pembayaran Berhasil!</p>

          <div className="flex justify-between items-center w-full">
            <div className="text-left">
              <p className="text-sm font-bold">
                {dateFilter} - {departureTime}
              </p>
              <p className="text-gray-600 text-sm">
                {departureCity} - {departureTerminal}
              </p>
            </div>

            <div className="text-center mx-4 flex-shrink-0">
              <p className="text-blue-950 font-extrabold text-sm">
                {companyName}
              </p>
              <p className="text-4xl text-orange-600 font-extrabold">→</p>
            </div>

            <div className="text-right">
              <p className="text-sm font-bold">
                {dateFilter} - {arrivalTime}
              </p>
              <p className="text-gray-600 text-sm">
                {arrivalCity} - {arrivalTerminal}
              </p>
            </div>
          </div>
        </div>

        {/* RATING */}
        <p className="text-center text-black text-3xl mt-12 mb-2">
          Bagaimana Pengalaman Anda?
        </p>

        <p className="text-center text-gray-500 text-xs">
          Berikan rating dan ulasan terkait dengan layanan kami
        </p>

        <div className="flex justify-center my-4">
          <span className="text-3xl text-yellow-500">⭐️⭐️⭐️⭐️⭐️</span>
        </div>

        <button
          className="w-full bg-orange-500 text-white py-1 rounded-xl mt-6 font-semibold text-[15px]
                     hover:bg-[#cf4230] transition-colors"
          onClick={() => navigate("/")}
        >
          Kembali ke Beranda
        </button>
      </div>

      <Footer />
    </div>
  );
}

export default Payment3;
