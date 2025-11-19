// src/components/DealsSection.jsx
import DealCard from "./DealCard";

const DEALS = [
  {
    title: "Diskon Hanya Untukmu",
    highlight: "50%",
    badge: "Tersedia sampai 30 November 2025",
    buttonText: "Lihat selengkapnya →",
    image:
      "https://images.pexels.com/photos/460672/pexels-photo-460672.jpeg?auto=compress&w=1200",
  },
  {
    title: "Ciptakan Liburan Bersama Keluarga",
    highlight: "Beli 3 tiket gratis 1",
    badge: "Tersedia sampai 30 Januari 2025",
    buttonText: "Lihat selengkapnya →",
    image:
      "https://images.pexels.com/photos/3760093/pexels-photo-3760093.jpeg?auto=compress&w=1200",
  },
];

function DealsSection() {
  return (
    <section className="section-wrapper">
      <div className="section-heading">
        <div className="section-eyebrow">Diskon Eksklusif Hanya Untukmu!</div>
        <h2 className="section-title">Promo terbaik untuk setiap perjalanan</h2>
      </div>

      <div className="deals-grid">
        {DEALS.map((deal) => (
          <DealCard key={deal.title} {...deal} />
        ))}
      </div>
    </section>
  );
}

export default DealsSection;
