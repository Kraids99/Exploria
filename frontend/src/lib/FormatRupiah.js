export const formatRupiah = (value) => {
  const num = Number(value);
  if (Number.isNaN(num)) return "-";
  return `Rp ${num.toLocaleString("id-ID")}`;
};
