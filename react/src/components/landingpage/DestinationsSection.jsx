import DestinationCard from "./DestinationCard";
import bandung from "../../assets/destination/bandung.jpg";
import yogya from "../../assets/destination/yogyakarta.jpg";
import surabaya from "../../assets/destination/surabaya.jpg";
import bali from "../../assets/destination/bali.jpg";

import "../../style/landingpage/destinations.css";
import "../../App.css";

const DESTINATIONS = [
  {
    name: "Bandung",
    badge: "150.000 Akomodasi",
    image: bandung,
  },
  {
    name: "Yogyakarta",
    badge: "700.000 Akomodasi",
    image: yogya,
  },
  {
    name: "Surabaya",
    badge: "350.000 Akomodasi",
    image: surabaya,
  },
  {
    name: "Bali",
    badge: "750.000 Akomodasi",
    image: bali,
  },
];

function DestinationsSection() {
  return (
    <section className="section-wrapper">
      <div className="section-heading">
        <div className="section-eyebrow">Destinasi Terpopuler</div>
        <h2 className="section-title">Temukan kota favoritmu</h2>
        <p className="section-subtitle">
          Destinasi Terpopuler menampilkan rute dan kota tujuan favorit,
          memudahkanmu menemukan perjalanan yang paling diminati dengan cepat
          dan praktis.
        </p>
      </div>

      <div className="destinations-grid">
        {DESTINATIONS.map((dest) => (
          <DestinationCard key={dest.name} {...dest} />
        ))}
      </div>
    </section>
  );
}

export default DestinationsSection;
