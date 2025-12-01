import { useEffect, useState } from "react";
import { getAllPembayaran } from "../../api/apiPembayaran";

import Footer from "../../components/default/Footer";
import Navbar from "../../components/default/Navbar";
import BusLoader from "../../components/default/BusLoader.jsx";

function History(){
    const [historyOrders, setHistoryOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const formatTanggalJam = (datetime) => {
        if(!datetime) return { tanggal: "-", jam: "--:--"};
        const d = new Date(datetime);
        if(Number.isNaN(d.getTime())) return { tanggal: "-", jam: "--:--"};

        const tanggal = d.toLocaleDateString("id-ID", {
            weekday: "short",
            day: "2-digit",
            month: "short",
        });
        const jam = d.toLocaleDateString("id-ID", {
            hour: "2-digit",
            minute: "2-digit",
        });
        return { tanggal, jam};
    };

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const data = await getAllPembayaran();
                console.log("DATA HISTORY ASLI:", data);
                console.log("CEK STRUKTUR ITEM:", JSON.stringify(data[0], null, 2));
                setHistoryOrders(data);
            } catch (error) {
                console.error("Error fetching history:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, []);

    if (loading) {
        return (
        <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
            <Navbar />
            <main className="flex-1 flex items-center justify-center">
            <BusLoader message="Memuat Riwayat Pemesanan Anda..." />
            </main>
            <Footer />
        </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 fint-sans">
            <Navbar />

            <section className="max-w-6xl mx-auto px-4 py-10">
                <h1 className="text-xl font-bold mb-6">Riwayat Pemesanan</h1>

                {historyOrders.length === 0 ? (
                    <p className="text-gray-600 text-sm">Belum ada riwayat pemesanan.</p>
                ) : (
                    <div className="space-y-6">
                        {historyOrders.map((item) => {
                            const pemesanan = item.pemesanan || {};
                            const tiket = pemesanan?.rincianPemesanan?.[0]?.tiket || {};
                            const rute = tiket.rute || {};

                            const departureTime = tiket.waktu_keberangkatan?.substring(11, 16) || "--:--";
                            const arrivalTime = tiket.waktu_tiba?.substring(11, 16) || "--:--";

                            const { tanggal: tglBerangkat } = formatTanggalJam(tiket.waktu_keberangkatan);
                            const { tanggal: tglTiba } = formatTanggalJam(tiket.waktu_tiba);

                            return (
                                <div
                                    key={item.id_pembayaran}
                                    className="bg-white rounded-2xl shadow p-6"
                                >
                                {/* Jadwal */}
                                <div className="grid grid-cols-3 gap-6 items-start">
                                    <div>
                                        <p className="text-xs uppercase text-slate-500">
                                            Berangkat
                                        </p>
                                        <p className="font-bold">{rute.asal?.kota || "-"}</p>
                                        <p className="text-sm text-slate-600">
                                            {rute.asal?.terminal || "-"}
                                        </p>
                                        <p className="mt-1 text-sm font-semibold text-slate-900">
                                            {tglBerangkat} • {departureTime}
                                        </p>
                                        
                                    </div>

                                    <div className="flex flex-col items-center justify-center text-xs text-slate-500">
                                        <span className="mb-2">{tiket.company?.nama_company || "Nama Perusahaan"}</span>
                                        <span className="text-3xl text-orange-500">
                                            →
                                        </span>
                                    </div>

                                    <div className="text-right">
                                        <p className="text-xs uppercase text-slate-500">
                                            Tiba
                                        </p>
                                        <p className="font-bold">{rute.tujuan?.kota || "-"}</p>
                                        <p className="text-sm text-slate-600">
                                            {rute.tujuan?.terminal || "-"}
                                        </p>
                                        <p className="mt-1 text-sm font-semibold text-slate-900">
                                            {tglTiba} • {arrivalTime}
                                        </p>
                                    </div>
                                </div>

                                <hr className="my-4 border-dashed border-slate-200" />

                                {/* Detail lainnya */}
                                <div className="flex flex-col md:flex-row justify-between text-sm">
                                    <p>
                                        Total Pembayaran:{" "}
                                        <span className="font-semibold text-orange-600">
                                            Rp {" "}
                                            {pemesanan?.total_biaya_pemesanan
                                                ? Number(pemesanan.total_biaya_pemesanan).toLocaleString("id-ID")
                                                : "0"}
                                        </span>
                                    </p>
                                    <p>
                                        <span className="font-medium">Metode Pembayaran:</span>{" "}
                                            {item.metode_pembayaran}
                                    </p>
                                    <p>
                                        <span
                                            className={`px-3 py-1 rounded-xl text-sm font-semibold
                                            ${
                                                item.status_pembayaran == "1"
                                                ? "bg-green-100 text-green-700 border border-green-400"
                                                : "bg-yellow-100 text-yellow-700 border border-yellow-400"
                                            }`}
                                        >
                                            {item.status_pembayaran == "1" ? "Lunas" : "Menunggu Pembayaran"}
                                        </span>
                                    </p>
                                </div>

                                <div className="mt-4 flex gap-3">
                                    <button
                                        onClick={() =>
                                            navigate(
                                                `/eticket/${item.id_pemesanan}`
                                            )
                                        }
                                        className="border rounded-lg px-4 py-2 text-sm hover:bg-gray-50"
                                    >
                                        E-Ticket
                                    </button>
                                    <button className="border rounded-lg px-4 py-2 text-sm hover:bg-gray-50">
                                        Invoice
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                    </div>
                )}
            </section>

            <Footer />
        </div>
    );
}

export default History;
