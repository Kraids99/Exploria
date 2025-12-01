import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import Navbar from "../../components/default/Navbar";
import Footer from "../../components/default/Footer";
import BusLoader from "../../components/default/BusLoader.jsx";

import kursiIcon from "../../assets/logoKursi.jpg";
import header from "../../assets/busHeader.jpeg";

import bankBCA from "../../assets/bank/bank-bca.png";
import bankBNI from "../../assets/bank/bank-bni.png";
import bankBRI from "../../assets/bank/bank-bri.png";
import bankMandiri from "../../assets/bank/bank-mandiri.png";

import walletDana from "../../assets/wallets/wallet-dana.png";
import walletShopee from "../../assets/wallets/wallet-shopeepay.png";
import walletOVO from "../../assets/wallets/wallet-ovo.png";
import walletGopay from "../../assets/wallets/wallet-gopay.png";

import { getPemesananById } from "../../api/apiPemesanan.jsx";
import { createPembayaran } from "../../api/apiPembayaran.jsx";
import { toast } from "react-toastify";

function Payment() {
  // sekarang id yang dipakai = id_pemesanan
  const { id_pemesanan } = useParams();
  const navigate = useNavigate();

  const [pemesanan, setPemesanan] = useState(null);
  const [tiket, setTiket] = useState(null); // diambil dari rincian_pemesanans
  const [loading, setLoading] = useState(false);
  const [payLoading, setPayLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        setError("");

        // ambil pemesanan dari backend
        const res = await getPemesananById(id_pemesanan);
        const pem = res?.data ?? res; // jaga2 kalau backend pakai {data: {...}}
        setPemesanan(pem);

        // ambil tiket dari rincian_pemesanans (relasi)
        const rincianList =
          pem.rincianPemesanan || pem.rincian_pemesanans || pem.rincian_pemesanan || [];
        const firstRincian = rincianList[0];

        // kalau eager-loaded tiket di backend, pakai langsung
        if (firstRincian?.tiket) {
          setTiket(firstRincian.tiket);
        } else if (firstRincian) {
          // kalau belum include tiket, minimal masih bisa ambil beberapa info
          setTiket({
            id_tiket: firstRincian.id_tiket,
          });
        }
      } catch (err) {
        console.log(err);
        setError("Gagal mengambil detail pemesanan");
      } finally {
        setLoading(false);
      }
    };

    if (id_pemesanan) {
      fetchDetail();
    } else {
      setError("ID pemesanan tidak ditemukan di URL.");
    }
  }, [id_pemesanan]);

  // state loading / error
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

  if (!pemesanan || !tiket) {
    return (
      <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-sm text-slate-600">Data pemesanan tidak lengkap.</p>
        </main>
        <Footer />
      </div>
    );
  }

  const formatTanggalJam = (datetime) => {
        if (!datetime) return { tanggal: "-", jam: "--:--" };
        const d = new Date(datetime);
        if (Number.isNaN(d.getTime())) return { tanggal: "-", jam: "--:--" };

        const tanggal = d.toLocaleDateString("id-ID", {
            weekday: "short",
            day: "2-digit",
            month: "short",
        }); // "Min, 24 Feb"
        const jam = d.toLocaleTimeString("id-ID", {
            hour: "2-digit",
            minute: "2-digit",
        });
        return { tanggal, jam };
    };
  
  // ----- mapping data -----
  const companyName = tiket.company?.nama_company || "Nama Perusahaan";
  const busName = tiket.nama_tiket || "Nama Bus";

  const departureTime =
    tiket.waktu_keberangkatan?.substring(11, 16) || "--:--";
  const arrivalTime = tiket.waktu_tiba?.substring(11, 16) || "--:--";

  const departureCity = tiket.rute?.asal?.kota || "-";
  const departureTerminal = tiket.rute?.asal?.terminal || "-";

  const arrivalCity = tiket.rute?.tujuan?.kota || "-";
  const arrivalTerminal = tiket.rute?.tujuan?.terminal || "-";

  const { tanggal: tglBerangkat, jam: jamBerangkat } = formatTanggalJam(
      tiket?.waktu_keberangkatan
  );
  const { tanggal: tglTiba, jam: jamTiba } = formatTanggalJam(
      tiket?.waktu_tiba
  );
  
  const harga = tiket.harga ? Number(tiket.harga) : 0;
  const rincianList =
    pemesanan.rincianPemesanan || pemesanan.rincian_pemesanans || pemesanan.rincian_pemesanan || [];
  const rincian = rincianList[0] || {};
  const jumlahKursi = rincian.jumlah_tiket || 0;

  const totalBayar =
    pemesanan.total_biaya_pemesanan ??
    (jumlahKursi && harga ? jumlahKursi * harga : 0);

  // opsi channel
  const bankOptions = [
    { id: "BCA", name: "BCA", logo: bankBCA },
    { id: "BNI", name: "BNI", logo: bankBNI },
    { id: "BRI", name: "BRI", logo: bankBRI },
    { id: "Mandiri", name: "Mandiri", logo: bankMandiri },
  ];

  const walletOptions = [
    { id: "Dana", name: "Dana", logo: walletDana },
    { id: "ShopeePay", name: "ShopeePay", logo: walletShopee },
    { id: "OVO", name: "OVO", logo: walletOVO },
    { id: "GoPay", name: "GoPay", logo: walletGopay },
  ];

  const handleSelectChannel = async (channelId, channelType) => {
    if (!pemesanan) return;

    try {
      setPayLoading(true);

      const payload = {
        id_pemesanan: pemesanan.id_pemesanan,
        metode_pembayaran: channelId,  // silakan sesuaikan nama field di backend
        jenis_channel: channelType,
      };


      const res = await createPembayaran(payload);
      const pembayaran = res?.data ?? res;

      toast.success("Pembayaran berhasil dibuat, lanjut ke instruksi pembayaran");

      // setelah create pembayaran, arahkan ke halaman instruksi / detail pembayaran
      // sesuaikan path kalau kamu pakai route lain
      // setelah createPembayaran(...)
      navigate(
        `/payment/${pembayaran.id_pembayaran}?channel=${channelId}&type=${channelType}`
      );

    } catch (err) {
      console.error(err);
      const msg =
        typeof err?.message === "string"
          ? err.message
          : "Gagal membuat pembayaran";
      toast.error(msg);
    } finally {
      setPayLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Navbar />

      {/* Header bus */}
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
                  idx === 1 ? "text-slate-900" : "text-slate-500"
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


      {/* KONTEN PAYMENT */}
      <div className="max-w-5xl mx-auto px-4 py-10 mb-10">

        <div className="bg-white rounded-2xl shadow-md p-6 md:p-8 mb-70">
          <h2 className="text-xl font-semibold mb-4">PEMBAYARAN</h2>

          {/* ringkasan perjalanan */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-6 border-b pb-6">
            <div>
              <p className="text-xs uppercase text-slate-500">Berangkat</p>
              <p className="text-sm font-semibold">{departureCity}</p>
              <p className="text-sm font-semibold">{departureTerminal}</p>
              <p className="text-gray-600 text-sm">{tglBerangkat} • {departureTime}</p>
            </div>

            <div className="text-center text-blue-950 font-bold">
              <p>{companyName}</p>
              <p className="text-3xl text-orange-600">→</p>

              <div className="rounded-full border border-4 border-amber-200 py-2 px-4 mt-1">
                <p className="text-xs text-orange-600">
                  Rp {totalBayar.toLocaleString("id-ID")}
                </p>
              </div>
            </div>

            <div className="text-right">
              <p className="text-xs uppercase text-slate-500">Tiba</p>
              <p className="text-sm font-semibold">{arrivalCity}</p>
              <p className="text-sm font-semibold">{arrivalTerminal}</p>
              <p className="text-gray-600 text-sm">{tglTiba} • {arrivalTime}</p>
            </div>
          </div>

          {/* jumlah kursi */}
          <div className="mb-6">
            <button className="border inline-flex items-center gap-2 border-gray-400 rounded-lg px-3 py-1 text-sm font-medium">
              <img
                src={kursiIcon}
                alt="kursi"
                className="h-5 w-5 object-contain"
              />
              {jumlahKursi} Kursi
            </button>
          </div>

          {/* info VA */}
          <p className="text-sm font-bold mb-2">Virtual Account Transfer</p>
          <p className="text-xs text-gray-500 mb-3">
            Anda bisa membayar dengan transfer melalui ATM, internet banking &
            mobile banking.
          </p>

          {/* Bank list */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {bankOptions.map((bank) => (
              <button
                key={bank.id}
                type="button"
                disabled={payLoading}
                onClick={() => handleSelectChannel(bank.id, "bank")}
                className="border rounded-lg px-4 py-2 flex items-center gap-3 shadow-sm hover:shadow-md transition bg-white disabled:opacity-60"
              >
                <img
                  src={bank.logo}
                  alt={bank.name}
                  className="h-8 w-8 object-contain"
                />
                <p className="text-sm font-semibold">{bank.name}</p>
              </button>
            ))}
          </div>

          {/* Wallets */}
          <p className="text-sm font-semibold mb-4">Wallets</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-2">
            {walletOptions.map((wallet) => (
              <button
                key={wallet.id}
                type="button"
                disabled={payLoading}
                // FIX: pakai wallet.id & type "wallet"
                onClick={() => handleSelectChannel(wallet.id, "wallet")}
                className="border rounded-lg px-4 py-2 flex items-center gap-3 shadow-sm hover:shadow-md transition bg-white disabled:opacity-60"
              >
                <img
                  src={wallet.logo}
                  alt={wallet.name}
                  className="h-8 w-8 object-contain"
                />
                <p className="text-sm font-semibold">{wallet.name}</p>
              </button>
            ))}
          </div>

        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Payment;
