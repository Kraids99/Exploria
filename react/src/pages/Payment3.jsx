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

                <div className="mt-6 border bg-gray-50 rounded-2xl shadow-md p-6 md:p-8">
                    <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                        
                        <div className="flex-shrink-0">
                            <img 
                                src={barcodeImg}
                                alt="barcode"
                                className="w-32 h-32 md:w-40 md:h-40 object-contain" 
                            />
                        </div>

                        {/* Tiket Info */}
                        <div className="flex-grow items-end">
                            <h3 className="text-xl font-bold mb-4">Dont Forget!</h3>

                            <div className="flex justify-between items-center w-full">
                                <div className="text-left">
                                    <p className="text-sm font-bold">{formatTanggalIndonesia(date)}</p>
                                    <p className="text-gray-600 text-sm">{formatKota(fromCity)}</p>
                                </div>

                                <div className="text-center mx-4 flex-shrink-0">
                                    <p className="text-blue-950 font-extrabold text-sm">Sinar Jaya</p>
                                    <p className="text-4xl text-orange-600 font-extrabold">→</p>
                                </div>

                                <div className="text-right">
                                    <p className="text-sm font-bold">{formatTanggalIndonesia(date)}</p>
                                    <p className="text-gray-600 text-sm">{formatKota(toCity)}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Tombol Download E-Ticket */}
                    <button className="w-120 border-orange-500 border text-black py-3 rounded-xl mx-40 font-bold text-xl">
                        Download E-Ticket
                    </button>
                </div>

                <p className="text-center text-black text-3xl mt-12 mb-2">
                    Bagaimana Pengalaman Anda?
                </p>

                <p className="text-center text-gray-500 text-xs">
                    Berikan rating dan ulasan terkait dengan layanan kami
                </p>
                
                <div className="flex justify-center my-4">
                    <span className="text-3xl text-yellow-500">⭐️⭐️⭐️⭐️⭐️</span>
                </div>

                <button className="w-full bg-orange-500 text-white py-3 rounded-xl mt-6 font-semibold text-xl">
                    Kembali ke Beranda
                </button>

            </div>

            <Footer />
        </div>
    );
}

export default Payment3;