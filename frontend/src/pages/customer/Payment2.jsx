import { useState, useEffect } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";

import Footer from "../../components/default/Footer";
import kursiIcon from "../../assets/logoKursi.jpg";
import header from "../../assets/busHeader.jpeg";

import {
  getPembayaranById,
  updatePembayaranStatus,
} from "../../api/customer/apiPembayaran.jsx";
import { fetchPemesananById } from "../../api/customer/apiPemesanan.jsx";
import { getTiketById } from "../../api/customer/apiTiket.jsx";
import { toast } from "react-toastify";

// helper: bikin VA random
const generateVirtualAccount = () => {
  const prefix = "777";
  let digits = "";
  for (let i = 0; i < 13; i++) {
    digits += Math.floor(Math.random() * 10);
  }
  return prefix + digits;
};

function Payment2() {
  const { id_pembayaran } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const fromCityFilter = searchParams.get("from") || "";
  const toCityFilter = searchParams.get("to") || "";
  const dateFilter = searchParams.get("date") || "";

  const urlChannel = searchParams.get("channel") || "";
  const urlType = searchParams.get("type") || "";

  const [pembayaran, setPembayaran] = useState(null);
  const [pemesanan, setPemesanan] = useState(null);
  const [tiket, setTiket] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [randomVA] = useState(() => generateVirtualAccount());

  // 🔒 Kunci tombol back browser & backspace (kayak di halaman Payment)
  useEffect(() => {
    // dorong state dummy supaya pointer history ada di sini
    window.history.pushState({ lockedPayment2: true }, "", window.location.href);

    const handlePopState = () => {
      // kalau user klik panah back browser
      toast.error(
        "Tidak bisa kembali ke halaman sebelumnya saat proses pembayaran."
      );
      // dorong lagi state yang sama supaya tetap di halaman ini
      window.history.pushState(
        { lockedPayment2: true },
        "",
        window.location.href
      );
    };

    const handleKeyDown = (e) => {
      // kalau user tekan Backspace saat fokus bukan di input/textarea
      if (
        e.key === "Backspace" &&
        (e.target === document.body || e.target === document.documentElement)
      ) {
        e.preventDefault();
        toast.error(
          "Tidak bisa kembali ke halaman sebelumnya saat proses pembayaran."
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

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        setError("");

        // 1. pembayaran
        const dataPay = await getPembayaranById(id_pembayaran);
        console.log("payment2 getPembayaranById =", dataPay);
        const pay = dataPay?.data ?? dataPay;
        setPembayaran(pay);

        // 2. pemesanan
        const dataPem = await getPemesananById(pay.id_pemesanan);
        console.log("payment2 getPemesananById =", dataPem);
        const pem = dataPem?.data ?? dataPem;
        setPemesanan(pem);

        // 3. tiket
        let ticketObj =
          pem.tiket || pem.tiket_data || pem.tiket_relasi || null;

        const rincianList =
          pem.rincianPemesanan ||
          pem.rincian_pemesanans ||
          pem.rincian_pemesanan ||
          [];

        const firstRincian = rincianList[0];

        if (!ticketObj) {
          if (firstRincian?.tiket) {
            ticketObj = firstRincian.tiket;
          } else if (firstRincian?.id_tiket) {
            const tiketRes = await getTiketById(firstRincian.id_tiket);
            ticketObj = tiketRes?.data ?? tiketRes;
          }
        }

        setTiket(ticketObj || null);
      } catch (err) {
        console.log(err);
        setError("Gagal mengambil detail pembayaran");
      } finally {
        setLoading(false);
      }
    };

    if (id_pembayaran) {
      fetchDetail();
    } else {
      setError("ID pembayaran tidak ditemukan di URL.");
    }
  }, [id_pembayaran]);

  // ----- STATE VIEW (tanpa Navbar) -----
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
        <main className="flex-1 flex items-center justify-center">
          <p className="text-sm text-slate-600">Memuat detail pembayaran...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
        <main className="flex-1 flex items-center justify-center">
          <p className="text-sm text-red-500">{error}</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (!pembayaran || !pemesanan || !tiket) {
    return (
      <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
        <main className="flex-1 flex items-center justify-center">
          <p className="text-sm text-slate-600">
            Data pembayaran / pemesanan tidak lengkap.
          </p>
        </main>
        <Footer />
      </div>
    );
  }

  // ---------- mapping data ----------
  const companyName = tiket.company?.nama_company || "Nama Perusahaan";

  const departureTime =
    tiket.waktu_keberangkatan?.substring(11, 16) || "--:--";
  const arrivalTime = tiket.waktu_tiba?.substring(11, 16) || "--:--";

  const departureCity = tiket.rute?.asal?.kota || "-";
  const departureTerminal = tiket.rute?.asal?.terminal || "-";

  const arrivalCity = tiket.rute?.tujuan?.kota || "-";
  const arrivalTerminal = tiket.rute?.tujuan?.terminal || "-";

  const rincianList =
    pemesanan.rincianPemesanan ||
    pemesanan.rincian_pemesanans ||
    pemesanan.rincian_pemesanan ||
    [];
  const rincian = rincianList[0] || {};

  const jumlahKursi =
    rincian.jumlah_tiket ?? pemesanan.jumlah_tiket ?? 1;

  const totalBayar =
    pemesanan.total_biaya_pemesanan ??
    pembayaran.total_bayar ??
    0;

  const metode = pembayaran.metode_pembayaran || urlChannel || "";
  const jenisChannel = pembayaran.jenis_channel || urlType || "";
  const isBank = jenisChannel === "bank";

  const channelLabel = isBank ? `Bank ${metode}` : metode || "-";

  const virtualAccount =
    pembayaran.kode_virtual ||
    pembayaran.nomor_va ||
    pembayaran.virtual_account ||
    randomVA;

  // submit "saya sudah bayar"
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updatePembayaranStatus(pembayaran.id_pembayaran, 1);
      toast.success("Pembayaran dikonfirmasi");

      const ticketCode = pemesanan.kode_tiket || "";

      navigate(
        `/ereceipt/${tiket.id_tiket}?payment=${pembayaran.id_pembayaran}&code=${encodeURIComponent(
          ticketCode
        )}&from=${fromCityFilter}&to=${toCityFilter}&date=${dateFilter}`
      );
    } catch (err) {
      console.error(err);
      toast.error("Gagal mengubah status pembayaran");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
      {/* HEADER IMAGE */}
      <section className="max-w-5xl mx-auto px-4 pt-6 w-full">
        <div className="rounded-3xl overflow-hidden shadow-md">
          <img
            src={header}
            alt={companyName}
            className="w-full h-36 md:h-44 lg:h-52 object-cover opacity-70"
          />
        </div>
      </section>

      {/* STEP INDICATOR */}
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
                    idx === 2
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
                  <div className="hidden md:block w-12 md:w-16 h-px bg-slate-200 mx-1" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MAIN PAYMENT CARD */}
      <section className="w-[92%] md:w-[80%] max-w-4xl mx-auto bg-white p-5 md:p-8 rounded-xl shadow mt-6 mb-10">
        {/* Info tiket / rute */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 border-b pb-6 gap-4">
          <div className="text-left">
            <p className="text-sm font-semibold">{departureCity}</p>
            <p className="text-sm font-semibold">{departureTerminal}</p>
            <p className="text-gray-600 text-sm">{departureTime}</p>
          </div>

          <div className="text-center text-blue-950 font-extrabold">
            <p className="text-xs md:text-sm">{companyName}</p>
            <p className="text-3xl md:text-4xl text-orange-600">→</p>
          </div>

          <div className="text-right">
            <p className="text-sm font-semibold">{arrivalCity}</p>
            <p className="text-sm font-semibold">{arrivalTerminal}</p>
            <p className="text-gray-600 text-sm">{arrivalTime}</p>
          </div>
        </div>

        {/* Seat */}
        <button className="inline-flex items-center gap-2 border border-gray-400 rounded-lg px-3 py-1 text-xs md:text-sm font-medium mb-6">
          <img src={kursiIcon} alt="kursi" className="w-5 h-5" />
          {jumlahKursi} Kursi
        </button>

        {/* Rincian pembayaran */}
        <div className="bg-gray-50 rounded-2xl shadow-md p-5 md:p-7">
          <p className="font-semibold mb-2 text-sm md:text-base">
            {isBank
              ? "Rincian Pembayaran Transfer"
              : "Rincian Pembayaran Wallet"}
          </p>
          <p className="text-gray-500 text-xs md:text-sm mb-4">
            {channelLabel}
          </p>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
            <div>
              <p className="text-gray-500 text-xs md:text-sm">
                {isBank
                  ? "Kode pembayaran rekening virtual"
                  : "Kode pembayaran"}
              </p>
              <p className="font-mono font-semibold text-lg md:text-xl break-all">
                {virtualAccount}
              </p>
            </div>
            <div className="text-left md:text-right">
              <p className="text-gray-500 text-xs md:text-sm">
                Jumlah untuk dibayar
              </p>
              <p className="font-semibold text-lg md:text-xl">
                Rp {totalBayar.toLocaleString("id-ID")}
              </p>
            </div>
          </div>

          <p className="text-gray-600 text-xs md:text-sm">
            Waktu verifikasi pembayaran dibutuhkan hingga 15 menit.
          </p>
          <p className="text-gray-400 text-[11px] md:text-xs mt-1">
            Setelah terkonfirmasi, E-ticket akan otomatis dikirim via SMS &
            E-mail.
          </p>
        </div>

        <button
          className="w-full bg-orange-500 text-white py-3 
                     rounded-full mt-6 font-semibold text-sm md:text-base
                     hover:bg-[#cf4230] transition-colors"
          onClick={handleSubmit}
        >
          Saya telah menyelesaikan pembayaran
        </button>

        <p className="text-center text-gray-500 text-[11px] md:text-xs mt-2">
          Tekan tombol ini setelah anda menyelesaikan pembayaran
        </p>
      </section>

      <Footer />
    </div>
  );
}

export default Payment2;
