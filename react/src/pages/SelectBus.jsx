import { FaStar } from "react-icons/fa"; 
import { MdAirlineSeatReclineNormal } from "react-icons/md"; 
import Footer from "../components/landingpage/Footer"; 
import Navbar from "../components/landingpage/Navbar";

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

const busResults = [
   { 
        operator: "Sinar Jaya", 
        class: "Kelas Premium", 
        departTime: "16 : 30", 
        departCity: "Yogyakarta", 
        departTerminal: "Terminal Jombor", 
        arriveTime: "03:25", 
        arriveCity: "Bekasi", 
        arriveArea: "Cikarang", 
        duration: "10j 55m", 
        rating: 4.3, 
        seatsLeft: 12, 
        price: "Rp 360.000 / kursi", 
    }, 
]; 

function SelectBus() {
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
                    <SummaryField
                        label="Kota Asal"
                        value="Yogyakarta"
                    />
                    <SummaryField
                        label="Kota Tujuan"
                        value="Bekasi"
                    />
                    <SummaryField
                        label="Tanggal Keberangkatan"
                        value="24 Desember 2025"
                    />
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
                {/* FILTER KIRI */}
                <aside className="rounded-[15px] border border-slate-100 bg-white px-5 py-4 shadow-sm lg:sticky lg:top-6">
                    <h2 className="mb-4 text-base font-bold text-slate-900">
                    Filter
                    </h2>

                    {/* WAKTU KEBERANGKATAN */}
                    <FilterSection title="Waktu Keberangkatan">
                    <div className="space-y-2 text-xs text-slate-600">
                        {timeFilters.map((t) => (
                        <label
                            key={t.value}
                            className="flex items-center gap-2"
                        >
                            <input
                            type="checkbox"
                            className="h-4 w-4 rounded border-slate-300 text-brand-500 focus:ring-brand-500"
                            />
                            <span>{t.label}</span>
                        </label>
                        ))}
                    </div>
                    </FilterSection>

                    {/* JENIS BUS */}
                    <FilterSection title="Jenis Bus">
                    <div className="space-y-2 text-xs text-slate-600">
                        {busTypeFilters.map((item) => (
                        <label
                            key={item}
                            className="flex items-center gap-2"
                        >
                            <input
                            type="checkbox"
                            className="h-4 w-4 rounded border-slate-300 text-brand-500 focus:ring-brand-500"
                            />
                            <span>{item}</span>
                        </label>
                        ))}
                    </div>
                    </FilterSection>

                    {/* FASILITAS */}
                    <FilterSection title="Fasilitas">
                    <div className="space-y-2 text-xs text-slate-600">
                        {facilityFilters.map((item) => (
                        <label
                            key={item}
                            className="flex items-center gap-2"
                        >
                            <input
                            type="checkbox"
                            className="h-4 w-4 rounded border-slate-300 text-brand-500 focus:ring-brand-500"
                            />
                            <span>{item}</span>
                        </label>
                        ))}
                    </div>
                    </FilterSection>
                </aside>

                {/* HASIL KANAN */}
                <section className="space-y-4">
                    {/* Bar judul + dropdown titik */}
                    <div className="rounded-[15px] border border-slate-100 bg-white px-5 py-4 shadow-sm">
                    <div className="mb-4 text-sm font-semibold text-slate-900">
                        Perjalanan Terbaik Anda!
                    </div>
                    <div className="grid gap-3 md:grid-cols-2">
                        <button className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-500">
                        <span>Titik Keberangkatan</span>
                        <span className="text-slate-400">▼</span>
                        </button>
                        <button className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-500">
                        <span>Titik Tiba</span>
                        <span className="text-slate-400">▼</span>
                        </button>
                    </div>
                    </div>

                    {/* LIST BUS */}
                    <div className="space-y-4">
                    {busResults.map((bus, idx) => (
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

function FilterSection({ title, children }) {
  return (
    <div className="mb-4 border-b border-slate-100 pb-4 last:border-0 last:pb-0">
      <h3 className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
        {title}
      </h3>
      {children}
    </div>
  );
}


function BusCard({ bus }) {
  return (
    <article className="rounded-3xl border border-slate-100 bg-white px-5 py-4 shadow-sm">
      <div>
        <h3 className="text-xl font-semibold text-slate-900">
          {bus.operator}
        </h3>
        <p className="text-xs text-slate-500">{bus.class}</p>
      </div>

      <div className="mt-3 mb-4 h-px w-full bg-slate-200" />

      {/* BODY: jam + kota + harga */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        {/* KIRI: jam & kota */}
        <div className="flex flex-wrap items-center gap-6 text-xs font-medium text-slate-800">
          <div>
            <p className="text-lg font-semibold text-slate-900">
              {bus.departTime}
            </p>
            <p>{bus.departCity}</p>
            <p className="text-[11px] text-slate-500">
              {bus.departTerminal}
            </p>
          </div>

          <div className="text-[11px] text-slate-500">{bus.duration}</div>

          <div>
            <p className="text-lg font-semibold text-slate-900">
              {bus.arriveTime}
            </p>
            <p>{bus.arriveCity}</p>
            <p className="text-[11px] text-slate-500">
              {bus.arriveArea}
            </p>
          </div>
        </div>

        {/* rating & sisa kursi */}
        <div className="flex flex-col gap-1 text-[11px] text-slate-600">
          <div className="flex items-center gap-1">
            <FaStar className="h-4 w-4 text-yellow-400" />
            <span>
              <span className="font-semibold">{bus.rating}</span> rating
            </span>
          </div>

          <div className="flex items-center gap-1">
            <MdAirlineSeatReclineNormal className="h-4 w-4 text-slate-500" />
            <span>
              <span className="font-semibold">{bus.seatsLeft}</span> Sisa
            </span>
          </div>
        </div>

        {/* KANAN: harga + tombol PILIH */}
        <div className="flex flex-col items-end gap-1">
          <p className="text-xs text-slate-500">Harga mulai dari</p>
          <p className="text-lg font-bold text-brand-500">{bus.price}</p>
          <button className="mt-2 rounded-full bg-brand-500 px-5 py-2 text-xs font-semibold text-white shadow-sm transition-colors duration-200 hover:bg-brand-600">
            Pilih
          </button>
        </div>
      </div>

      {/* ikon fasilitas */}
      <div className="mt-3 inline-flex items-center gap-2
            rounded-full border border-slate-200
            bg-slate-50 px-3 py-1
            text-[12px] text-slate-400
        ">
        <span>📶</span>
        <span>💡</span>
        <span>🔌</span>
      </div>
    </article>
  );
}

export default SelectBus;