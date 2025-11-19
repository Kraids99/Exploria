<?php

namespace App\Http\Controllers;

use App\Models\Pembayaran;
use Illuminate\Http\Request;
use App\Models\Pemesanan;
use Exception;
use Illuminate\Support\Facades\DB;

class PembayaranController extends Controller
{
    // Tampilkan semua pembayaran (admin) atau milik sendiri (customer)
    public function index(Request $request)
    {
        $user = $request->user();

        if($user->tokenCan('admin')){
            $pembayaran = Pembayaran::with(['pemesanan.user'])->get();
        }else{
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

        if(!$pembayaran){
            return response()->json(['message' => 'Data pembayaran tidak ditemukan'], 404);
        }

        return response()->json($pembayaran);
    }

    // Tambah pembayaran baru
    public function store(Request $request)
    {
        $request->validate([
            'id_pemesanan' => 'required|exists:pemesanans,id_pemesanan',
            'metode_pembayaran' => 'required|string|max:50',
            'total_bayar' => 'required|numeric|min:0',
        ]);

        DB::beginTransaction();
        try {
            $pemesanan = Pemesanan::find($request->id_pemesanan);

            if(!$pemesanan){
                return response()->json(['message' => 'Pemesanan tidak ditemukan'], 404);
            }

            // buat pembayaran baru
            $pembayaran = Pembayaran::create([
                'id_pemesanan' => $request->id_pemesanan,
                'metode_pembayaran' => $request->metode_pembayaran,
                'tanggal_pembayaran' => now(),
                'total_bayar' => $request->total_bayar,
                'status_pembayaran' => 'Berhasil',
            ]);

            // update status pemesanan
            $pemesanan->status_pemesanan = 'Sudah Dibayar';
            $pemesanan->save();

            DB::commit();
            return response()->json([
                'message' => 'Pembayaran berhasil dilakukan',
                'data' => $pembayaran
            ], 201);

        }catch(Exception $e){
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
            'status_pembayaran' => 'required|string',
        ]);

        $pembayaran = Pembayaran::find($id);

        if(!$pembayaran){
            return response()->json(['message' => 'Data pembayaran tidak ditemukan'], 404);
        }

        $pembayaran->update(['status_pembayaran' => $request->status_pembayaran]);

        return response()->json([
            'message' => 'Status pembayaran berhasil diupdate',
            'data' => $pembayaran
        ]);
    }
}
