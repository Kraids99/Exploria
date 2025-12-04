import Navbar from "../../components/default/Navbar"; 
import Footer from "../../components/default/Footer";

import imgHoliday from "../../assets/Holiday.jpg";

function Holiday () {
    return (
        <div className="w-full min-h-screen overflow-y-auto pb-20">
            <Navbar />

                <div className="w-full flex justify-center overflow-hidden cursor-pointer relative mt-25">
                    <img
                        src={imgHoliday}
                        alt="Holiday"
                        className="w-250 h-100 object-cover rounded-2xl shadow-lg brightness-75"
                    />

                    {/* Overlay Text */}
                    <div className="absolute bottom-4 left-4 text-white">
                        <h2 className="mx-32 text-2xl font-bold">Liburan Bersama Keluarga</h2>
                        <p className="text-sm mx-32">Beli 3 tiket gratis 1, cocok untuk liburan akhir pekan bersama keluarga</p>
                    </div>
                </div>

                <div ClassName="px-6 mt-4">
                    <p className=" mx-36 mt-4 text-blue-950 leading-relaxed">
                        Asikk liburan bersama keluarga dengan tiket gratis satu. Buruan cek bus kesukaanmu dibawah ini
                    </p>
                </div>
            <Footer />
        </div>
    );
}

export default Holiday;