import Navbar from "../../default/Navbar"; 
import Footer from "../../default/Footer";

import imgDiscount from "../../../assets/deals/BisDiscount.jpg";
import bis1 from "../../../assets/bus/Bis1.jpg";
import bis2 from "../../../assets/bus/Bis2.jpg";
import bis3 from "../../../assets/bus/Bis3.jpg";
import bis4 from "../../../assets/bus/Bis4.jpg";
import bis5 from "../../../assets/bus/Bis5.jpg";
import bis6 from "../../../assets/bus/Bis6.jpg";

function Discount() {
  const busDiscount = [
    {
      name: "Sinar Jaya",
      terminal: "Terminal Mengwi",
      location: "Yogyakarta",
      phone: "0812-3344-5566",
      open: "05.00 – 22.00 WITA",
      harga: "Rp 550.000",
      image: bis1,
    },
    {
      name: "Lorena",
      terminal: "Terminal Ubung",
      location: "Yogyakarta",
      phone: "0813-9988-2211",
      open: "06.00 – 21.00 WITA",
      harga: "Rp 320.000",
      image: bis2,
    },
    {
      name: "Gunung Harta",
      terminal: "Terminal Batubulan",
      location: "Yogyakarta",
      phone: "0811-7777-909",
      open: "24 Jam",
      harga: "Rp 230.000",
      image: bis3,
    },
    {
      name: "Air bus",
      terminal: "Terminal Canggu",
      location: "Yogyakarta",
      phone: "0811-7777-909",
      open: "24 Jam",
      harga: "Rp 400.000",
      image: bis4,
    },
    {
      name: "Sinar Baru",
      terminal: "Terminal Kuta",
      location: "Yogyakarta",
      phone: "0812-3344-5566",
      open: "05.00 – 22.00 WITA",
      harga: "Rp 290.000",
      image: bis5,
    },
    {
      name: "Rosalina",
      terminal: "Terminal Denpasar",
      location: "Yogyakarta",
      phone: "0812-3344-5566",
      open: "05.00 – 21.00 WITA",
      harga: "Rp 500.000",
      image: bis6,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 pb-10">
        <section className="w-full flex justify-center mt-6 px-4">
          <div className="relative w-full max-w-5xl">
            <img
              src={imgDiscount}
              alt="Discount"
              className="
                w-full 
                h-48 sm:h-60 md:h-72 lg:h-80
                object-cover 
                rounded-2xl shadow-lg brightness-75
              "
            />

            <div className="absolute bottom-4 left-4 sm:left-8 text-white max-w-xl">
              <h2 className="text-2xl sm:text-3xl font-bold">
                Diskon Hanya Untuk Kamu
              </h2>
              <p className="text-sm sm:text-base mt-1">
                Hingga 50% – nikmati potongan harga spesial untuk rute pilihan
              </p>
            </div>
          </div>
        </section>

        <section className="mt-6 px-4">
          <div className="max-w-3xl mx-auto">
            <p className="text-sm sm:text-base text-blue-950 leading-relaxed">
              Nikmati diskonmu dengan harga terjangkau untuk paket bus yang
              tersedia di bawah ini. Pilih rute dan armada favoritmu, lalu
              pesan dengan mudah!
            </p>
          </div>
        </section>

        <section className="mt-8 px-4">
          <div className="w-full max-w-6xl mx-auto">
            <h2 className="text-lg sm:text-xl font-semibold mb-4">
              Pilihan Bus dengan Diskon
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {busDiscount.map((bus) => (
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

                    <p className="text-lg font-semibold text-orange-600 mb-1">
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

export default Discount;