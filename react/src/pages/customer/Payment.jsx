import { useState } from "react";
import { useLocation } from "react-router-dom";
// import { formatTanggalIndonesia } from "../../components/DateFormatter";
// import { formatKota } from "../../components/CityFormatter";
import Navbar from "../../components/default/Navbar"; 
import Footer from "../../components/default/Footer";
import kursiIcon from "../../assets/logoKursi.jpg";
import paymentImg from "../../assets/payment.jpg"; 

function Payment(){
    const { search } = useLocation();
    const queryParams = new URLSearchParams(search);

    const fromCity = queryParams.get("from");
    const toCity = queryParams.get("to");
    const date = queryParams.get("date");

    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            <Navbar />

            {/*Hero*/}
            <div className="w-full flex justify-center mt-4">
                <div className="w-[90%] md:w-[80%] rounded-xl overflow-hidden shadow-lg border bg-white">
                    <img 
                        src={paymentImg}
                        alt="Sinar Jaya"
                        className="w-full max-h-32 md:max-h-40 object-cover object-center"
                    />
                </div>
            </div>
                
            {/* Content Section */}
            <div className="max-w-5xl mx-auto px-4 py-10">
                <h1 className="text-xl font-bold mb-6 mx-6">Sinar Jaya</h1>

                {/* <div className="flex justify-between max-w-md mx-auto mb-10">
                    {["Pesan", "Review", "Bayar", "E-Ticket"].map((step, index)=>(
                        <div key={index} className="flex flex-col items-center">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-orange-600
                                    ${index === 2 ? "bg-black" : "bg-gray-300"}`}
                            >
                                {index + 1}
                            </div>
                            <p className="mt-2 text-sm font-semibold">{step}</p>
                        </div>
                    ))}
                </div> */}
                
                {/* Ticket Detail */}
                <div className="bg-white rounded-2xl shadow-md p-6 md:p-8">
                    <h2 className="text-lg font-bold mb-4">BAYAR</h2>

                    {/* Ticket Info */}
                    <div className="flex flex-col md:flex-row justify-between items-center mb-6 border-b pb-6">
                        <div>
                            <p className="text-sm font-semibold">{formatTanggalIndonesia(date)}</p>
                            <p className="text-gray-600 text-sm">{formatKota(fromCity)}</p>
                        </div>

                        <div className="text-center text-blue-950 font-extrabold">
                            <p>Sinar Jaya</p>
                            <p className="text-4xl text-orange-600">→</p>
                        </div>

                        <div className="text-right">
                            <p className="text-sm font-semibold">{formatTanggalIndonesia(date)}</p>
                            <p className="text-gray-600 text-sm">{formatKota(toCity)}</p>
                        </div>
                    </div>

                    {/* Seat Info */}
                    <button className="border grid grid-cols-2 border-gray-400 rounded-lg px-3 py-1 text-sm font-medium mb-6">
                        <img 
                            src={kursiIcon} 
                            alt="kursi" 
                            className="h-5 w-5 object-contain"
                        />
                        1 Kursi
                    </button>

                    {/* Payment Option VA*/}
                    <p className="text-sm font-bold mb-2">Virtual Account Transfer</p>
                    <p className="text-xs text-gray-500 mb-3">
                        Anda bisa membayar dengan transfer melalui ATM, internet banking & mobile banking
                    </p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        {["BCA", "BNI", "BRI", "Mandiri"].map((bank)=>(
                            <div key={bank}
                                 className="border rounded-lg px-4 py-2 flex items-center gap-3 shadow-sm hover:shadow-md transition"
                            >
                                <img 
                                    src={`src/assets/bank/bank-${bank.toLowerCase()}.png`}
                                    alt={bank}
                                    className="h-8 w-8 object-contain"
                                />

                                <p className="text-sm font-semibold">{bank}</p>
                            </div>
                        ))}
                    </div>

                    {/* Wallets
                    <p className="text-sm font-semibold mb-4">Wallets</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        {["Dana", "ShopeePay", "OVO", "GoPay"].map((wallet)=>(
                            <div key={wallet}
                                 className="border rounded-lg px-4 py-2 flex items-center gap-3 shadow-sm hover:shadow-md transition"
                            >
                                <img 
                                    src={`src/assets/wallets/wallet-${wallet.toLowerCase()}.png`}
                                    alt={wallet}
                                    className="h-8 w-8 object-contain"
                                />

                                <p className="text-sm font-semibold">{wallet}</p>
                            </div>
                        ))}
                    </div> */}
                </div>
            </div>

            <Footer />
        </div>
    )
}

export default Payment;
