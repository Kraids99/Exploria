import { useState } from "react";
import { useLocation } from "react-router-dom";
import { formatTanggalIndonesia } from "../components/DateFormatter";
import { formatKota } from "../components/CityFormatter";
import Footer from "../components/landingpage/Footer";
import Navbar from "../components/landingpage/Navbar";


function Payment(){
    const { search } = useLocation();
    const queryParams = new URLSearchParams(search);

    const fromCity = queryParams.get("from");
    const toCity = queryParams.get("to");
    const date = query = queryParams.get("date");

    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            <Navbar />

            {/*Hero*/}
            <div className="w-full h-64 md:h-80 overflow-hidden">
                <img 
                    src="/assets/payment.jpg"
                    alt="Sinar Jaya"
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Content Section */}
            <div className="max-w-5xl mx-auto px-4 py-10">
                <h1 className="text-xl font-bold mb-6">Sinar Jaya</h1>

                <div className="flex justify-between max-w-md mx-auto mb-10">
                    {["pesan", "Review", "Bayar", "E-Ticket"].map((step, index)=>(
                        <div key={index} className="flex flex-col items-center">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white
                                    ${index === 2 ? "bg-blue-600" : "bg-gray-400"}`}
                            >
                                {index + 1}
                            </div>
                            <p className="mt-2 text-sm">{step}</p>
                        </div>
                    ))}
                </div>
                
                {/* Ticket Detail */}
                <div className="bg-white rounded-2xl shadow-md p-6 md:p-8">
                    <h2 className="text-lg font-semibold mb-4">BAYAR</h2>

                    {/* Ticket Info */}
                    <div className="flex flex-col md:flex-row justify-between items-center mb-6 border-b pb-6">
                        <div>
                            <p className="text-sm font-medium">{formatTanggalIndonesia(date)}</p>
                            <p className="text-gray-600 text-sm">{formatKota(fromCity)}</p>
                        </div>

                        <div className="text-center text-blue-600 font-semibold">
                            <p>Sinar Jaya</p>
                            <p className="text-2xl">→</p>
                        </div>

                        <div className="text-right">
                            <p className="text-sm font-medium">{formatTanggalIndonesia(date)}</p>
                            <p className="text-gray-600 text-sm">{formatKota(toCity)}</p>
                        </div>
                    </div>

                    {/* Seat Info */}
                    <button classname="border border-gray-400 rounded-lg px-3 py-1 text-sm font-medium mb-6">
                        1 Kursi
                    </button>

                    {/* Payment Option VA*/}
                    <p className="text-sm font-semibold mb-2">Virtual Account Transfer</p>
                    <p className="text-xs text-gray-500 mb-4">
                        Anda bisa membayar dengan transfer melalui ATM, internet banking & mobile banking
                    </p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        {["BCA", "BNI", "BRI", "Mandiri"].map((bank)=>(
                            <div key={bank}
                                 className="brder rounded-lg p-3 text-center shadow-sm hover:shadow-md transition"
                            >
                                <img 
                                    src={`/images/bank-${bank.toLowerCase()}.png`}
                                    alt={bank}
                                    clasName="h-6 mx-auto mb-2"
                                />
                                <p className="text-sm">{bank}</p>
                            </div>
                        ))}
                    </div>

                    {/* Wallets */}
                    <p className="text-sm font-semibold mb-4">Wallets</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        {["Dana", "ShopeePay", "OVO", "GoPay"].map((wallet)=>(
                            <div key={wallet}
                                 className="brder rounded-lg p-3 text-center shadow-sm hover:shadow-md transition"
                            >
                                <img 
                                    src={`/images/wallet-${wallet.toLowerCase()}.png`}
                                    alt={wallet}
                                    clasName="h-6 mx-auto mb-2"
                                />
                                <p className="text-sm">{wallet}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    )
}

export default Payment;

// function Payment() {
//   const { search } = useLocation();
//   const queryParams = new URLSearchParams(search);

//   const fromCity = queryParams.get("from");
//   const toCity = queryParams.get("to");
//   const date = queryParams.get("date");

//   return (
//     <div className="p-6 bg-white rounded-xl shadow-md w-full max-w-3xl mx-auto">
//       <h2 className="text-xl font-bold mb-4">Detail Perjalanan</h2>

//       <div className="space-y-2">
//         <p>
//           <span className="text-gray-500 text-sm">Kota Asal:</span>
//           <span className="font-semibold"> {formatKota(fromCity)}</span>
//         </p>
//         <p>
//           <span className="text-gray-500 text-sm">Kota Tujuan:</span>
//           <span className="font-semibold"> {formatKota(toCity)}</span>
//         </p>
//         <p>
//           <span className="text-gray-500 text-sm">Tanggal Berangkat:</span>
//           <span className="font-semibold"> {formatTanggalIndonesia(date)}</span>
//         </p>
//       </div>
//     </div>
//   );
// }