import Navbar from "../../components/default/Navbar"; 
import Footer from "../../components/default/Footer";

import imgDiscount from "../../assets/BisDiscount.jpg";

function Discount () {
    return (
        <div className="w-full min-h-screen overflow-y-auto pb-20">
            <Navbar />

                <div className="w-full flex justify-center overflow-hidden cursor-pointer relative mt-25">
                    <img
                        src={imgDiscount}
                        alt="Discount"
                        className="w-250 h-100 object-cover rounded-2xl shadow-lg brightness-75"
                    />

                    {/* Overlay Text */}
                    <div className="absolute bottom-4 left-4 text-white">
                        <h2 className="mx-32 text-2xl font-bold">Diskon Hanya Untuk Kamu</h2>
                        <p className="text-sm mx-32">Hingga 50% Nikmati Potongan harga spesial untuk rute pilihan</p>
                    </div>
                </div>

                <div ClassName="px-6 mt-4">
                    <p className=" mx-36 mt-4 text-blue-950 leading-relaxed">
                        Nikmati diskonmu! dengan harga terjangkau untuk paket bis yang tersedia di bawah ini
                    </p>
                </div>

                
            <Footer />
        </div>
    );
}

export default Discount;