import { useNavigate } from "react-router-dom";

import BandungImg from "../../assets/destination/bandung.jpg";
import YogyakartaImg from "../../assets/destination/yogyakarta.jpg";
import SurabayaImg from "../../assets/destination/surabaya.jpg";
import BaliImg from "../../assets/destination/bali.jpg";

const destinations = [
  {
    city: "Bandung",
    caption: "150.000 akomodasi",
    image: BandungImg,
    path: "/destinasi/bandung",
  },
  {
    city: "Yogyakarta",
    caption: "260.000 akomodasi",
    image: YogyakartaImg,
    path: "/destinasi/yogyakarta",
  },
  {
    city: "Surabaya",
    caption: "350.000 akomodasi",
    image: SurabayaImg,
    path: "/destinasi/surabaya",
  },
  {
    city: "Bali",
    caption: "750.000 akomodasi",
    image: BaliImg,
    path: "/destinasi/bali",
  },
];

function DestinationsSection() {
  const navigate = useNavigate(); // <- huruf kecil

  const handleClick = (path) => {
    navigate(path);
  };

  return (
    <section className="bg-white pb-16 pt-4">
      <div className="mx-auto max-w-6xl px-4">
        <header className="mb-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-500">
            Destinasi Terpopuler
          </p>
          <h2 className="mt-2 text-2xl font-bold text-slate-900 md:text-3xl">
            Temukan kota favoritmu
          </h2>
          <p className="mt-3 text-sm text-slate-600 md:text-[13px]">
            Jelajahi rute dan kota favorit, temukan perjalanan yang paling
            diminati dengan cepat dan praktis.
          </p>
        </header>

        <div className="grid gap-6 md:grid-cols-4">
          {destinations.map((item) => (
            <article
              key={item.city}
              onClick={() => handleClick(item.path)}
              className="group cursor-pointer overflow-hidden rounded-[20px] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="relative">
                <img
                  src={item.image}
                  alt={item.city}
                  className="h-52 w-full object-cover transition duration-300 group-hover:scale-105"
                />
                <span className="absolute left-3 top-3 rounded-full bg-black/70 px-3 py-1 text-[10px] font-medium text-white">
                  {item.caption}
                </span>
              </div>
              <div className="flex items-center justify-between px-4 py-3">
                <h3 className="text-sm font-semibold text-slate-900">
                  {item.city}
                </h3>
                <span className="text-sm text-brand-500">&gt;</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default DestinationsSection;
