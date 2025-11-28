import { useEffect, useState } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";

import Navbar from "../../components/default/Navbar"; 
import Footer from "../../components/default/Footer";
import kursiIcon from "../../assets/logoKursi.jpg";
import header from "../../assets/busHeader.jpeg";
import { getTiketByParams } from "../../api/apiTiket.jsx"; 

import bankBCA from "../../assets/bank/bank-bca.png";
import bankBNI from "../../assets/bank/bank-bni.png";
import bankBRI from "../../assets/bank/bank-bri.png";
import bankMandiri from "../../assets/bank/bank-mandiri.png";

import walletDana from "../../assets/wallets/wallet-dana.png";
import walletShopee from "../../assets/wallets/wallet-shopeepay.png";
import walletOVO from "../../assets/wallets/wallet-ovo.png";
import walletGopay from "../../assets/wallets/wallet-gopay.png";


function Payment() {
  const { id } = useParams();               
  const [searchParams] = useSearchParams(); 

  const fromCityFilter = searchParams.get("from") || "";
  const toCityFilter   = searchParams.get("to")   || "";
  const dateFilter     = searchParams.get("date") || "";

  const [tiket, setTiket] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate(); 

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
        console.log("payment getTiketByParams =", data);

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

  const harga = tiket.harga ? Number(tiket.harga) : 0; 

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

  const handleSelectChannel = (channelId, channelType) => {
    navigate(
         `/payment/${tiket.id_tiket}?from=${fromCityFilter}&to=${toCityFilter}&date=${dateFilter}&channel=${channelId}&type=${channelType}`
    )
  }
  


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

      {/* KONTEN PAYMENT */}
      <div className="max-w-5xl mx-auto px-4 py-10">
        <h1 className="text-xl font-bold mb-6 mx-6">{companyName}</h1>

        <div className="bg-white rounded-2xl shadow-md p-6 md:p-8">
          <h2 className="text-lg font-bold mb-4">BAYAR</h2>

          
          <div className="flex flex-col md:flex-row justify-between items-center mb-6 border-b pb-6">
            <div>
              <p className="text-sm font-semibold">{departureCity}</p>
              <p className="text-sm font-semibold">{departureTerminal}</p>
              <p className="text-gray-600 text-sm">{departureTime}</p>
            </div>

            <div className="text-center text-blue-950 font-extrabold">
              <p>{companyName}</p>
              <p className="text-4xl text-orange-600">→</p>

              <div className="rounded-full  bg-amber-200 py-2">
                <p className="text-xs text-orange-600 mt-">
                    Rp {harga.toLocaleString("id-ID")}
                </p>
              </div>
            </div>

            <div className="text-right">
              <p className="text-sm font-semibold">{arrivalCity}</p>
              <p className="text-sm font-semibold">{arrivalTerminal}</p>
              <p className="text-gray-600 text-sm">{arrivalTime}</p>
            </div>
          </div>

          <button className="border grid grid-cols-2 border-gray-400 rounded-lg px-3 py-1 text-sm font-medium mb-6">
            <img
              src={kursiIcon}
              alt="kursi"
              className="h-5 w-5 object-contain"
            />
            1 Kursi
          </button>

          <p className="text-sm font-bold mb-2">Virtual Account Transfer</p>
          <p className="text-xs text-gray-500 mb-3">
            Anda bisa membayar dengan transfer melalui ATM, internet banking & mobile banking
          </p>

          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {bankOptions.map((bank) => (
              <button
                key={bank.id}
                type="button"
                onClick={() => handleSelectChannel(bank.id, "bank")}
                className="border rounded-lg px-4 py-2 flex items-center gap-3 shadow-sm hover:shadow-md transition bg-white"
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

          <p className="text-sm font-semibold mb-4">Wallets</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {walletOptions.map((wallet) => (
              <button
                key={wallet.id}
                type="button"
                onClick={() => handleSelectChannel(bank.id, "bank")}
                className="border rounded-lg px-4 py-2 flex items-center gap-3 shadow-sm hover:shadow-md transition bg-white"
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
