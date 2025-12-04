import { useState, useEffect } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";

import Footer from "../../../components/default/Footer";
import header from "../../../assets/busHeader.jpeg";
import BusLoader from "../../../components/default/BusLoader.jsx";

import { getTiketById } from "../../../api/customer/apiTiket.jsx";
import { createReview } from "../../../api/customer/apiReview.jsx";
import { toast } from "react-toastify";

function Payment3() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();

  const id_pembayaran = searchParams.get("payment") || null;
  const kodeTiketQuery = searchParams.get("code") || "";

  const [tiket, setTiket] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  //Agar tidak bisa menekan tombol back browser & backspace 
  useEffect(() => {
    window.history.pushState({ lockedPayment3: true }, "", window.location.href);

    const handlePopState = () => {
      toast.error(
        "Tidak bisa kembali ke halaman sebelumnya setelah E-Ticket diterbitkan."
      );
      window.history.pushState(
        { lockedPayment3: true },
        "",
        window.location.href
      );
    };

    const handleKeyDown = (e) => {
      if (
        e.key === "Backspace" &&
        (e.target === document.body || e.target === document.documentElement)
      ) {
        e.preventDefault();
        toast.error(
          "Tidak bisa kembali ke halaman sebelumnya setelah E-Ticket diterbitkan."
        );
      }
    };

    window.addEventListener("popstate", handlePopState);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

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

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#F5F5F7] font-sans">
        <main className="flex-1 flex items-center justify-center">
          <BusLoader message="Memuat pembayaran..." />
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col bg-[#F5F5F7] font-sans">
        <main className="flex-1 flex items-center justify-center">
          <p className="text-sm text-red-500">{error}</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (!tiket) {
    return (
      <div className="min-h-screen flex flex-col bg-[#F5F5F7] font-sans">
        <main className="flex-1 flex items-center justify-center">
          <p className="text-sm text-slate-600">Tiket tidak ditemukan.</p>
        </main>
        <Footer />
      </div>
    );
  }

  // pengisian data 
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

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
      <section className="max-w-5xl mx-auto px-4 pt-6 w-full">
        <div className="rounded-3xl overflow-hidden shadow-md">
          <img
            src={header}
            alt={companyName}
            className="w-full h-36 md:h-44 lg:h-52 object-cover opacity-70"
          />
        </div>
      </section>

      <section className="max-w-4xl mx-auto w-full px-4 mt-8">
        <div className="bg-white rounded-2xl shadow-md px-4 py-6 md:px-8 md:py-8">
          <h1 className="text-xl md:text-2xl font-semibold text-slate-900 mb-4">
            {companyName}
          </h1>

          <div className="flex flex-wrap items-center gap-4 justify-start md:justify-center mb-2">
            {["Pesan", "Review", "Bayar", "E-Ticket"].map((label, idx) => (
              <div
                key={label}
                className="flex items-center gap-2 text-xs md:text-sm font-medium"
              >
                <div
                  className={`w-7 h-7 md:w-8 md:h-8 flex items-center justify-center rounded-full border-2 ${
                    idx === 3
                      ? "bg-orange-500 border-orange-500 text-white"
                      : "border-slate-300 text-slate-500"
                  }`}
                >
                  {idx + 1}
                </div>
                <span
                  className={
                    idx === 3 ? "text-slate-900" : "text-slate-500"
                  }
                >
                  {label}
                </span>
                {idx < 3 && (
                  <div className="hidden md:block w-12 md:w-16 h-px bg-slate-200 mx-1" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="w-[92%] md:w-[80%] max-w-4xl mx-auto bg-white p-5 md:p-8 rounded-xl shadow mt-6 mb-10">
        {/* Ringkasan perjalanan */}
        <div className="mt-2 bg-gray-50 rounded-2xl shadow-md p-5 md:p-7">
          <p className="text-base md:text-lg font-bold mb-4">
            Pembayaran Berhasil!
          </p>

          <div className="flex flex-col md:flex-row justify-between items-center w-full gap-4">
            <div className="text-left">
              <p className="text-sm font-bold">
                {departureDate} - {departureTime}
              </p>
              <p className="text-gray-600 text-xs md:text-sm">
                {departureCity} - {departureTerminal}
              </p>
            </div>

            <div className="text-center mx-4 shrink-0">
              <p className="text-blue-950 font-extrabold text-xs md:text-sm">
                {companyName}
              </p>
              <p className="text-3xl md:text-4xl text-orange-600 font-extrabold">
                →
              </p>
            </div>

            <div className="text-right">
              <p className="text-sm font-bold">
                {arrivalDate} - {arrivalTime}
              </p>
              <p className="text-gray-600 text-xs md:text-sm">
                {arrivalCity} - {arrivalTerminal}
              </p>
            </div>
          </div>
        </div>

        {/* Kode E-Ticket (tanpa barcode) */}
        <div className="mt-6 bg-gray-50 rounded-2xl p-4 md:p-5 text-center shadow-sm">
          <p className="text-sm text-slate-600">
            E-Ticket akan segera dikirimkan ke Email Anda
          </p>
          <p className="mt-1 text-[11px] md:text-xs text-slate-400">
            Simpan E-ticket dan jangan dibagikan ke orang lain.
          </p>
        </div>

          {/* Tombol kirim review */}
          <button
            type="submit"
            className="w-full bg-orange-500 text-white py-2 rounded-xl 
                       font-semibold text-sm md:text-base hover:bg-[#cf4230] transition-colors
                       disabled:opacity-60 disabled:cursor-not-allowed"
            onClick={() => navigate("/")}
          >
            Kembali ke Beranda
          </button>
      </section>

      <Footer />
    </div>
  );
}

export default Payment3;
