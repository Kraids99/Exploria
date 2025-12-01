import Footer from "../../components/default/Footer.jsx";
import Navbar from "../../components/default/Navbar.jsx";
import FieldDate from "../../components/default/FieldDate.jsx";
import FieldSelect from "../../components/default/FieldSelect.jsx";

import { getLokasi, getTiketByParams } from "../../api/apiTiket.jsx";
import Tikets from "../../components/tiket/Tikets.jsx";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import { toast } from "react-toastify";

import BusLoader from "../../components/default/BusLoader.jsx";

function SelectBus() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

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
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        setLoading(true);
        const data = await getLokasi();
        const uniqueCities = [...new Set(data.map((item) => item.kota))];
        setLocations(uniqueCities);
      } catch (error) {
        console.log("Error get lokasi:", error);
        toast.error("Gagal memuat daftar kota");
      } finally {
        setLoading(false);
      }
    };

    fetchLocations();
  }, []);

  const validateData = () => {
    if (!date) {
      toast.error("Tanggal tidak boleh kosong");
      return false;
    }

    if (fromCity === toCity) {
      toast.error("Kota Asal dan Tujuan tidak boleh sama");
      return false;
    }

    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const isValid = validateData();
    if (!isValid) return;

    navigate(`/search?from=${fromCity}&to=${toCity}&date=${date}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] font-sans flex flex-col">
        <Navbar />

        <main className="flex-1 mx-auto max-w-6xl px-4 pb-16 flex items-center justify-center pl-14 md:pl-0 pt-6 md:pt-24">
          <BusLoader message="Memuat daftar kota keberangkatan & tujuan..." />
        </main>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] font-sans flex flex-col">
      <Navbar />

      <main className="mx-auto max-w-6xl px-4 pb-16 pl-14 md:pl-0 pt-6 md:pt-24">
        <form onSubmit={handleSubmit}>
          <section className="mt-6 md:mt-16 mb-8 rounded-[15px] border border-slate-100 bg-white px-4 py-4 md:px-6 md:py-5 shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              <div className="md:col-span-4">
                <h1 className="text-xl font-bold text-slate-900 md:text-2xl">
                  Pilih Bus
                </h1>
              </div>

              <div>
                <FieldSelect
                  label="Kota asal"
                  placeholder="Pilih kota asal"
                  value={fromCity}
                  onChange={(e) => setFromCity(e.target.value)}
                  options={locations}
                />
              </div>

              <div>
                <FieldSelect
                  label="Kota tujuan"
                  placeholder="Pilih kota tujuan"
                  value={toCity}
                  onChange={(e) => setToCity(e.target.value)}
                  options={locations}
                />
              </div>

              <div>
                <FieldDate
                  label="Tanggal berangkat"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>

              <button
                type="submit"
                className="mt-2 md:mt-0 w-full
                            flex h-12 items-center justify-center
                            bg-[#2b1302]
                            rounded-[999px] px-6 text-sm font-semibold text-white
                            shadow-md transition-all duration-200 ease-out
                            hover:bg-[#440d05] transition-colors"
              >
                Ubah Pencarian
              </button>
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
