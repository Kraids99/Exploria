// src/components/HeroSection.jsx
import heroBus from "../assets/dashboard.jpg"; // ← gambar background hero kamu

function HeroSection() {
  return (
    <section className="hero">
      {/* BACKGROUND GAMBAR */}
      <div className="hero-bg">
        <img src={heroBus} alt="Exploria bus" />
      </div>

      {/* LAPISAN KONTEN DI ATAS GAMBAR */}
      <div className="hero-overlay">
        <div className="hero-inner">
          {/* TEKS KANAN */}
          <div className="hero-text-block">
            <p className="hero-eyebrow">Bus Ticket Reservation</p>
            <h1 className="hero-title">
              It&apos;s A Big World Out There,
              <br />
              <span className="hero-highlight">Go Explore!</span>
            </h1>
          </div>

          {/* CARD SEARCH DI BAGIAN BAWAH */}
          <div className="hero-search-wrapper">
            <SearchCard />
          </div>
        </div>
      </div>
    </section>
  );
}

function SearchCard() {
  return (
    <div className="search-card">
      {/* Tombol Round Trip / One Way */}
      <div className="trip-type-toggle">
        <div className="trip-toggle-inner">
          <button className="trip-toggle-btn active">Round Trip</button>
          <button className="trip-toggle-btn">One Way</button>
        </div>
      </div>

      {/* Field-field pencarian */}
      <div className="search-fields">
        <Field
          label="Departure City"
          topText="DAC"
          bottomText="Dhaka"
          smallText="Hazrat Shahjalal..."
        />
        <Field
          label="Arrival City"
          topText="CXB"
          bottomText="Cox&apos;s Bazar"
          smallText="Cox&apos;s Bazar Airport..."
          hasSwap
        />
        <Field
          label="Departure Date"
          topText="24"
          bottomText="Sat"
          smallText="Feb 24"
          icon="📅"
        />
        <Field
          label="Return Date"
          topText="27"
          bottomText="Tue"
          smallText="Feb 24"
          icon="📅"
        />

        <button className="search-button">
          Search Trip <span style={{ marginLeft: 6 }}>🔍</span>
        </button>
      </div>
    </div>
  );
}

function Field({
  label,
  topText,
  bottomText,
  smallText,
  hasSwap = false,
  icon,
}) {
  return (
    <div className="field">
      <span className="field-label">{label}</span>

      <div className="field-input">
        <div className="field-left">
          <div className="field-top-row">
            <span className="field-top-code">{topText}</span>
            {hasSwap && (
              <span className="field-swap-icon" aria-hidden="true">
                ↔
              </span>
            )}
          </div>
          <div className="field-bottom-main">{bottomText}</div>
          {smallText && <div className="field-bottom-small">{smallText}</div>}
        </div>

        <div className="field-right">
          {icon && <span className="field-icon">{icon}</span>}
          <span className="field-chevron">⌄</span>
        </div>
      </div>
    </div>
  );
}

export default HeroSection;
