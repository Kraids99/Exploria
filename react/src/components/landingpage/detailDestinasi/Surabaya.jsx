import Navbar from "../../default/Navbar"; 
import Footer from "../../default/Footer";

import imgSurabaya from "../../../assets/destination/surabaya.jpg";
import bis1 from "../../../assets/destination/Bis1.jpg";
import bis2 from "../../../assets/destination/Bis2.jpg";
import bis3 from "../../../assets/destination/Bis3.jpg";
import bis4 from "../../../assets/destination/Bis4.jpg";
import bis5 from "../../../assets/destination/Bis5.jpg";
import bis6 from "../../../assets/destination/Bis6.jpg";

function Surabaya() {
    const busInBali = [
        {
            name: "Sinar Jaya",
            terminal: "Terminal Mengwi",
            location: "Surabaya",
            phone: "0812-3344-5566",
            open: "05.00 – 22.00 WITA",
            image: bis1,
        },
        {
            name: "Lorena",
            terminal: "Terminal Ubung",
            location: "Surabaya",
            phone: "0813-9988-2211",
            open: "06.00 – 21.00 WITA",
            image: bis2,
        },
        {
            name: "Gunung Harta",
            terminal: "Terminal Batubulan",
            location: "Surabaya",
            phone: "0811-7777-909",
            open: "24 Jam",
            image: bis3,
        },
        {
            name: "Air bus",
            terminal: "Terminal Canggu",
            location: "Surabaya",
            phone: "0811-7777-909",
            open: "24 Jam",
            image: bis4,
        },
        {
            name: "Sinar Baru",
            terminal: "Terminal Kuta",
            location: "Surabaya",
            phone: "0812-3344-5566",
            open: "05.00 – 22.00 WITA",
            image: bis5,
        },
        {
            name: "Rosalina",
            terminal: "Terminal Denpasar",
            location: "Surabaya",
            phone: "0812-3344-5566",
            open: "05.00 – 21.00 WITA",
            image: bis6,
        }
    ];

    return (
        <div className="w-full min-h-screen overflow-y-auto pb-20">
            <Navbar />
                <div className="w-full flex justify-center overflow-hidden cursor-pointer relative mt-25">
                    <img
                        src={imgSurabaya}
                        alt="Surabaya"
                        className="w-250 h-100 object-cover rounded-2xl shadow-lg brightness-75"
                    />

                    {/* Overlay Text */}
                    <div className="absolute bottom-4 left-4 text-white">
                        <h2 className="mx-32 text-2xl font-bold">Surabaya</h2>
                        <p className="text-sm mx-32">Wonderfull City of Tourism</p>
                    </div>
                </div>
              
                <div ClassName="px-6 mt-4">
                    <p className=" mx-36 mt-4 text-blue-950 leading-relaxed">
                        Surabaya adalah kota metropolitan terbesar kedua di Indonesia, dikenal dengan
                        sejarah perjuangannya, kuliner khas, dan berbagai tempat ikonik seperti
                        Tugu Pahlawan, Suramadu, dan Taman Bungkul.
                    </p>
                </div>

                <div className="mt-8 w-full flex justify-center px-4">
                    <div className="w-full max-w-5xl">
                        <h2 className="text-xl font-semibold mx-6 mb-4">Terminal di Surabaya</h2>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 place-items-center">
                            {busInBali.map((bus) => (
                                <div
                                    key={bus.name}
                                    className="w-full max-w-[260px] rounded-xl shadow-sm bg-white hover:shadow-md transition overflow-hidden"
                                    >
                                    {/* IMAGE */}
                                    <div className="w-full h-28 bg-gray-200 flex items-center justify-center">
                                        <img
                                            src={bus.image}
                                            alt={bus.name}
                                            className="w-full h-32 object-cover"
                                        />
                                    </div>

                                    {/* CONTENT */}
                                    <div className="p-3">
                                        <h3 className="font-bold text-base mb-1">{bus.name}</h3>

                                        <p className="text-sm text-gray-700">
                                        <span className="font-medium">Terminal:</span> {bus.terminal}
                                        </p>

                                        <p className="text-sm text-gray-700">
                                        <span className="font-medium">Lokasi:</span> {bus.location}
                                        </p>

                                        <p className="text-sm text-gray-700">
                                        <span className="font-medium">No HP:</span> {bus.phone}
                                        </p>

                                        <p className="text-sm text-gray-700">
                                        <span className="font-medium">Jam Operasional:</span> {bus.open}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div> 
            <Footer />
        </div>
    );
}

export default Surabaya;
