import Footer from "../components/landingpage/Footer";
import Navbar from "../components/landingpage/Navbar";
import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getLokasi, getTiketByParams } from "../api/apiHero.jsx";
import FieldDate from "../components/landingpage/FieldDate.jsx";
import FieldSelect from "../components/landingpage/FieldSelect.jsx";
import Tikets from "../components/selectbus/Tikets.jsx";

function SelectBus() {
  const [params] = useSearchParams();
  const fromCity1 = params.get("from") || "";
  const toCity1 = params.get("to") || "";
  const date1 = params.get("date") || "";

  const [fromCity, setFromCity] = useState(fromCity1);
  const [toCity, setToCity] = useState(toCity1);
  const [date, setDate] = useState(date1);


  useEffect(() => {
    setFromCity(fromCity1);
    setToCity(toCity1);
    setDate(date1);
  }, [fromCity1, toCity1, date1]);



  const [locations, setLocations] = useState([]);
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const data = await getLokasi();
        const uniqueCities = [...new Set(data.map(item => item.kota))];
        setLocations(uniqueCities);
      } catch (error) {
        console.log("Error get lokasi:", error);
      }
    };

    fetchLocations();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    navigate(`/search?from=${fromCity}&to=${toCity}&date=${date}`);
  };
  return (
    <div className="min-h-screen bg-[#F9FAFB] font-sans">
      <Navbar />

      <main className="mx-auto max-w-6xl px-4 pb-16 pt-10">
        <form onSubmit={handleSubmit}>
          <section className="mt-16 mb-8 rounded-[15px] border border-slate-100 bg-white px-6 py-5 shadow-sm shadow-lg">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div className="grid grid-cols-6 gap-4 align-baseline">
                <h1 className="text-xl font-bold text-slate-900 md:text-2xl">
                  Pilih Bus
                </h1>

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

                <div className="col-span-2">
                  <FieldDate
                    label="Tanggal berangkat"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </div>

                <button
                  type="submit"
                  className="mt-2 md:mt-0
                            flex h-12 items-center justify-center
                            bg-[#2b1302]
                            rounded-[999px] px-6 text-sm font-semibold text-white
                            shadow-md transition-all duration-200 ease-out
                            hover:bg-brand-600 hover:-translate-y-0.5"
                >
                  Ubah Pencarian
                </button>
              </div>
            </div>
          </section>
        </form>

        <section className="space-y-4">
          <Tikets fromCity={fromCity} toCity={toCity} date={date} />
        </section>

      </main>

      <Footer />
    </div>
  );
}

export default SelectBus;
