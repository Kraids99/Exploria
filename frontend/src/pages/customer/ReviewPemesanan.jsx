import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import Navbar from "../../components/default/Navbar";
import Footer from "../../components/default/Footer";
import header from "../../assets/busHeader.jpeg";
import kursiIcon from "../../assets/logoKursi.jpg";

import { fetchPemesananById } from "../../api/customer/apiPemesanan";
import { getTiketById } from "../../api/customer/apiTiket";
import { toast } from "react-toastify";
import { FaArrowLeft } from "react-icons/fa";

export default function SelectPayment() {
  const { id_pemesanan } = useParams();
  const navigate = useNavigate();

  const [pemesanan, setPemesanan] = useState(null);
  const [tiket, setTiket] = useState(null);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. ambil pemesanan
        const res = await getPemesananById(id_pemesanan);
        const pem = res?.data ?? res; // jaga2 kalau backend balikin {data: {...}}
        setPemesanan(pem);

        // 2. ambil tiket (kalau belum eager load sampai rute & company)
        const rincianList =
          pem?.rincianPemesanan || pem?.rincian_pemesanan || [];
        const firstRincian = rincianList[0];

        const tiketId =
          firstRincian?.id_tiket || firstRincian?.tiket?.id_tiket || null;

        if (tiketId) {
          const tiketRes = await getTiketById(tiketId);
          const tiketObj = tiketRes?.data ?? tiketRes;
          setTiket(tiketObj);
        }
      } catch (err) {
        console.error(err);
        toast.error("Gagal mengambil data pemesanan");
      } finally {
        setLoading(false);
      }
    };

    if (id_pemesanan) fetchData();
  }, [id_pemesanan]);

  const handleBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen flex items-center justify-center bg-gray-50 pl-14 md:pl-0 pt-6 md:pt-24 px-4">
          Loading...
        </main>
        <Footer />
      </>
    );
  }

  if (!pemesanan) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen flex items-center justify-center bg-gray-50 pl-14 md:pl-0 pt-6 md:pt-24 px-4">
          <p className="text-sm text-slate-600 text-center">
            Pemesanan tidak ditemukan
          </p>
        </main>
        <Footer />
      </>
    );
  }

  const user = pemesanan.user || {};

  const rincianList =
    pemesanan.rincianPemesanan || pemesanan.rincian_pemesanan || [];
  const rincian = rincianList[0] || {};
  const jumlahKursi = rincian.jumlah_tiket || 0;

  const hargaSatuan = tiket?.harga || 0;
  const totalBayar =
    pemesanan.total_biaya_pemesanan ??
    (jumlahKursi && hargaSatuan ? jumlahKursi * hargaSatuan : 0);

  const companyName =
    tiket?.company?.nama_company || tiket?.nama_tiket || "Detail Pemesanan";

  const asal = tiket?.rute?.asal?.kota ?? "-";
  const asalTerminal = tiket?.rute?.asal?.terminal ?? "-";
  const tujuan = tiket?.rute?.tujuan?.kota ?? "-";
  const tujuanTerminal = tiket?.rute?.tujuan?.terminal ?? "-";

  const { tanggal: tglBerangkat, jam: jamBerangkat } = formatTanggalJam(
    tiket?.waktu_keberangkatan
  );
  const { tanggal: tglTiba, jam: jamTiba } = formatTanggalJam(
    tiket?.waktu_tiba
  );

  const handleNext = () => {
    // logic tetap sama, cuma styling yang diubah
    navigate(`/selectpayment/${pemesanan.id_pemesanan}`);
  };

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gray-50 pb-16 pl-14 md:pl-0 pt-6 md:pt-24">
        <section className="max-w-6xl mx-auto px-4 space-y-8">
          {/* Header + panah kembali */}
          <section className="max-w-5xl mx-auto">
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

          {/* Card utama */}
          <div className="bg-white rounded-2xl shadow px-4 py-5 md:px-6 md:py-6">
            {/* Judul + stepper */}
            <h1 className="text-xl md:text-2xl font-semibold text-slate-900 mb-4 text-center md:text-left">
              {companyName}
            </h1>

            <div className="flex flex-wrap items-center gap-4 md:gap-6 justify-center mb-6">
              {["Pesan", "Review", "Bayar", "E-Ticket"].map((label, idx) => (
                <div
                  key={label}
                  className="flex items-center gap-2 text-xs md:text-sm font-medium"
                >
                  <div
                    className={`w-8 h-8 flex items-center justify-center rounded-full border-2 ${
                      idx === 1
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

            {/* Detail pemesanan */}
            <p className="mt-4 text-sm font-semibold text-slate-700">
              DETAIL PEMESANAN
            </p>
            <hr className="mt-2 mb-6 border-dashed border-slate-200" />

            {/* Baris jadwal & terminal */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 items-start">
              {/* Kiri: berangkat */}
              <div className="text-center md:text-left">
                <p className="text-xs uppercase text-slate-500">Berangkat</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">
                  {tglBerangkat}, {jamBerangkat}
                </p>
                <p className="text-sm text-slate-700">{asalTerminal}</p>
              </div>

              {/* Tengah: nama bus + arrow */}
              <div className="flex flex-col items-center justify-center text-xs text-slate-500">
                <span className="mb-2 text-center">{companyName}</span>
                <span className="text-3xl text-orange-500">→</span>
              </div>

              {/* Kanan: tiba */}
              <div className="text-center md:text-right">
                <p className="text-xs uppercase text-slate-500">Tiba</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">
                  {tglTiba}, {jamTiba}
                </p>
                <p className="text-sm text-slate-700">{tujuanTerminal}</p>
              </div>
            </div>

            {/* Badge jumlah kursi */}
            <div className="mt-6">
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
            </div>

            {/* Detail Kontak & Penumpang */}
            <div className="mt-8 grid gap-6 md:gap-8 md:grid-cols-2 text-sm">
              {/* Detail Kontak */}
              <div>
                <h3 className="font-semibold text-slate-900 mb-3">
                  Detail Kontak
                </h3>
                <p className="mb-1">
                  Alamat Email :{" "}
                  <span className="font-medium">{user.email || "-"}</span>
                </p>
                <p>
                  Telepon :{" "}
                  <span className="font-medium">{user.no_telp || "-"}</span>
                </p>
              </div>

              {/* Detail Penumpang */}
              <div>
                <h3 className="font-semibold text-slate-900 mb-3">
                  Detail Penumpang
                </h3>
                <p className="mb-1">
                  Nama :{" "}
                  <span className="font-medium">{user.nama || "-"}</span>
                </p>
                <p className="mb-1">
                  Jenis Kelamin :{" "}
                  <span className="font-medium">
                    {user.jenis_kelamin || "-"}
                  </span>
                </p>
                <p className="mb-1">
                  Jumlah Kursi :{" "}
                  <span className="font-medium">{jumlahKursi}</span>
                </p>
                <p>
                  Total Pembayaran :{" "}
                  <span className="font-semibold">
                    Rp {Number(totalBayar || 0).toLocaleString("id-ID")}
                  </span>
                </p>
              </div>
            </div>

            {/* Tombol lanjut */}
            <div className="mt-10 flex justify-center">
              <button
                onClick={handleNext}
                className="w-full md:w-1/2 py-3 rounded-full bg-orange-500 text-white font-semibold text-sm hover:bg-orange-600 transition"
              >
                Lanjutkan ke Pembayaran
              </button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
