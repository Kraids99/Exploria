import background from "../../assets/dashboard.jpg";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { checkAuth } from "../../api/apiAuth.jsx";
import { getLokasi } from "../../api/apiTiket.jsx";
import FieldDate from "../default/FieldDate.jsx";
import FieldSelect from "../default/FieldSelect.jsx";
import { toast } from "react-toastify";


function DashboardLP() {
  const navigate = useNavigate();
  const [fromCity, setFromCity] = useState("");
  const [toCity, setToCity] = useState("");
  const [date, setDate] = useState("");

  const [locations, setLocations] = useState([]);
  //menyimpan kota asal, kota tujuan, tanggal dan daftar kota lokasi yang dipakai di dropdown 

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const data = await getLokasi();
        const uniqueCities = [...new Set(data.map((item) => item.kota))];
        setLocations(uniqueCities);
      } catch (error) {
        console.log("Error get lokasi:", error);
      }
    };

    fetchLocations();
  }, []);
  //dipanggil sekali saat komponen pertama kali muncul 
  //list kota itu disimpan ke locations untuk di pass ke FieldSelect 
  //getlokasi() diambil dr API 


  const validateForm = () => {
    if (!fromCity || !toCity || !date) {
      toast.error("Pilih kota asal, tujuan, dan tanggal terlebih dahulu.");
      return false;
    }

    return true;
  };
  //ngecek 3 field udah keisi atau belom 

  const handleSubmit = async (e) => {
    e.preventDefault();

    
    try {
      await checkAuth(); 
      //ngecek tokennya masi valid ga 
      
    } catch (err) {
      console.log("AUTH ERROR:", err);
      
      toast.error("Kamu harus login dulu ya . . .");
      localStorage.removeItem("token");
      navigate("/login");
      return;
    }

    const isValid = validateForm();
    if(!isValid) return; 

    navigate(
      `/search?from=${fromCity}&to=${toCity}&date=${date}`
    );
  };
  


  return (
    <section className="relative overflow-hidden pb-24 pt-24">
      {/* Background bus */}
      <div className="absolute inset-0">
        <img
          src={background}
          alt="Terminal bus Exploria"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-r from-slate-900/80 via-slate-900/50 to-slate-900/10" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-4">

        <div className="flex flex-col items-center text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-200">
            Bus Ticketing Platform
          </p>
          <h1 className="mt-3 text-3xl font-bold leading-tight text-white md:text-4xl lg:text-[40px]">
            It&apos;s A Big World Out There,{" "}
            <span className="text-brand-400">Go Explore!</span>
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-slate-100/90 md:text-base">
            Pesan tiket bus dari berbagai operator terpercaya, bayar online,
            dan nikmati perjalanan yang aman dan nyaman ke berbagai kota
            favoritmu.
          </p>
        </div>

    
        <form
          onSubmit={handleSubmit}
          className="
              mt-16
              w-full max-w-5xl mx-auto
              rounded-[32px]
              bg-white/95
              px-4 py-5
              shadow-search
              md:px-6 md:py-6
          "
        >
          <div className="grid grid-cols-4 gap-3 md:grid-cols-[1fr,1fr,1fr,auto]">
            <FieldSelect
              label="Kota asal"
              placeholder="Pilih kota asal"
              value={fromCity}
              onChange={(e) => setFromCity(e.target.value)}
              options={locations}
            />
            <FieldSelect
              label="Kota tujuan"
              placeholder="Pilih kota tujuan"
              value={toCity}
              onChange={(e) => setToCity(e.target.value)}
              options={locations}
            />
            <FieldDate
              label="Tanggal berangkat"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />

            <button
              type="submit"
              className="
                mt-2 md:mt-0
                flex h-12 items-center justify-center
                bg-[#f38f4a]
                rounded-[999px] px-6 text-sm font-semibold text-white
                shadow-md transition-all duration-200 ease-out
                hover:bg-[#cf4230] transition-colors
              "
            >
              Search Trip
            </button>
          </div>
          {/* Bagian form untuk menjadi tiket */}


        </form>
      </div>
    </section>
  );
}

export default DashboardLP;
