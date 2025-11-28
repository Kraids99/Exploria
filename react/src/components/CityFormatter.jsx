export function formatKota(kota) {
    if(!kota) return "Tidak tersedia";
    return kota
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}