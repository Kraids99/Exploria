import about from "../../assets/about.jpg";

function AboutSection() {
  return (
    <section className="bg-white py-16">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-10 px-4 md:flex-row">
        {/* Gambar */}
        <div className="flex-1 w-full">
          <div className="overflow-hidden rounded-[32px] bg-slate-100 shadow-md">
            <img
              src={about}
              alt="Customer service"
              className="h-64 w-full object-cover md:h-72"
            />
          </div>
        </div>

        {/* Teks */}
        <div className="flex-1 space-y-4 text-center md:text-left">
          <h2 className="text-2xl font-bold text-slate-900 md:text-3xl">
            <span className="text-brand-500">Exploria</span> adalah partner
            perjalananmu
          </h2>
          <p className="text-sm leading-relaxed text-slate-700 md:text-[15px]">
            Exploria adalah aplikasi pemesanan tiket bus yang bekerja sama
            dengan berbagai perusahaan bus terpercaya, memudahkan pengguna
            untuk memesan tiket tanpa biaya tambahan, melakukan pembayaran
            online yang aman dan nyaman, serta memilih tempat duduk sesuai
            keinginan.
          </p>
          <p className="text-sm leading-relaxed text-slate-700 md:text-[15px]">
            Kami membantu perjalanan menjadi lebih mudah, cepat, dan
            menyenangkan bagi keluarga, teman, maupun perjalanan bisnis.
          </p>
        </div>
      </div>
    </section>
  );
}

export default AboutSection;
