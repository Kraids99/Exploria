// src/pages/customer/Pemesanan.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import Navbar from "../../../components/default/Navbar";
import Footer from "../../../components/default/Footer";
import BusLoader from "../../../components/default/BusLoader";

import { getTiketById, getKursiByTiket } from "../../../api/customer/apiTiket";
import { createPemesanan } from "../../../api/customer/apiPemesanan";

import { toast } from "react-toastify";
import header from "../../../assets/busHeader.jpeg";
import { FaArrowLeft } from "react-icons/fa";

export default function Pemesanan() {
  const { id_tiket } = useParams();
  const navigate = useNavigate();

  const [detailTiket, setDetailTiket] = useState(null);
  const [kursi, setKursi] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // cuma buat cek login, id_user diambil dari localStorage (backup ke id biasa)
  const storedUser = localStorage.getItem("user");
  const parsedUser = storedUser ? JSON.parse(storedUser) : null;
  const userId = parsedUser
    ? parsedUser.id_user ?? parsedUser.id ?? null
    : null;
  console.log("user from localStorage:", parsedUser, "userId:", userId);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tiketDetail, kursiList] = await Promise.all([
          getTiketById(id_tiket),
          getKursiByTiket(id_tiket),
        ]);

        // tiketDetail bisa {data: {...}} atau langsung object
        const tiketObj = tiketDetail?.data ?? tiketDetail;
        setDetailTiket(tiketObj || null);

        // kursiList bisa {data: [...]} atau langsung array
        const kursiArr = Array.isArray(kursiList)
          ? kursiList
          : Array.isArray(kursiList?.data)
          ? kursiList.data
          : [];
        setKursi(kursiArr);
      } catch (error) {
        console.error(error);
        toast.error("Gagal mengambil data tiket / kursi");
      } finally {
        setLoading(false);
      }
    };

    if (id_tiket) fetchData();
  }, [id_tiket]);

  const handleSeatClick = (seat) => {
    if (!seat) return;
    const isBooked = seat.status_kursi === true;
    if (isBooked) return;

    setSelectedSeats((prev) => {
      const already = prev.find((s) => s.id_kursi === seat.id_kursi);
      if (already) {
        return prev.filter((s) => s.id_kursi !== seat.id_kursi);
      }
      return [...prev, seat];
    });
  };

  const handleSubmit = async () => {
    if (!detailTiket) return;

    if (!userId) {
      toast.error("Silakan login terlebih dahulu.");
      return;
    }
    const kursiIds = selectedSeats.map((s) => s.id_kursi);

    const payload = {
      id_tiket: detailTiket.id_tiket,
      kursi_ids: kursiIds,
      // id_user tidak perlu, diambil dari token (auth:sanctum)
    };

    try {
      setSubmitting(true);
      const res = await createPemesanan(payload);
      const pemesanan = res?.data ?? res;

      toast.success("Pemesanan berhasil dibuat");
      navigate(`/reviewPesanan/${pemesanan.id_pemesanan}`);
    } catch (error) {
      console.error(error);
      toast.error("Gagal membuat pemesanan");
    } finally {
      setSubmitting(false);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  // ================== STATE LOADING / ERROR (RESPONSIF) ==================
  if (loading) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen flex items-center justify-center bg-gray-50 pl-14 md:pl-0 pt-6 md:pt-24 px-4">
          <BusLoader message="Menyiapkan kursi untukmu..." />
        </main>
        <Footer />
      </>
    );
  }

  if (!detailTiket) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen flex items-center justify-center bg-gray-50 pl-14 md:pl-0 pt-6 md:pt-24 px-4">
          <p className="text-sm text-slate-600 text-center">
            Tiket tidak ditemukan
          </p>
        </main>
        <Footer />
      </>
    );
  }

  const harga = Number(detailTiket.harga || 0);
  const totalBiaya = selectedSeats.length * harga;

  const asal = detailTiket.rute?.asal?.kota ?? "-";
  const asalTerminal = detailTiket.rute?.asal?.terminal ?? "-";
  const tujuan = detailTiket.rute?.tujuan?.kota ?? "-";
  const tujuanTerminal = detailTiket.rute?.tujuan?.terminal ?? "-";
  const companyName = detailTiket.company?.nama_company ?? "-";
  const berangkat =
    detailTiket.waktu_keberangkatan?.substring(11, 16) || "--:--";
  const sampai = detailTiket.waktu_tiba.substring(11, 16) || "--:--";

  // ----- helper untuk layout kursi ala bus -----
  const sortedSeats = [...kursi].sort((a, b) => {
    const rowA = parseInt(a.kode, 10);
    const rowB = parseInt(b.kode, 10);
    const colA = a.kode.slice(-1).toUpperCase();
    const colB = b.kode.slice(-1).toUpperCase();
    if (rowA !== rowB) return rowA - rowB;
    return colA.localeCompare(colB);
  });

  const rowNumbers = Array.from(
    new Set(sortedSeats.map((s) => parseInt(s.kode, 10)))
  ).sort((a, b) => a - b);

  const getSeat = (row, col) =>
    sortedSeats.find(
      (s) => s.kode.toUpperCase() === `${row}${col.toUpperCase()}`
    );

  const renderSeatButton = (seat, fallbackLabel) => {
    if (!seat) {
      // tempat kosong biar layout rapih
      return <div className="w-12 h-10" />;
    }

    // ❗️PAKAI == 1 supaya 1 / "1" / true semua dianggap terisi
    const isBooked = seat.status_kursi == 1 || seat.status_kursi === true;
    const isSelected = selectedSeats.some(
      (s) => s.id_kursi === seat.id_kursi
    );

    const base =
      "w-12 h-10 flex items-center justify-center text-xs font-medium border rounded-md transition";

    // abu-abu = kursi sudah dibeli (tidak bisa dipilih)
    const booked = "bg-gray-300 text-gray-500 cursor-not-allowed";

    // oranye = kursi sedang dipilih user sekarang
    const selected = "bg-orange-500 text-white border-orange-500";

    const available = "bg-white hover:bg-orange-50";

    return (
      <button
        key={seat.id_kursi}
        disabled={isBooked}
        onClick={() => handleSeatClick(seat)}
        className={`${base} ${
          isBooked ? booked : isSelected ? selected : available
        }`}
      >
        {seat.kode || fallbackLabel}
      </button>
    );
  };

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gray-50 pb-16 pl-14 md:pl-0 pt-6 md:pt-24">
        <section className="max-w-6xl mx-auto px-4 space-y-8">
          {/* HEADER + PANAH KEMBALI */}
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

          {/* STEP PROGRESS */}
          <div className="bg-white rounded-2xl shadow px-4 py-4 md:px-6 md:py-5">
            <h1 className="text-xl md:text-2xl font-semibold text-slate-900 mb-4 text-center md:text-left">
              {companyName}
            </h1>
            <div className="flex flex-wrap items-center gap-4 md:gap-6 text-center justify-center">
              {["Pesan", "Review", "Bayar", "E-Ticket"].map((label, idx) => (
                <div
                  key={label}
                  className="flex items-center gap-2 text-xs md:text-sm font-medium"
                >
                  <div
                    className={`w-8 h-8 flex items-center justify-center rounded-full border-2 ${
                      idx === 0
                        ? "bg-orange-500 border-orange-500 text-white"
                        : "border-slate-300 text-slate-500"
                    }`}
                  >
                    {idx + 1}
                  </div>
                  <span
                    className={
                      idx === 0 ? "text-slate-900" : "text-slate-500"
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

          {/* Konten utama: kiri kursi, kanan ringkasan */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* ------- KIRI: layout kursi bus ------- */}
            <section className="bg-white rounded-2xl shadow p-4 md:p-6">
              <h2 className="text-lg font-semibold mb-4 text-center md:text-left">
                Pilih Kursi
              </h2>

              {/* Legend kosong / terisi */}
              <div className="flex flex-wrap items-center justify-center gap-5 mb-6 text-xs text-slate-500">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded border border-slate-300 bg-white" />
                  <span>Kosong</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded bg-orange-500" />
                  <span>Dipilih</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded bg-gray-300" />
                  <span>Sudah Dipesan</span>
                </div>
              </div>

              {/* Body bus (scroll horizontal kalau sempit) */}
              <div className="w-full overflow-x-auto">
                <div className="mx-auto w-fit bg-slate-50 rounded-2xl border border-slate-200 p-6 md:p-10">
                  {/* Sopir di atas */}
                  <div className="flex justify-center mb-5">
                    <div className="px-3 py-1 rounded-md bg-amber-950 text-amber-50 border text-xs font-medium">
                      Sopir
                    </div>
                  </div>

                  <div className="flex gap-6">
                    {/* Kolom kiri A/B */}
                    <div className="flex flex-col gap-3">
                      {rowNumbers.map((row) => (
                        <div
                          key={`left-${row}`}
                          className="grid grid-cols-2 gap-3"
                        >
                          {renderSeatButton(getSeat(row, "A"), `${row}A`)}
                          {renderSeatButton(getSeat(row, "B"), `${row}B`)}
                        </div>
                      ))}
                    </div>

                    {/* Kolom kanan C/D */}
                    <div className="flex flex-col gap-3">
                      {rowNumbers.map((row) => (
                        <div
                          key={`right-${row}`}
                          className="grid grid-cols-2 gap-3"
                        >
                          {renderSeatButton(getSeat(row, "C"), `${row}C`)}
                          {renderSeatButton(getSeat(row, "D"), `${row}D`)}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* ------- KANAN: ringkasan pemesanan ------- */}
            <section className="bg-white rounded-2xl shadow p-4 md:p-6 flex flex-col gap-6">
              <div>
                <h2 className="text-lg font-semibold mb-4 text-center md:text-left">
                  Naik Dari & Turun Di
                </h2>

                <div className="grid grid-cols-3 text-sm mb-4">
                  <div>
                    <p className="text-sm font-semibold">{asal}</p>
                    <p className="text-sm font-semibold">{asalTerminal}</p>
                    <p className="text-gray-600 text-sm">{berangkat}</p>
                  </div>

                  <div className="flex items-center justify-center text-blue-950 font-extrabold">
                    <p className="text-4xl text-orange-600">→</p>
                  </div>

                  <div className="text-right">
                    <p className="text-sm font-semibold">{tujuan}</p>
                    <p className="text-sm font-semibold">
                      {tujuanTerminal}
                    </p>
                    <p className="text-gray-600 text-sm">{sampai}</p>
                  </div>
                </div>

                <hr className="my-4" />

                <div className="text-sm space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-600">
                      Nomor tempat duduk
                    </span>
                    <span className="font-semibold text-slate-900 text-right">
                      {selectedSeats.length > 0
                        ? selectedSeats.map((s) => s.kode).join(", ")
                        : "-"}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-slate-600">Harga per kursi</span>
                    <span className="font-semibold text-slate-900">
                      Rp {harga.toLocaleString("id-ID")}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-slate-600">Total kursi</span>
                    <span className="font-semibold text-slate-900">
                      {selectedSeats.length}
                    </span>
                  </div>

                  <div className="flex justify-between pt-2 border-t mt-2">
                    <span className="text-slate-900 font-semibold">
                      Total pembayaran
                    </span>
                    <span className="text-slate-900 font-semibold">
                      Rp {totalBiaya.toLocaleString("id-ID")}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleSubmit}
                disabled={submitting || selectedSeats.length === 0}
                className="mt-auto w-full py-3 rounded-full bg-orange-500 text-white font-semibold text-sm disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-orange-600 transition"
              >
                {submitting ? "Memproses..." : "Melanjutkan Pemesanan"}
              </button>
            </section>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
