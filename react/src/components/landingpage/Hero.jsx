import HERO_BG from "../../assets/dashboard.jpg"
import { useEffect, useState } from "react";
import { getLokasi, getTiket, getRute } from "../../api/apiHero.jsx";



// const CITIES = [
//   "Jakarta",
//   "Bandung",
//   "Yogyakarta",
//   "Surabaya",
//   "Semarang",
//   "Medan",
//   "Makassar",
//   "Denpasar",
// ];


function Hero() {
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const data = await getLokasi(); 
        console.log("Lokasi:", data);
        // setLocations(data); // simpan data ke state
        const uniqueCities = [...new Set(data.map(item => item.kota))];
        setLocations(uniqueCities);
      } catch (error) {
        console.log("Error get lokasi:", error);
      }
    };

    fetchLocations();
  }, []);

  const [fromCity, setFromCity] = useState("");
  const [toCity, setToCity] = useState("");
  const [date, setDate] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // di sini nanti bisa kamu sambungkan ke API / router
    console.log({ fromCity, toCity, date });
  };

  return (
    <section className="relative overflow-hidden pb-24 pt-24">
      {/* BACKGROUND IMAGE */}
      <div className="absolute inset-0">
        <img
          src={HERO_BG}
          alt="Terminal bus Exploria"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 via-slate-900/50 to-slate-900/10" />
      </div>

      {/* KONTEN */}
      <div className="relative z-10 mx-auto max-w-6xl px-4">
        <div className="flex flex-col items-start md:items-end">
          {/* TEKS DI SEBELAH KANAN */}
          <div className="max-w-xl space-y-5 text-left md:self-end md:text-right">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-200">
              Bus Ticketing Platform
            </p>
            <h1 className="text-3xl font-bold leading-tight text-white md:text-4xl lg:text-[40px]">
              It&apos;s A Big World Out There,{" "}
              <span className="text-brand-400">Go Explore!</span>
            </h1>
            <p className="max-w-xl text-sm text-slate-100/90 md:text-base">
              Pesan tiket bus dari berbagai operator terpercaya, bayar online,
              dan nikmati perjalanan yang aman dan nyaman ke berbagai kota
              favoritmu.
            </p>
          </div>

          {/* FORM PENCARIAN – 1 BARIS */}
          <form
            onSubmit={handleSubmit}
              className="
                    mt-16              /* lebih turun ke bawah */
                    w-full
                    max-w-5xl         /* kartu lebih kecil dari sebelumnya */
                    self-center       /* formnya dipaksa ke tengah secara horizontal */
                    rounded-[32px]
                    bg-white/95
                    px-4 py-5
                    shadow-search
                    md:px-6 md:py-6
                "
          >
            <div className="grid items-end gap-3 md:grid-cols-[2fr,2fr,1.5fr,auto]">
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
                  rounded-[999px] bg-brand-500 px-6 text-sm font-semibold text-white
                  shadow-md transition-all duration-200 ease-out
                  hover:bg-brand-600 hover:-translate-y-0.5
                "
              >
                Search Trip
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

/* FIELD SELECT KOTA */
function FieldSelect({ label, value, onChange, options, placeholder }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50/70 px-4 py-3 text-xs md:text-sm">
      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
        {label}
      </p>
      <select
        value={value}
        onChange={onChange}
        className="mt-1 w-full bg-transparent text-xs font-semibold text-slate-800 outline-none md:text-sm"
      >
        <option value="">{placeholder}</option>
        {options.map((city, index) => (
        <option key={index} value={city}>
          {city}
        </option>
        ))}
        {/* {options.map((city) => (
          <option key={city} value={city}>
            {city}
          </option>
        ))} */}
      </select>
    </div>
  );
}

/* FIELD TANGGAL */
function FieldDate({ label, value, onChange }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50/70 px-4 py-3 text-xs md:text-sm">
      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
        {label}
      </p>
      <input
        type="date"
        value={value}
        onChange={onChange}
        className="mt-1 w-full bg-transparent text-xs font-semibold text-slate-800 outline-none md:text-sm"
      />
    </div>
  );
}

export default Hero;
