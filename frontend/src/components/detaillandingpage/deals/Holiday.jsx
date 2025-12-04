import Navbar from "../../default/Navbar";
import Footer from "../../default/Footer";

import imgHoliday from "../../../assets/Holiday.jpg";
import bis1 from "../../../assets/bus/Bis1.jpg";
import bis2 from "../../../assets/bus/Bis2.jpg";
import bis3 from "../../../assets/bus/Bis3.jpg";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function Holiday() {
    const navigate = useNavigate();

    const handleBack = () => {
        navigate(-1);
    };
    const busHoliday = [
        {
            name: "Sinar Jaya",
            terminal: "Terminal Mengwi",
            location: "Yogyakarta",
            phone: "0812-3344-5566",
            open: "05.00 – 22.00 WITA",
            harga: "3 tiket gratis 1",
            image: bis1,
        },
        {
            name: "Lorena",
            terminal: "Terminal Ubung",
            location: "Yogyakarta",
            phone: "0813-9988-2211",
            open: "06.00 – 21.00 WITA",
            harga: "3 tiket gratis 1",
            image: bis2,
        },
        {
            name: "Gunung Harta",
            terminal: "Terminal Batubulan",
            location: "Yogyakarta",
            phone: "0811-7777-909",
            open: "24 Jam",
            harga: "3 tiket gratis 1",
            image: bis3,
        },
    ];

    return (
        <div className="min-h-screen flex flex-col bg-slate-50">
            <Navbar />

            <main className="flex-1 pb-10">
                <section className="w-full flex justify-center mt-6 px-4">
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

                    <div className="relative w-full max-w-5xl">
                        <img
                            src={imgHoliday}
                            alt="Holiday"
                            className="
                w-full 
                h-48 sm:h-60 md:h-72 lg:h-80
                object-cover 
                rounded-2xl shadow-lg brightness-75
              "
                        />
                        <div className="absolute bottom-4 left-4 sm:left-8 text-white max-w-xl">
                            <h2 className="text-2xl sm:text-3xl font-bold">
                                Liburan Bersama Keluarga
                            </h2>
                            <p className="text-sm sm:text-base mt-1">
                                Beli 3 tiket gratis 1, cocok untuk liburan akhir pekan bersama keluarga
                            </p>
                        </div>
                    </div>
                </section>

                {/* DESKRIPSI */}
                <section className="mt-6 px-4">
                    <div className="max-w-3xl mx-auto">
                        <p className="text-sm sm:text-base text-blue-950 leading-relaxed">
                            Asik liburan bersama keluarga dengan promo tiket gratis satu.
                            Buruan cek bus kesukaanmu di bawah ini!
                        </p>
                    </div>
                </section>

                <section className="mt-8 px-4">
                    <div className="w-full max-w-6xl mx-auto">
                        <h2 className="text-lg sm:text-xl font-semibold mb-4">
                            Bus dengan Promo Liburan
                        </h2>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                            {busHoliday.map((bus) => (
                                <div
                                    key={bus.name}
                                    className="w-full rounded-xl shadow-sm bg-white hover:shadow-md transition overflow-hidden"
                                >
                                    <div className="w-full h-32 sm:h-36 bg-gray-200">
                                        <img
                                            src={bus.image}
                                            alt={bus.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>

                                    {/* CONTENT */}
                                    <div className="p-4">
                                        <h3 className="font-bold text-base mb-1">{bus.name}</h3>

                                        <p className="text-base font-semibold text-orange-600 mb-1">
                                            {bus.harga}
                                        </p>

                                        <p className="text-sm text-gray-700">
                                            <span className="font-medium">Terminal:</span>{" "}
                                            {bus.terminal}
                                        </p>

                                        <p className="text-sm text-gray-700">
                                            <span className="font-medium">Lokasi:</span>{" "}
                                            {bus.location}
                                        </p>

                                        <p className="text-sm text-gray-700">
                                            <span className="font-medium">No HP:</span>{" "}
                                            {bus.phone}
                                        </p>

                                        <p className="text-sm text-gray-700">
                                            <span className="font-medium">Jam Operasional:</span>{" "}
                                            {bus.open}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}

export default Holiday;
