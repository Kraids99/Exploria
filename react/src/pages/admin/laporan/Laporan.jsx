import React, { useEffect, useMemo, useRef, useState } from "react";
import NavbarAdmin from "../../../components/default/NavbarAdmin.jsx";
import { Loader2, TrendingUp, AlertCircle } from "lucide-react";
import Chart from "chart.js/auto";
import { fetchPembayaran } from "../../../api/apiPembayaran.jsx";

const rupiah = (value) => {
  if (value === 0 || value) return `Rp ${value}`;
  return "-";
};

const formatDateLabel = (dateStr) => {
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return "-";
  const pad = (n) => String(n).padStart(2, "0");
  return `${pad(d.getMonth() + 1)}/${pad(d.getDate())}`;
};

export default function Laporan() {
  const [data, setData] = useState([]);
  const [days, setDays] = useState(7);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    load();
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
        chartInstance.current = null;
      }
    };
  }, [days]);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetchPembayaran();
      const items = Array.isArray(res) ? res : [];
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - (days - 1));

      // filter paid & range
      const paid = items.filter((p) => {
        const statusPaid = Number(p.status_pembayaran) === 1;
        const tgl = p.pemesanan?.tanggal_pemesanan;
        const dt = tgl ? new Date(tgl) : null;
        const inRange = dt && dt >= cutoff;
        return statusPaid && inRange;
      });

      // group by date (YYYY-MM-DD)
      const grouped = paid.reduce((acc, cur) => {
        const tgl = cur.pemesanan?.tanggal_pemesanan?.slice(0, 10);
        if (!tgl) return acc;
        acc[tgl] = (acc[tgl] || 0) + Number(cur.pemesanan?.total_biaya_pemesanan || 0);
        return acc;
      }, {});

      const sortedDates = Object.keys(grouped).sort();
      const rows = sortedDates.map((tgl) => ({
        label: formatDateLabel(tgl),
        total: grouped[tgl],
      }));

      setData(rows);
    } catch (err) {
      setError(err?.message || "Gagal memuat data laporan");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!chartRef.current || !data.length) return;

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext("2d");
    chartInstance.current = new Chart(ctx, {
      type: "line",
      data: {
        labels: data.map((d) => d.label),
        datasets: [
          {
            label: "Penjualan",
            data: data.map((d) => d.total),
            borderColor: "#ea580c",
            backgroundColor: "rgba(234, 88, 12, 0.2)",
            tension: 0.3,
            fill: true,
            pointRadius: 4,
          },
        ],
      },
      options: {
        plugins: { legend: { display: false } },
        scales: {
          y: {
            ticks: {
              callback: (val) => rupiah(val),
            },
            grid: { color: "#f97316" },
          },
          x: {
            grid: { display: false },
          },
        },
      },
    });
  }, [data]);

  const totalPendapatan = useMemo(
    () => data.reduce((sum, d) => sum + (d.total || 0), 0),
    [data]
  );

  return (
    <div className="min-h-screen flex bg-orange-50">
      <NavbarAdmin />
      <main className="flex-1 p-6 lg:p-10">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div>
            <h1 className="text-2xl font-semibold text-orange-900">
              Laporan Penjualan
            </h1>
            <p className="text-sm text-orange-700 mt-1">
              Grafik penjualan tiket berdasarkan tanggal pembayaran.
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          <div className="rounded-xl bg-white border border-orange-100 p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-orange-100 text-orange-700">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-600">Total Pendapatan</p>
                <p className="text-lg font-semibold text-orange-900">
                  {rupiah(totalPendapatan)}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 rounded-2xl bg-white border border-orange-100 shadow-sm p-4">
          {loading ? (
            <div className="h-72 flex items-center justify-center text-orange-700">
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
              Memuat grafik...
            </div>
          ) : error ? (
            <div className="h-72 flex items-center justify-center text-red-600 gap-2 text-sm">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          ) : !data.length ? (
            <div className="h-72 flex items-center justify-center text-sm text-orange-800">
              Belum ada pendapatan
            </div>
          ) : (
            <canvas ref={chartRef} className="w-full h-72" />
          )}
        </div>
      </main>
    </div>
  );
}
