import { FaStar } from "react-icons/fa"; 
import { MdAirlineSeatReclineNormal } from "react-icons/md"; 
import Footer from "../components/landingpage/Footer"; 
import Navbar from "../components/landingpage/Navbar";
import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getTiketByParams } from "../api/apiHero.jsx";

const timeFilters = [
    { label: "00:00 - 06:00", value: "00-06"}, 
    { label: "06:00 - 12:00", value: "06-12"}, 
    { label: "12:00 - 18:00", value: "12-18"}, 
]; 

const busTypeFilters = [
    "Kelas Ekonomi", 
    "Kelas Bisnis", 
    "Kelas Premium", 
]; 

const facilityFilters = [
    "Wifi", 
    "Lampu Baca", 
    "Charging Point"
]; 



function SelectBus() {
    const [params] = useSearchParams();
    const fromCity = params.get("from");
    const toCity = params.get("to");
    const date = params.get("date");

    const [bus, setBusResults] = useState([]);
    useEffect(() => {
      const fetchTickets = async () => {
        try {
          const data = await getTiketByParams(fromCity, toCity, date);
          setBusResults(data);   // simpan hasil pencarian
          console.log("Hasil tiket:", data);
        } catch (err) {
          console.log("Error fetch tiket:", err);
        }
      };

       if (fromCity && toCity && date) {
          fetchTickets();
       }
    }, [fromCity, toCity, date]);

    
    return (
        <div className="min-h-screen bg-[#F9FAFB] font-sans">
            <Navbar />
            {/* KONTEN UTAMA */}
            <main className="mx-auto max-w-6xl px-4 pb-16 pt-10">
                {/* CARD RINGKASAN PENCARIAN */}
                <section className="mt-16 mb-8 rounded-[15px] border border-slate-100 bg-white px-6 py-5 shadow-sm shadow-lg">
                <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">

                    <div className="grid gap-3 md:grid-cols-[2.5fr,2fr,2fr,2fr,1.5fr]">
                    <h1 className="text-xl font-bold text-slate-900 md:text-2xl">
                        Pilih Bus
                    </h1>
                    <SummaryField label="Kota Asal" value={fromCity} />
                    <SummaryField label="Kota Tujuan" value={toCity} />
                    <SummaryField label="Tanggal Keberangkatan" value={date} />
                    <button
                        className="h-11 rounded-full bg-brand-500 px-4 text-sm font-semibold text-white shadow-sm transition-colors duration-200 hover:bg-brand-600"
                    >
                        Ubah Pencarian
                    </button>
                    </div>
                </div>
                </section>

                {/* GRID FILTER + HASIL */}
                <section className="grid gap-6 lg:grid-cols-[260px,1fr]">
              
                {/* HASIL KANAN */}
                <section className="space-y-4">
                    

                    {/* LIST BUS */}
                    <div className="space-y-4">
                    {/* {busResults.map((bus, idx) => (
                        <BusCard key={idx} bus={bus} />
                    ))} */}
                    {bus.map((bus, idx) => (
                        <BusCard key={idx} bus={bus} />
                    ))}
                    </div>
                </section>
                </section>
            </main>

            {/* FOOTER BAWAH */}
            <Footer />
        </div>
    );
}

function SummaryField({ label, value }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50/80 px-4 py-2 text-xs">
      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
        {label}
      </p>
      <p className="mt-1 text-sm font-semibold text-slate-900">{value}</p>
    </div>
  );
}




function BusCard({ bus }) {
  return (
    <article className="rounded-3xl border border-slate-100 bg-white px-5 py-4 shadow-sm">

      {/* HEADER */}
      <div>
        <h3 className="text-xl font-semibold text-slate-900">
          {bus.nama_tiket}
        </h3>
        <p className="text-xs text-slate-500">
          {bus.company?.nama_company}
        </p>
      </div>

      <div className="mt-3 mb-4 h-px w-full bg-slate-200" />

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

        {/* ASAL */}
        <div>
          <p className="text-lg font-semibold text-slate-900">
            {bus.waktu_keberangkatan?.substring(11,16)}
          </p>
          <p>{bus.rute?.asal?.kota}</p>
          <p className="text-[11px] text-slate-500">
            {bus.rute?.asal?.terminal}
          </p>
        </div>

        {/* DURASI */}
        <div className="text-[11px] text-slate-500">
          {bus.durasi} jam
        </div>

        {/* TUJUAN */}
        <div>
          <p className="text-lg font-semibold text-slate-900">
            {bus.waktu_tiba?.substring(11,16)}
          </p>
          <p>{bus.rute?.tujuan?.kota}</p>
          <p className="text-[11px] text-slate-500">
            {bus.rute?.tujuan?.terminal}
          </p>
        </div>

        {/* HARGA */}
        <div className="flex flex-col items-end gap-1">
          <p className="text-xs text-slate-500">Harga mulai dari</p>
          <p className="text-lg font-bold text-brand-500">
            Rp {Number(bus.harga).toLocaleString()}
          </p>
          <button className="mt-2 rounded-full bg-brand-500 px-5 py-2 text-xs font-semibold text-white">
            Pilih
          </button>
        </div>

      </div>
    </article>
  );
}



export default SelectBus;