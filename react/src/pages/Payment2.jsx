import { useState } from "react";
import { useLocation } from "react-router-dom";
import { formatTanggalIndonesia } from "../components/DateFormatter";
import { formatKota } from "../components/CityFormatter";
import Footer from "../components/landingpage/Footer";
import Navbar from "../components/landingpage/Navbar";
import kursiIcon from "../assets/logoKursi.jpg";
import paymentImg from "../assets/payment.jpg"; 

function Payment2() {
    const { search } = useLocation();
    const queryParams = new URLSearchParams(search);

    const fromCity = queryParams.get("from");
    const toCity = queryParams.get("to");
    const date = queryParams.get("date");

    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            <Navbar />

            {/* HERO */}
            <div className="w-full flex justify-center mt-4">
                <div className="w-[90%] md:w-[80%] rounded-xl overflow-hidden shadow-lg border bg-white">
                    <img 
                        src={paymentImg}
                        alt="Sinar Jaya"
                        className="w-full max-h-32 md:max-h-40 object-cover object-center"
                    />
                </div>
            </div>

            {/* CONTAINER */}
            <div className="w-[90%] md:w-[80%] mx-auto bg-white p-6 rounded-xl shadow mt-6">

                {/* Ticket Info */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-6 border-b pb-6">
                    <div>
                        <p className="text-sm font-bold">{formatTanggalIndonesia(date)}</p>
                        <p className="text-gray-600 text-sm">{formatKota(fromCity)}</p>
                    </div>

                    <div className="text-center text-blue-950 font-extrabold">
                        <p>Sinar Jaya</p>
                        <p className="text-4xl text-orange-600">→</p>
                    </div>

                    <div className="text-right">
                        <p className="text-sm font-bold">{formatTanggalIndonesia(date)}</p>
                        <p className="text-gray-600 text-sm">{formatKota(toCity)}</p>
                    </div>
                </div>

                {/* Seat Info */}
                    <button className="grid grid-cols-2 border border-gray-400 rounded-lg px-3 py-1 text-sm font-medium mb-6">
                        <img 
                            src={kursiIcon} 
                            alt="kursi" 
                            className="w-5 h-5
                            "
                        />
                        1 Kursi
                    </button>

                {/* Rincian Pembayaran */}
                <div className="bg-gray-50 rounded-2xl shadow-md p-6 md:p-8">
                    <p className="font-semibold mb-2">Rincian Pembayaran Transfer</p>
                    <p className="text-gray-500 text-sm mb-4">BCA</p>

                    <div className="flex justify-between mb-4">
                        <div>
                            <p className="text-gray-500 text-sm">Kode pembayaran rekening virtual</p>
                            <p className="font-mono font-semibold text-lg">456789215678902151</p>
                        </div>
                        <div className="text-right">
                            <p className="text-gray-500 text-sm">Jumlah untuk dibayar</p>
                            <p className="font-semibold text-lg">Rp 360.000</p>
                        </div>
                    </div>

                    <p className="text-gray-600 text-sm">
                        Waktu verifikasi pembayaran dibutuhkan hingga 15 menit
                    </p>
                    <p className="text-gray-400 text-xs">
                        Setelah terkonfirmasi, E-ticket akan otomatis dikirim via SMS & E-mail
                    </p>
                </div>

                {/* Cara Membayar */}
                <div className=" mt-6 bg-gray-50 rounded-2xl shadow-md p-6 md:p-8">
                    <p className="font-semibold mb-3">Cara membayar dengan bank BCA ?</p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-700">

                        <div>
                            <p className="font-semibold mb-1">ATM BCA</p>
                            <ol className="list-decimal ml-4 space-y-1">
                                <li>Insert kartu ATM Anda.</li>
                                <li>Pilih Transaksi Lainnya.</li>
                                <li>Pilih Transfer.</li>
                                <li>Pilih BCA Virtual Account.</li>
                                <li>Masukkan nomor VA.</li>
                                <li>Ikuti instruksi selanjutnya.</li>
                            </ol>
                        </div>

                        <div>
                            <p className="font-semibold mb-1">m-BCA</p>
                            <ol className="list-decimal ml-4 space-y-1">
                                <li>Login ke m-Banking.</li>
                                <li>Pilih m-Transfer.</li>
                                <li>Masukkan nomor Virtual Account.</li>
                                <li>Masukkan jumlah.</li>
                                <li>Konfirmasi pembayaran.</li>
                            </ol>
                        </div>

                        <div>
                            <p className="font-semibold mb-1">Mobile Banking</p>
                            <ol className="list-decimal ml-4 space-y-1">
                                <li>Masuk ke aplikasi.</li>
                                <li>Pilih Transfer.</li>
                                <li>Pilih Virtual Account.</li>
                                <li>Masukkan kode VA.</li>
                                <li>Konfirmasi pembayaran.</li>
                            </ol>
                        </div>

                    </div>
                </div>

                <button className="w-full bg-orange-500 text-white py-3 rounded-xl mt-6 font-semibold text-xl">
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
