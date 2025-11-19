// src/App.jsx
import Navbar from "./components/landingpage/Navbar";
import Dashboard from "./components/landingpage/Dashboard";
import BrandStrip from "./components/landingpage/BrandStrip";
import AboutSection from "./components/landingpage/AboutSection";
import DestinationsSection from "./components/landingpage/DestinationsSection";
import DealsSection from "./components/landingpage/DealsSection";
import Footer from "./components/landingpage/Footer";

function App() {
  return (
    <div className="home-page">
      <Navbar />
      <Dashboard />

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
