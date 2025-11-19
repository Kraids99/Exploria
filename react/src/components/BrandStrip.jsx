import bs1 from "../assets/brand-strip/bs-1.png"; 
import bs2 from "../assets/brand-strip/bs-2.png"; 
import bs3 from "../assets/brand-strip/bs-3.png"; 
import bs4 from "../assets/brand-strip/bs-4.png"; 
import bs5 from "../assets/brand-strip/bs-5.png"; 
import bs6 from "../assets/brand-strip/bs-6.png"; 


function BrandStrip() {
  return (
    <section className="brand-strip">
      <div className="brand-strip-inner">
        <div className="brand-logo"> 
          <img src={bs1} alt="Rosalia Indah" className="brand-logo-img"/>
        </div>
        <div className="brand-logo"> 
          <img src={bs2} alt="Nusantara" className="brand-logo-img"/>
        </div>
        <div className="brand-logo"> 
          <img src={bs3} alt="Pahala Kencana" className="brand-logo-img"/>
        </div>
        <div className="brand-logo"> 
          <img src={bs4} alt="Sinar Jaya" className="brand-logo-img"/>
        </div>
        <div className="brand-logo"> 
          <img src={bs5} alt="Kramat Djati" className="brand-logo-img"/>
        </div>
        <div className="brand-logo"> 
          <img src={bs6} alt="MTrans" className="brand-logo-img"/>
        </div>

      </div>
    </section>
  );
}

export default BrandStrip;
