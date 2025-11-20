import logoH from "../../assets/logo-h.jpg"; 

function Footer() {
  return (
    <footer className="mt-4 bg-slate-950 text-slate-200">
      <div className="mx-auto max-w-6xl px-4 py-10">
       

        {/* Top Footer */}
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div>
            <div className="flex items-center gap-2">
                    <div className="flek items-center gap-3">
                        <img 
                            src={logoH} 
                            alt="Exploria"
                            className="h-10 w-auto rounded-full" />
                    </div>                
              <span className="text-lg font-semibold tracking-tight text-white">
                Exploria
              </span>
            </div>
            <p className="mt-3 text-xs text-slate-400">
              Platform pemesanan tiket bus online untuk perjalanan yang lebih
              mudah dan nyaman.
            </p>
          </div>

          <div className="grid gap-6 text-xs text-slate-300 md:grid-cols-3">
            <div className="space-y-2">
              <h4 className="text-[11px] font-semibold text-slate-100">
                MENU
              </h4>
              <p>Contact Us</p>
              <p>About</p>
            </div>
            <div className="space-y-2">
              <h4 className="text-[11px] font-semibold text-slate-100">
                LEGAL
              </h4>
              <p>Term &amp; Conditions</p>
              <p>Privacy Policy</p>
            </div>
            <div className="space-y-2">
              <h4 className="text-[11px] font-semibold text-slate-100">
                LAINNYA
              </h4>
              <p>Help Center</p>
              <p>FAQ</p>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-8 border-t border-slate-800 pt-4 text-[11px] text-slate-500">
          Copyright © {new Date().getFullYear()} Exploria
        </div>
      </div>
    </footer>
  );
}

export default Footer;
