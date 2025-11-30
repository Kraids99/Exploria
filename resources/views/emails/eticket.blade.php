<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>E-ticket Exploria</title>
    <style>
        body { font-family: Arial, sans-serif; background: grey; padding: 24px; color: #222; }
        .card { background: white; border-radius: 8px; padding: 20px; box-shadow: 0 4px 12px rgba(0,0,0,0.08); }
        .title { font-size: 18px; margin: 0 0 12px; }
        .section { margin: 12px 0; }
        .label { color: #555; width: 160px; display: inline-block; }
        .value { font-weight: 600; }
        .highlight { background: #e8f5e9; padding: 10px; border-radius: 6px; }
    </style>
</head>
<body>
    <div class="card">
        <h2 class="title">E-ticket Anda Siap</h2>
        <p>Hai {{ $pemesanan->user->nama }},</p>
        <p class="highlight">Pembayaran Anda sudah kami terima. Berikut detail e-ticket.</p>

        <div class="section">
            <div><span class="label">Kode E-ticket</span><span class="value">{{ $pemesanan->kode_tiket}}</span></div>
            <div><span class="label">Status</span><span class="value">{{ $pemesanan->status_pemesanan }}</span></div>
            <div><span class="label">Tanggal Pesan</span><span class="value">{{ optional($pemesanan->tanggal_pemesanan)->format('d M Y') }}</span></div>
            <div><span class="label">Total Bayar</span><span class="value">Rp {{ number_format($pemesanan->total_biaya_pemesanan, 0, ',', '.') }}</span></div>
        </div>

        @php
            $rincian = $pemesanan->rincianPemesanan->first();
            $tiket = $rincian?->tiket;
            $company = $tiket?->company;
            $rute = $tiket?->rute;
            $asal = $rute?->asal;
            $tujuan = $rute?->tujuan;
        @endphp

        @if($tiket)
            <div class="section">
                <h3 class="title">Detail Perjalanan</h3>
                <div><span class="label">Operator</span><span class="value">{{ $company->nama_company }}</span></div>
                <div><span class="label">Rute</span><span class="value">{{ ($asal->terminal) }} ({{ $asal->kota }}) → {{ ($tujuan->terminal) }} ({{ $tujuan->kota }})</span></div>
                <div><span class="label">Berangkat</span><span class="value">{{ optional($tiket->waktu_keberangkatan)->format('d M Y, H:i') }}</span></div>
                <div><span class="label">Tiba</span><span class="value">{{ optional($tiket->waktu_tiba)->format('d M Y, H:i') }}</span></div>
                <div><span class="label">Jumlah Kursi</span><span class="value">{{ $rincian->jumlah_tiket }}</span></div>
            </div>
        @endif

        <p class="section">Tunjukkan kode e-ticket ini saat boarding/check-in. Terima kasih sudah memakai Exploria.</p>
    </div>
</body>
</html>
