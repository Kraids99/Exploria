import { useState } from "react";
import { useLocation } from "react-router-dom";
import { formatTanggalIndonesia } from "../components/DateFormatter";
import { formatKota } from "../components/CityFormatter";
import Footer from "../components/landingpage/Footer";
import Navbar from "../components/landingpage/Navbar";
import paymentImg from "../assets/payment.jpg";
import barcodeImg from "../assets/barcode.jpeg";
 

function Payment3() {
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

                {/* Barcode */}
                <div className=" mt-6 grid grid-cols-2 border bg-gray-50 rounded-2xl shadow-md p-6 md:p-8 text-2xl">
                    <img 
                        src={barcodeImg}
                        alt="barcode"
                        className="w-50 h-50"
                    />
                    Dont Forget!

                    {/* Ticket Info */}
                    <div className="flex flex-col md:flex-row justify-between items-center mb-6 pb-6">
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

                    <button className="border-orange-500 border text-black py-3 rounded-xl mt-6 font-bold text-xl">
                        Download E-Ticket
                    </button>
                </div>

                <p className="text-center text-black text-3xl mt-2">
                    Bagaimana Pengalaman Anda?
                </p>

                <p className="text-center text-gray-500 text-xs mt-2">
                    Berikan rating dan ulasan terkait dengan layanan kami
                </p>

                <button className="w-full bg-orange-500 text-white py-3 rounded-xl mt-6 font-semibold text-xl">
                    Kembali ke Beranda
                </button>

            </div>

            <Footer />
        </div>
    );
}

export default Payment3;
