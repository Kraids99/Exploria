export function formatTanggalIndonesia(dateString) {
    if(!dateString) return "Tanggal tidak tersedia";

    const bulan = [
        "Januari", "Februari", "Maret", "April", "Mei", "Juni",
        "Juli", "Agustus", "September", "Oktober", "November", "Desember"
    ];

    const hari = [
        "Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"
    ];

    const date = new Date(dateString);
    const namaHari = hari[date.getDay()];
    const tanggal = date.getDate();
    const namaBulan = bulan[date.getMonth()];
    const tahun = date.getFullYear();

    return `${namaHari}, ${tanggal} ${namaBulan} ${tahun}`;
}