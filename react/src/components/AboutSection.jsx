// src/components/AboutSection.jsx

function AboutSection() {
  return (
    <section className="about-section">
      <div className="about-image">
        {/* ganti src dengan gambar tim dari Figma kamu */}
        <img
          src="https://images.pexels.com/photos/8867431/pexels-photo-8867431.jpeg?auto=compress&w=1200"
          alt="Customer service team"
        />
      </div>

      <div>
        <div className="about-text-eyebrow">Tentang Kami</div>
        <h2 className="about-title">
          Explor<span>ia</span>
        </h2>
        <p className="about-paragraph">
          Exploria adalah aplikasi pemesanan tiket bus yang bekerja sama dengan
          berbagai perusahaan bus terpercaya. Kami memudahkan pengguna untuk
          memesan tiket tanpa biaya tambahan, melakukan pembayaran online yang
          aman dan nyaman, serta memilih tempat duduk sesuai keinginan agar
          perjalanan menjadi lebih mudah dan menyenangkan.
        </p>
      </div>
    </section>
  );
}

export default AboutSection;
