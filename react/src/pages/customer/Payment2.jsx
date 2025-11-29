import { useState, useEffect } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";

import Navbar from "../../components/default/Navbar";
import Footer from "../../components/default/Footer";
import BusLoader from "../../components/default/BusLoader.jsx";

import kursiIcon from "../../assets/logoKursi.jpg";
import header from "../../assets/busHeader.jpeg";

import {
  getPembayaranById,
  updatePembayaranStatus,
} from "../../api/apiPembayaran.jsx";
import { getPemesananById } from "../../api/apiPemesanan.jsx";
import { getTiketById } from "../../api/apiTiket.jsx";
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

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
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
      <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
        <Navbar />
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
        <Navbar />
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

      // kirim id_tiket + kode_tiket (dari pemesanan) + id_pembayaran ke Payment3
      const ticketCode = pemesanan.kode_tiket || "";

      navigate(
        `/ereceipt/${tiket.id_tiket}?payment=${pembayaran.id_pembayaran}&code=${encodeURIComponent(
          ticketCode
        )}`
      );
    } catch (err) {
      console.error(err);
      toast.error("Gagal mengubah status pembayaran");
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
                className={`w-8 h-8 flex items-center justify-center rounded-full border-2 ${idx === 2
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

      <div className="w-[90%] md:w-[80%] mx-auto bg-white p-6 rounded-xl shadow mt-6">
        {/* Info tiket / rute */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 border-b pb-6">
          <div>
            <p className="text-sm font-semibold">{departureCity}</p>
            <p className="text-sm font-semibold">{departureTerminal}</p>
            <p className="text-gray-600 text-sm">{departureTime}</p>
          </div>

          <div className="text-center text-blue-950 font-extrabold">
            <p>{companyName}</p>
            <p className="text-4xl text-orange-600">→</p>
          </div>

          <div className="text-right">
            <p className="text-sm font-semibold">{arrivalCity}</p>
            <p className="text-sm font-semibold">{arrivalTerminal}</p>
            <p className="text-gray-600 text-sm">{arrivalTime}</p>
          </div>
        </div>

        {/* Seat */}
        <button className="grid grid-cols-2 border border-gray-400 rounded-lg px-3 py-1 text-sm font-medium mb-6">
          <img src={kursiIcon} alt="kursi" className="w-5 h-5" />
          {jumlahKursi} Kursi
        </button>

        {/* Rincian pembayaran */}
        <div className="bg-gray-50 rounded-2xl shadow-md p-6 md:p-8">
          <p className="font-semibold mb-2">
            {isBank
              ? "Rincian Pembayaran Transfer"
              : "Rincian Pembayaran Wallet"}
          </p>
          <p className="text-gray-500 text-sm mb-4">{channelLabel}</p>

          <div className="flex justify-between mb-4">
            <div>
              <p className="text-gray-500 text-sm">
                {isBank
                  ? "Kode pembayaran rekening virtual"
                  : "Kode pembayaran"}
              </p>
              <p className="font-mono font-semibold text-lg">
                {virtualAccount}
              </p>
            </div>
            <div className="text-right">
              <p className="text-gray-500 text-sm">Jumlah untuk dibayar</p>
              <p className="font-semibold text-lg">
                Rp {totalBayar.toLocaleString("id-ID")}
              </p>
            </div>
          </div>

          <p className="text-gray-600 text-sm">
            Waktu verifikasi pembayaran dibutuhkan hingga 15 menit.
          </p>
          <p className="text-gray-400 text-xs">
            Setelah terkonfirmasi, E-ticket akan otomatis dikirim via SMS &
            E-mail.
          </p>
        </div>

        <button
          className="w-full bg-orange-500 text-white py-1 
                     rounded-xl mt-6 font-semibold text-xl
                     hover:bg-[#cf4230] transition-colors"
          onClick={handleSubmit}
        >
          Saya telah menyelesaikan pembayaran
        </button>

        <p className="text-center text-gray-500 text-xs mt-2">
          Tekan tombol ini setelah anda menyelesaikan pembayaran
        </p>
      </div>

      <Footer />
    </div>
  );
}

export default Payment2;
