import Navbar from "../../components/default/Navbar";
import Footer from "../../components/default/Footer";

import DashboardLP from "../../components/landingpage/SearchEngine";
import BrandStrip from "../../components/landingpage/BrandStrip";
import AboutSection from "../../components/landingpage/AboutSection";
import DestinationsSection from "../../components/landingpage/DestinationsSection";
import DealsSection from "../../components/landingpage/DealsSection";

function Home(){
    return(
        <div className="min-h-screen bg-slate-50 font-sans">
            <Navbar/>

            <main
              className="
                overflow-hidden
                pt-0  
              "
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