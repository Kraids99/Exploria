import { useState } from "react";
import heroBus from "../../assets/dashboard.jpg"; 
import "../../style/landingpage/dashboard.css"; 
import "../../App.css";

function Dashboard() {

  const[form, setForm] = useState({
    asalLokasi:"",
    tujuanLokasi:"",
    tglBerangkat:"",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((data) => ({ ...data, [name]: value}));
  };

  const handleSubmit = () => {
    console.log("Data dikirim: ", form); 
  }
  return (
    <section className="dashboard">
      {/* BACKGROUND GAMBAR */}
      <div className="dashboard-bg">
        <img src={heroBus} alt="Exploria bus" />
      </div>

      {/* LAPISAN KONTEN DI ATAS GAMBAR */}
      <div className="dashboard-overlay">
        <div className="dashboard-inner">
          {/* TEKS KANAN */}
          <div className="dashboard-text-block">
            <p className="dashboard-mini">Tiket Bus Reservasi</p>
            <h1 className="dashboard-title">
               Dunia ini begitu luas,
              <br />
              <span className="dashboard-highlight">Ayo jelajahi!</span>
            </h1>
          </div>

          {/* CARD SEARCH DI BAGIAN BAWAH */}
          <div className="dashboard-search-wrapper">
            <SearchCard 
               asalLokasi={form.asalLokasi}
               tujuanLokasi={form.tujuanLokasi}
               tglBerangkat={form.tglBerangkat}
               onChange={handleChange}
               onSubmit={handleSubmit}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function SearchCard(asalLokasi, tujuanLokasi, tglBerangkat, onChange, onSubmit) {
  return (
    <div className="search-card">

      {/* Field-field pencarian */}
      <div className="search-fields">
        <Field
          label="Lokasi Asal"
          name="asalLokasi"
          value={asalLokasi}
          onChange={onChange}
        />
        <Field
          label="Lokasi Tujuan"
          name="tujuanLokasi"
          value={tujuanLokasi}
          onChange={onChange}
        />
        <Field
          label="Tanggal Berangkat"
          name="tglBerangkat"
          type="date"
          value={tglBerangkat}
          onChange={onChange}
        />

        <button className="search-button" onClick={onSubmit}>
          Cari
        </button>
      </div>
    </div>
  );
}

function Field({
  label,
  name,
  value, 
  type = "text",
  onChange
}) {
  return (
    <div className="field">
      <span className="field-label">{label}</span>

      <div className="field-input">
        <input
          className="field-input-control"
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={label}
        />

        <div className="field-right">
          {type !== "date" && <span className="field-chevron">⌄</span>}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
