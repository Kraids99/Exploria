// src/App.jsx
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import BrandStrip from "./components/BrandStrip";
import AboutSection from "./components/AboutSection";
import DestinationsSection from "./components/DestinationsSection";
import DealsSection from "./components/DealsSection";
import Footer from "./components/Footer";

function App() {
  return (
    <div className="home-page">
      <Navbar />
      <HeroSection />

      <main>
        <BrandStrip />
        <AboutSection />
        <DestinationsSection />
        <DealsSection />
      </main>

      <Footer />
    </div>
  );
}

export default App;
