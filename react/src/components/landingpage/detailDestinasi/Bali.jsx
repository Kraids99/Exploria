import Navbar from "../../default/Navbar"; 
import Footer from "../../default/Footer";

import imgBali from "../../../assets/destination/bali.jpg";
import bis1 from "../../../assets/destination/Bis1.jpg";
import bis2 from "../../../assets/destination/Bis2.jpg";
import bis3 from "../../../assets/destination/Bis3.jpg";
import bis4 from "../../../assets/destination/Bis4.jpg";
import bis5 from "../../../assets/destination/Bis5.jpg";
import bis6 from "../../../assets/destination/Bis6.jpg";

function Bali() {

    const busInBali = [
        {
            name: "Sinar Jaya",
            terminal: "Terminal Mengwi",
            location: "Mengwi, Kab. Badung, Bali",
            phone: "0812-3344-5566",
            open: "05.00 – 22.00 WITA",
            image: bis1,
        },
        {
            name: "Lorena",
            terminal: "Terminal Ubung",
            location: "Denpasar Utara, Bali",
            phone: "0813-9988-2211",
            open: "06.00 – 21.00 WITA",
            image: bis2,
        },
        {
            name: "Gunung Harta",
            terminal: "Terminal Batubulan",
            location: "Gianyar, Bali",
            phone: "0811-7777-909",
            open: "24 Jam",
            image: bis3,
        },
        {
            name: "Air bus",
            terminal: "Terminal Canggu",
            location: "Gianyar, Bali",
            phone: "0811-7777-909",
            open: "24 Jam",
            image: bis4,
        },
        {
            name: "Sinar Baru",
            terminal: "Terminal Kuta",
            location: "Mengwi, Kab. Badung, Bali",
            phone: "0812-3344-5566",
            open: "05.00 – 22.00 WITA",
            image: bis5,
        },
        {
            name: "Rosalina",
            terminal: "Terminal Denpasar",
            location: "Mengwi, Kab. Badung, Bali",
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
                        src={imgBali}
                        alt="Bali"
                        className="w-250 h-100 object-cover rounded-2xl shadow-lg brightness-75"
                    />

                    {/* Overlay Text */}
                    <div className="absolute bottom-4 left-4 text-white">
                        <h2 className="mx-32 text-2xl font-bold">Bali</h2>
                        <p className="text-sm mx-32">Wonderfull City of Tourism</p>
                    </div>
                </div>
              
                <div ClassName="px-6 mt-4">
                    <p className=" mx-36 mt-4 text-blue-950 leading-relaxed">
                        Bali merupakan destinasi wisata paling populer di Indonesia, terkenal dengan
                        keindahan pantai, budaya yang kaya, serta berbagai tempat wisata seperti,
                        Uluwatu, Kuta, Canggu, dan Ubud.
                    </p>
                </div> 

                <div className="mt-8 w-full flex justify-center px-4">
                    <div className="w-full max-w-5xl">
                        <h2 className="text-xl font-semibold mx-6 mb-4">Terminal di Bali</h2>

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

export default Bali;