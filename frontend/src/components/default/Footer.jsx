import logoH from "../../assets/logo-h.jpg";

export default function Footer() {
  return (
    <footer className="bg-[#020617] text-white">
      <div className="mx-auto max-w-6xl px-4 py-10">
        {/* Top Footer */}
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          {/* Brand + deskripsi */}
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center gap-2 md:justify-start">
              <div className="flex items-center gap-3">
                <img
                  src={logoH}
                  alt="Exploria"
                  className="h-10 w-auto rounded-full"
                />
              </div>
              <span className="text-lg font-semibold tracking-tight text-white">
                Exploria
              </span>
            </div>
            <p className="mt-3 text-xs text-slate-400 max-w-sm mx-auto md:mx-0">
              Platform pemesanan tiket bus online untuk perjalanan yang lebih
              mudah dan nyaman.
            </p>
          </div>

          {/* Menu kolom */}
          <div className="grid gap-6 text-xs text-slate-300 sm:grid-cols-2 md:grid-cols-3">
            <div className="space-y-2 text-center md:text-left">
              <h4 className="text-[11px] font-semibold text-slate-100">
                MENU
              </h4>
              <p>Contact Us</p>
              <p>About</p>
            </div>
            <div className="space-y-2 text-center md:text-left">
              <h4 className="text-[11px] font-semibold text-slate-100">
                LEGAL
              </h4>
              <p>Term &amp; Conditions</p>
              <p>Privacy Policy</p>
            </div>
            <div className="space-y-2 text-center md:text-left">
              <h4 className="text-[11px] font-semibold text-slate-100">
                LAINNYA
              </h4>
              <p>Help Center</p>
              <p>FAQ</p>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-8 border-t border-slate-800 pt-4 text-[11px] text-slate-500 text-center md:text-left">
          Copyright © {new Date().getFullYear()} Exploria
        </div>
      </div>
    </footer>
  );
}
