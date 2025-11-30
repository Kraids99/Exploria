import { useState } from "react";
import Footer from "../../components/default/Footer";
import Navbar from "../../components/default/Navbar";

function History(){
    const historyOrders = [
        {
            id: "PB.307",
            kode: "4BZTNM",
            status: "Selesai",
            tanggal: "20 Dec 2025",
            waktu: "11:30",
            asal: "Palembang Soekarno",
            tujuan: "Magelang Muntilan",
            totalBayar: 647700,
            bus: "Sinar Jaya",
        },
        {
            id: "PB.406",
            kode: "BGH725",
            status: "Dibatalkan",
            tanggal: "12 Nov 2025",
            waktu: "08:00",
            asal: "Bandung Cicaheum",
            tujuan: "Jakarta Kampung Rambutan",
            totalBayar: 420000,
            bus : "Rosalia Indah",
        },
        {
            id: "PB.410",
            kode: "JKL221",
            status: "Check-In Berhasil",
            tanggal: "01 Nov 2025",
            waktu: "07:30",
            asal: "Surabaya Purabaya",
            tujuan: "Yogyakarta Giwangan",
            totalBayar: 550000,
            bus: "Putra Remaja",
        },
    ];

    return (
        <div className="min-h-screen bg-slate-50 fint-sans">
            <Navbar />

            <section className="max-w-6xl mx-auto px-4 py-10">
                <h1 className="text-xl font-bold mb-6">Riwayat Pemesanan</h1>

                {historyOrders.length === 0 ? (
                    <p className="text-gray-600 text-sm">Belum ada riwayat pemesanan.</p>
                ) : (
                    <div className="space-y-6">
                        {historyOrders.map((order) => (
                            <div
                                key={order.id}
                                className="bg-white shadow-sm rounded-2xl p-6 md:p-8"
                            >
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <p className="text-lg font-bold">{order.bus}</p>
                                        <p className="text-sm font-semibold text-gray-600">{order.kode}</p> 
                                    </div>
                                    <button className="text-sm text-blue-600 hover:underline">Lihat Detail</button>
                                </div>

                                <div className="flex flex-col md:flex-row justify-between items-center border-b pb-4">
                                    <div>
                                        <p className="text-sm font-semibold">{order.tanggal} • {order.waktu} </p>
                                        <p className="text-sm">{order.asal}</p>
                                    </div>

                                    <div className="text-center py-2 font-bold text-orange-600 text-4xl">→</div>

                                    <div className="text-right">
                                        <p className="text-sm">{order.tujuan}</p>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center">
                                    <span
                                        className={`text-xs font-semibold px-3 py-1 rounded-full ${
                                            order.status === "Selesai"
                                            ? "bg-green-100 text-green-700"
                                            : order.status === "Dibatalkan"
                                            ?  "bg-red-100 text-red-600" 
                                            : "bg-blue-100 text-blue-600"
                                        }`}
                                    >
                                        {order.status}
                                    </span>

                                    <div className="text-right">
                                        <p className="text-xs text-gray-500">Total Bayar</p>
                                        <p className="text-md font-bold">
                                            RP {order.totalBayar.toLocaleString("id-ID")}
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-4 flex gap-3">
                                    <button className="border border-gray-300 rounded-lg px-4 py-2 text-sm hover:bg-gray-50">
                                        E-Ticket
                                    </button>
                                    <button className="border border-gray-300 rounded-lg px-4 py-2 text-sm hover:bg-gray-50">
                                        Invoice
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            <Footer />
        </div>
    );
}

export default History;