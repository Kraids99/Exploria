import Navbar from "../components/landingpage/Navbar"; 
import Hero from "../components/landingpage/Hero"; 
import BrandStrip from "../components/landingpage/BrandStrip"; 
import AboutSection from "../components/landingpage/AboutSection"; 
import DestinationsSection from "../components/landingpage/DestinationsSection"; 
import DealsSection from "../components/landingpage/DealsSection"; 
import Footer from "../components/landingpage/Footer"; 

function Home(){
    return(
        <div className="min-h-screen bg-slate-50 font-sans">
            <Navbar/>

            <main className="overflow-hidden">
                <Hero />
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