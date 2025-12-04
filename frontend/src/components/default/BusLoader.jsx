import React from "react";
//untuk loading setiap halaman (manual bentuknya)

function BusLoader({ message = "Sedang memuat data..." }) {
  return (
    <div className="flex flex-col items-center gap-4">
      {/* Area jalan + bus */}
      <div className="relative w-56 h-20">
        {/* Jalan */}
        <div className="absolute bottom-3 left-0 right-0 h-1.5 bg-slate-300 rounded-full" />


        <div className="absolute bottom-4 left-4 right-4 flex justify-between">
          {Array.from({ length: 5 }).map((_, i) => (
            <span key={i} className="w-4 h-0.5 bg-slate-200 rounded-full" />
          ))}
        </div>

        {/* Bus */}
        <div className="bus-loader-bus">
          {/* jendela */}
          <div className="flex gap-1 px-2 pt-1">
            <span className="w-3 h-3 rounded-sm bg-sky-100/90" />
            <span className="w-3 h-3 rounded-sm bg-sky-100/90" />
            <span className="w-3 h-3 rounded-sm bg-sky-100/90" />
          </div>
          {/* pintu */}
          <div className="absolute right-2 bottom-3 w-3 h-5 bg-orange-300/80 rounded-sm" />

          {/* roda */}
          <div className="absolute -bottom-2 left-2 flex gap-5">
            <span className="w-4 h-4 rounded-full bg-slate-800 border-2 border-slate-900" />
            <span className="w-4 h-4 rounded-full bg-slate-800 border-2 border-slate-900" />
          </div>
        </div>
      </div>

      {/* Teks di bawah loader */}
      <p className="text-sm text-slate-500">{message}</p>
    </div>
  );
}

export default BusLoader; 