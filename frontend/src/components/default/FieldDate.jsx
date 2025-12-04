function FieldDate({ label, value, onChange }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50/70 px-4 py-3 text-xs md:text-sm">
      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
        {label}
      </p>
      <input
        type="date"
        value={value}
        onChange={onChange}
        className="mt-1 w-full bg-transparent text-xs font-semibold text-slate-800 outline-none md:text-sm"
      />
    </div>
  );
}

export default FieldDate; 