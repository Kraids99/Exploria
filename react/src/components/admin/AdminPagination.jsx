import React from "react";

export default function AdminPagination({
  page,
  totalItems,
  pageSize = 10,
  onChange,
}) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  if (totalPages <= 1) return null;

  const goTo = (target) => {
    if (target < 1 || target > totalPages) return;
    onChange(target);
  };

  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100 bg-slate-50 text-sm text-slate-700">
      <span>
        Halaman {page} dari {totalPages} (total {totalItems} data)
      </span>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => goTo(page - 1)}
          disabled={page === 1}
          className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-100 transition"
        >
          Sebelumnya
        </button>
        <button
          type="button"
          onClick={() => goTo(page + 1)}
          disabled={page === totalPages}
          className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-100 transition"
        >
          Berikutnya
        </button>
      </div>
    </div>
  );
}
