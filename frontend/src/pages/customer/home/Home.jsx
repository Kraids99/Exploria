import Navbar from "../../../components/default/Navbar";
import Footer from "../../../components/default/Footer";

import DashboardLP from "../../../components/landingpage/SearchEngine";
import BrandStrip from "../../../components/landingpage/BrandStrip";
import AboutSection from "../../../components/landingpage/AboutSection";
import DestinationsSection from "../../../components/landingpage/DestinationsSection";
import DealsSection from "../../../components/landingpage/DealsSection";
import { useEffect, useState } from "react";

function Home() {
  //biar mudah arahin page mana yang butuh side bar
  const [hasSidebarMobile, setHasSidebarMobile] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setHasSidebarMobile(!!token);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Navbar />

      <main
        className={`
          overflow-hidden
          pt-0
          ${hasSidebarMobile ? "pl-14 md:pl-0" : ""}
        `}
      >
        <DashboardLP />
        <BrandStrip />
        <AboutSection />
        <DestinationsSection />
        <DealsSection />
      </main>

      <Footer />
    </div>
  );
}

export default Home;
