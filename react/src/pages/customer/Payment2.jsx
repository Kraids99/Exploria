import { useState, useEffect } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";

import Navbar from "../../components/default/Navbar"; 
import Footer from "../../components/default/Footer";

import kursiIcon from "../../assets/logoKursi.jpg";
import header from "../../assets/busHeader.jpeg";
import { getTiketByParams } from "../../api/apiTiket.jsx"; 

function Payment2() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const fromCityFilter = searchParams.get("from") || "";
  const toCityFilter = searchParams.get("to") || "";
  const dateFilter = searchParams.get("date") || "";

  const channel = searchParams.get("channel") || "";
  const type = searchParams.get("type") || "";

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
        console.log("payment2 getTiketByParams =", data);

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
      <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-sm text-slate-600">Memuat data pembayaran…</p>
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

  if (!tiket) {
    return (
      <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
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

  const harga = tiket.harga ? Number(tiket.harga) : 0;
  const isBank = type === "bank";
  const channelLabel = isBank ? `Bank ${channel}` : channel || "-";

  const virtualAccount = "456789215678902151"; // dummy

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate(
      `/ereceipt/${tiket.id_tiket}?from=${fromCityFilter}&to=${toCityFilter}&date=${dateFilter}`
    );
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

      <div className="w-[90%] md:w-[80%] mx-auto bg-white p-6 rounded-xl shadow mt-6">
        {/* Info tiket */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 border-b pb-6">
          <div>
            <p className="text-sm font-bold">{departureCity}</p>
            <p className="text-sm font-semibold">{departureTerminal}</p>
            <p className="text-gray-600 text-sm">{departureTime}</p>
          </div>

          <div className="text-center text-blue-950 font-extrabold">
            <p>{companyName}</p>
            <p className="text-4xl text-orange-600">→</p>
          </div>

          <div className="text-right">
            <p className="text-sm font-bold">{arrivalCity}</p>
            <p className="text-sm font-semibold">{arrivalTerminal}</p>
            <p className="text-gray-600 text-sm">{arrivalTime}</p>
          </div>
        </div>

        {/* Seat */}
        <button className="grid grid-cols-2 border border-gray-400 rounded-lg px-3 py-1 text-sm font-medium mb-6">
          <img src={kursiIcon} alt="kursi" className="w-5 h-5" />
          1 Kursi
        </button>

        {/* Rincian pembayaran */}
        <div className="bg-gray-50 rounded-2xl shadow-md p-6 md:p-8">
          <p className="font-semibold mb-2">
            {isBank ? "Rincian Pembayaran Transfer" : "Rincian Pembayaran Wallet"}
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
                Rp {harga.toLocaleString("id-ID")}
              </p>
            </div>
          </div>

          <p className="text-gray-600 text-sm">
            Waktu verifikasi pembayaran dibutuhkan hingga 15 menit
          </p>
          <p className="text-gray-400 text-xs">
            Setelah terkonfirmasi, E-ticket akan otomatis dikirim via SMS & E-mail
          </p>
        </div>

        {/* Cara membayar */}
        <div className="mt-6 bg-gray-50 rounded-2xl shadow-md p-6 md:p-8">
          <p className="font-semibold mb-3">
            Cara membayar dengan {isBank ? `bank ${channel}` : channel}?
          </p>

          {isBank ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-700">
              <div>
                <p className="font-semibold mb-1">ATM {channel}</p>
                <ol className="list-decimal ml-4 space-y-1 border-r pr-3">
                  <li>Masukkan kartu ATM Anda.</li>
                  <li>Pilih menu Transaksi Lainnya.</li>
                  <li>Pilih menu Transfer.</li>
                  <li>Pilih Virtual Account {channel}.</li>
                  <li>Masukkan nomor Virtual Account.</li>
                  <li>Ikuti instruksi selanjutnya hingga selesai.</li>
                </ol>
              </div>

              <div>
                <p className="font-semibold mb-1">m-Banking</p>
                <ol className="list-decimal ml-4 space-y-1 border-r pr-3">
                  <li>Login ke aplikasi m-Banking.</li>
                  <li>Pilih menu Transfer / VA.</li>
                  <li>Masukkan nomor Virtual Account.</li>
                  <li>Masukkan jumlah pembayaran.</li>
                  <li>Konfirmasi dan selesaikan pembayaran.</li>
                </ol>
              </div>

              <div>
                <p className="font-semibold mb-1">Internet Banking</p>
                <ol className="list-decimal ml-4 space-y-1">
                  <li>Login ke Internet Banking.</li>
                  <li>Pilih menu Pembayaran &gt; Virtual Account.</li>
                  <li>Masukkan nomor VA dan jumlah.</li>
                  <li>Periksa detail, lalu konfirmasi.</li>
                </ol>
              </div>
            </div>
          ) : (
            <div className="text-sm text-gray-700 space-y-1">
              <p>1. Buka aplikasi {channel} di ponsel Anda.</p>
              <p>2. Pilih menu Bayar / Scan / Transfer.</p>
              <p>3. Masukkan kode pembayaran atau scan QR yang diberikan.</p>
              <p>4. Pastikan jumlah pembayaran sudah sesuai.</p>
              <p>5. Konfirmasi dan selesaikan pembayaran.</p>
            </div>
          )}
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
