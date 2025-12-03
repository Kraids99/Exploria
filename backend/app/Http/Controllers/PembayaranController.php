<?php

namespace App\Http\Controllers;

use App\Models\Pembayaran;
use Illuminate\Http\Request;
use App\Models\Pemesanan;
use Exception;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use App\Mail\EticketMail;

class PembayaranController extends Controller
{
    // Tampilan semua pembayaran (admin) atau milik sendiri (customer)
    public function index(Request $request)
    {
        $user = $request->user();

        if ($user->tokenCan('admin')) {
            $pembayaran = Pembayaran::with(['pemesanan.user'])->get();
        } else {
            $pembayaran = Pembayaran::with(['pemesanan'])
                ->whereHas('pemesanan', function ($query) use ($user) {
                    $query->where('id_user', $user->id_user);
                })->get();
        }

        return response()->json($pembayaran);
    }

    // Tampilan satu pembayaran berdasarkan id
    public function show($id)
    {
        $pembayaran = Pembayaran::with(['pemesanan'])->find($id);

        if (!$pembayaran) {
            return response()->json(['message' => 'Data pembayaran tidak ditemukan'], 404);
        }

        return response()->json($pembayaran);
    }

    // Tambah pembayaran baru
    public function store(Request $request)
    {   
        //validasi input dari FE
        $request->validate([
            'id_pemesanan' => 'required|exists:pemesanans,id_pemesanan',
            'metode_pembayaran' => 'required|string',
            'jenis_channel' => 'required|in:bank,wallet',
        ]);

        DB::beginTransaction();
        try {
            //pastikan pemesanan ada 
            $pemesanan = Pemesanan::find($request->id_pemesanan);

            if (!$pemesanan) {
                return response()->json(['message' => 'Pemesanan tidak ditemukan'], 404);
            }

            // total bayar diambil dari pemesanan
            $totalBayar = $pemesanan->total_biaya_pemesanan;

            // buat pembayaran baru
            $pembayaran = Pembayaran::create([
                'id_pemesanan' => $request->id_pemesanan,
                'metode_pembayaran' => $request->metode_pembayaran,    // pastikan kolom ini ADA, kalau tidak, hapus baris ini
                'status_pembayaran' => 1,         // atau 'Berhasil' kalau kolom-nya VARCHAR
            ]);

            // update status pemesanan
            $pemesanan->status_pemesanan = 'Sudah Dibayar';
            $pemesanan->save();

            DB::commit();
            return response()->json([
                'message' => 'Pembayaran berhasil dilakukan',
                'data' => $pembayaran,
                // kalau mau, ikut kirim totalBayar biar FE enak:
                'total_bayar' => $totalBayar,
            ], 201);

        } catch (Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Terjadi kesalahan saat memproses pembayaran',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Update status pembayaran (hanya admin)
    public function update(Request $request, $id)
    {
        $request->validate([
            // 0 = belum bayar, 1 = sudah bayar
            'status_pembayaran' => 'required|integer|in:0,1',
            'send_email' => 'sometimes|boolean',
        ]);

        $pembayaran = Pembayaran::with(['pemesanan.user'])->find($id);

        if (!$pembayaran) {
            return response()->json(['message' => 'Data pembayaran tidak ditemukan'], 404);
        }

        $emailAlreadySent = (bool) $pembayaran->mail_tiket;
        $shouldSendEmail = (bool) $request->boolean('send_email');      

        $pembayaran->status_pembayaran = $request->status_pembayaran;
        $pembayaran->save();

        // kalau sudah bayar, sekalian update status_pemesanan
        if($request->status_pembayaran == 1)
        {
            $pemesanan = $pembayaran->pemesanan;
            if($pemesanan)
            {
                $pemesanan->status_pemesanan = 'Sudah Dibayar';
                $pemesanan->save();
            }
        }

        // kirim e-ticket
        $sendTiket = $request->status_pembayaran == 1 && !$emailAlreadySent && $shouldSendEmail;
        if($sendTiket)
        {
            $pemesanan = $pembayaran->pemesanan;
            if($pemesanan && $pemesanan->user?->email) 
            {
                // Muat relasi yang belum di-load agar email punya data lengkap tanpa N+1
                $pemesanan->loadMissing([
                    'user',
                    'rincianPemesanan.tiket.company',
                    'rincianPemesanan.tiket.rute.asal',
                    'rincianPemesanan.tiket.rute.tujuan',
                ]);

                // buat new pemesanan mail
                Mail::to($pemesanan->user->email)->send(new EticketMail($pemesanan));
                $pembayaran->mail_tiket = true;                      // tandai sudah kirim
                $pembayaran->tanggal_pembayaran = now()->toDateString(); // isi tanggal kirim
                $pembayaran->save();
            }
        }

        return response()->json([
            'message' => 'Status pembayaran berhasil diupdate',
            'data' => $pembayaran
        ]);
    }

}
