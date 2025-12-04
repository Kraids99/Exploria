// src/components/DealsSection.jsx
import { useNavigate } from "react-router-dom";

const deals = [
  {
    title: "Diskon Hanya Untukmu",
    subtitle: "Hingga 50%",
    description: "Nikmati potongan harga spesial untuk rute pilihan.",
    badge: "Tersedia sampai 30 November 2025",
    image:
      "https://images.pexels.com/photos/799463/pexels-photo-799463.jpeg?auto=compress&cs=tinysrgb&w=1200",
    path: "/diskon",   // <--- tambahkan path
  },
  {
    title: "Liburan Bersama Keluarga",
    subtitle: "Beli 3 tiket gratis 1",
    description: "Cocok untuk liburan akhir pekan bersama keluarga.",
    badge: "Tersedia sampai 30 Januari 2026",
    image:
      "https://images.pexels.com/photos/1430677/pexels-photo-1430677.jpeg?auto=compress&cs=tinysrgb&w=1200",
    path: "/holiday",    // <--- tambahkan path
  },
];

function DealsSection() {
  const navigate = useNavigate();

  return (
    <section className="bg-white pb-20 pt-4">
      <div className="mx-auto max-w-6xl px-4">
        <header className="mb-6">
          <h2 className="text-xl font-bold uppercase tracking-[0.14em] text-slate-900 md:text-2xl">
            Diskon Eksklusif Hanya Untukmu!
          </h2>
        </header>

        <div className="grid gap-6 md:grid-cols-2">
          {deals.map((deal) => (
            <article
              key={deal.title}
              className="relative overflow-hidden rounded-[28px] bg-slate-900 text-white shadow-lg"
            >
              <img
                src={deal.image}
                alt={deal.title}
                className="h-64 w-full object-cover opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/40 to-transparent" />
              <div className="absolute inset-0 flex flex-col justify-between p-5">
                <div className="flex justify-between text-[10px] font-medium">
                  <span className="rounded-full bg-black/50 px-3 py-1">
                    {deal.badge}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold md:text-xl">
                    {deal.title}
                  </h3>
                  <p className="mt-2 text-sm md:text-base">{deal.subtitle}</p>
                  <p className="mt-1 text-xs text-slate-100/80 md:text-sm">
                    {deal.description}
                  </p>
                  <button
                    type="button"
                    onClick={() => navigate(deal.path)}
                    className="
                      mt-4 rounded-full bg-white px-4 py-1.5 text-xs font-semibold text-slate-900 
                      hover:bg-black hover:text-amber-600 hover:transition-colors duration-200 ease-out
                    "
                  >
                    Lihat selengkapnya
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default DealsSection;
