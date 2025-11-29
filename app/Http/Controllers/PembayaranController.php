<?php

namespace App\Http\Controllers;

use App\Models\Pembayaran;
use Illuminate\Http\Request;
use App\Models\Pemesanan;
use Exception;
use Illuminate\Support\Facades\DB;

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
        ]);

        $pembayaran = Pembayaran::find($id);

        if (!$pembayaran) {
            return response()->json(['message' => 'Data pembayaran tidak ditemukan'], 404);
        }

        $pembayaran->status_pembayaran = $request->status_pembayaran;
        $pembayaran->save();

        // kalau sudah bayar, sekalian update status_pemesanan
        if ($request->status_pembayaran == 1) {
            $pemesanan = $pembayaran->pemesanan;
            if ($pemesanan) {
                $pemesanan->status_pemesanan = 'Sudah Dibayar';
                $pemesanan->save();
            }
        }

        return response()->json([
            'message' => 'Status pembayaran berhasil diupdate',
            'data' => $pembayaran
        ]);
    }

}
