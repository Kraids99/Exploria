import rosalia from "../../assets/brand-strip/bs-1.png";
import nusantara from "../../assets/brand-strip/bs-2.png";
import kencana from "../../assets/brand-strip/bs-3.png";
import sinarJaya from "../../assets/brand-strip/bs-4.png";
import kramatDjati from "../../assets/brand-strip/bs-5.png";
import mTrans from "../../assets/brand-strip/bs-6.png";

const brands = [
  { name: "Rosalia Indah", logo: rosalia}, 
  { name: "Nusantara", logo: nusantara}, 
  { name: "Kencana", logo: kencana}, 
  { name: "Sinar Jaya", logo: sinarJaya}, 
  { name: "Kramat Djati", logo: kramatDjati}, 
  { name: "MTrans", logo: mTrans}, 
];

function BrandStrip() {
  return (
    <section className="border-y border-slate-100 bg-white py-6">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-6 px-4 md:justify-between">
        {brands.map((brand) => (
          <img
            key={brand.name}
            src={brand.logo}
            alt={brand.name}
            className="
                h-8 w-auto
                filter grayscale opacity-60
                transition-all duration-200 ease-out
                hover:grayscale-0 hover:opacity-100"
          />
        ))}
      </div>
    </section>
  );
}

export default BrandStrip;
