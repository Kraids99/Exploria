import { useEffect, useState } from "react";
import { getTiketByParams } from "../../api/customer/apiTiket.jsx";
import { useNavigate } from "react-router-dom";
import Pagination from "../Pagination.jsx";

export default function Tikets({ fromCity, toCity, date }) {
  const [tikets, setTikets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 5;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTiket = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getTiketByParams(fromCity, toCity, date);
        console.log("data getTiketByParams =", data);

        const list = Array.isArray(data)
          ? data
          : Array.isArray(data.data)
          ? data.data
          : [];

        setTikets(list);
        setPage(1);
      } catch (err) {
        console.log(err);
        setError("Gagal mengambil data tiket");
      } finally {
        setLoading(false);
      }
    };

    if (fromCity && toCity && date) {
      fetchTiket();
    } else {
      setTikets([]);
    }
  }, [fromCity, toCity, date]);

  if (loading) return <p className="text-sm text-slate-600">Loading tiket...</p>;
  if (error) return <p className="text-red-500 text-sm">{error}</p>;
  if (!tikets || tikets.length === 0)
    return <p className="text-sm text-slate-600">Tidak ada tiket untuk rute ini.</p>;

  const startIndex = (page - 1) * pageSize;
  const paginatedTikets = tikets.slice(startIndex, startIndex + pageSize);

  return (
    <div className="space-y-4">
      {paginatedTikets.map((tiket) => (
        <article
          key={tiket.id_tiket}
          className="rounded-3xl border border-slate-100 bg-white px-4 py-4 md:px-6 md:py-5 shadow-sm"
        >
          <div className="text-center md:text-left">
            <h3 className="text-base md:text-xl font-semibold text-slate-900">
              {tiket.nama_tiket}
            </h3>
            <p className="text-[11px] md:text-xs text-slate-500">
              {tiket.company?.nama_company}
            </p>
          </div>

          <div className="mt-3 mb-4 h-px w-full bg-slate-200" />

          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="text-center md:text-left">
              <p className="text-lg font-semibold text-slate-900">
                {tiket.waktu_keberangkatan?.substring(11, 16)}
              </p>
              <p className="text-sm text-slate-800">{tiket.rute?.asal?.kota}</p>
              <p className="text-[11px] text-slate-500">
                {tiket.rute?.asal?.terminal}
              </p>
            </div>

            <div className="text-center text-[11px] text-slate-500 md:text-left">
              {tiket.durasi} menit
            </div>

            <div className="text-center md:text-left">
              <p className="text-lg font-semibold text-slate-900">
                {tiket.waktu_tiba?.substring(11, 16)}
              </p>
              <p className="text-sm text-slate-800">{tiket.rute?.tujuan?.kota}</p>
              <p className="text-[11px] text-slate-500">
                {tiket.rute?.tujuan?.terminal}
              </p>
            </div>

            <div className="flex flex-col items-center md:items-end gap-1">
              <p className="text-xs text-slate-500">Harga mulai dari</p>
              <p className="text-lg font-bold text-brand-500">
                Rp {Number(tiket.harga).toLocaleString()}
              </p>

              <button
                className="mt-2 rounded-full bg-[#f38f4a] 
                px-5 py-2 text-xs font-semibold text-white
                shadow-md transition-all duration-200 ease-out
                hover:bg-[#cf4230] transition-colors"
                onClick={() =>
                  navigate(
                    `/detailTiket/${tiket.id_tiket}?from=${fromCity}&to=${toCity}&date=${date}`
                  )
                }
              >
                Pilih
              </button>
            </div>
          </div>
        </article>
      ))}
      <Pagination
        page={page}
        totalItems={tikets.length}
        pageSize={pageSize}
        onChange={setPage}
      />
    </div>
  );
}
