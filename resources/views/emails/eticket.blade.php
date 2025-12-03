<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>E-ticket Exploria</title>
    <style>
        /* Style email */
        body { font-family: Arial, sans-serif; background: #f6f6f6; padding: 24px; color: #222; }
        .card { background: #ffffff; border: 1px solid #e0e0e0; border-radius: 8px; padding: 20px; box-shadow: 0 2px 6px rgba(0,0,0,0.06); }
        .title { font-size: 18px; margin: 0 0 12px; }
        .blok { margin: 12px 0; }
        .label { color: #555; width: 160px; display: inline-block; }
        .isi { font-weight: 600; }
        .catatan { background: #f3f7fb; padding: 10px; border-radius: 6px; }
    </style>
</head>
<body>
    <div class="card">
        <!-- {{-- Header email --}} -->
        <h2 class="title">E-ticket Anda Siap</h2>
        <p>Hai {{ $pemesanan->user->nama }},</p>
        <p class="catatan">Pembayaran Anda sudah kami terima. Berikut detail e-ticket.</p>

        <!-- {{-- Isi Pesan --}} -->
        <div class="blok">
            <div><span class="label">Kode E-ticket</span><span class="isi">{{ $pemesanan->kode_tiket}}</span></div>
            <div><span class="label">Status</span><span class="isi">{{ $pemesanan->status_pemesanan }}</span></div>
            <div><span class="label">Tanggal Pesan</span><span class="isi">{{ optional($pemesanan->tanggal_pemesanan)->format('d M Y') }}</span></div>
            <div><span class="label">Total Bayar</span><span class="isi">Rp {{ number_format($pemesanan->total_biaya_pemesanan, 0, ',', '.') }}</span></div>
        </div>

        <!-- {{-- Data relasi --}} -->
        @php
            $rincian = $pemesanan->rincianPemesanan->first();
            $tiket = $rincian?->tiket;
            $company = $tiket?->company;
            $rute = $tiket?->rute;
            $asal = $rute?->asal;
            $tujuan = $rute?->tujuan;
        @endphp

        @if($tiket)
            <!-- {{-- Detail perjalanan --}} -->
            <div class="blok">
                <h3 class="judul">Detail Perjalanan</h3>
                <div><span class="label">Operator</span><span class="isi">{{ $company->nama_company }}</span></div>
                <div><span class="label">Rute</span><span class="isi">{{ ($asal->terminal) }} ({{ $asal->kota }}) - {{ ($tujuan->terminal) }} ({{ $tujuan->kota }})</span></div>
                <div><span class="label">Berangkat</span><span class="isi">{{ optional($tiket->waktu_keberangkatan)->format('d M Y, H:i') }}</span></div>
                <div><span class="label">Tiba</span><span class="isi">{{ optional($tiket->waktu_tiba)->format('d M Y, H:i') }}</span></div>
                <div><span class="label">Jumlah Kursi</span><span class="isi">{{ $rincian->jumlah_tiket }}</span></div>
            </div>
        @endif

        <!-- {{-- Penutup --}} -->
        <p class="blok">Tunjukkan kode e-ticket ini saat boarding/check-in. Terima kasih sudah memakai Exploria.</p>
    </div>
</body>
</html>

<!-- pakai ->? biar gak error kalo null -->