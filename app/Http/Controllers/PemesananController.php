<?php

namespace App\Http\Controllers;

use App\Models\Pemesanan;
use App\Models\RincianPemesanan;
use App\Models\Tiket;
use Illuminate\Http\Request;
use Exception;
use Illuminate\Support\Facades\DB;

class PemesananController extends Controller
{
    // Tampilkan semua pemesanan (admin) atau milik sendiri (customer)
    public function index(Request $request)
    {
        $user = $request->user();

        if($user->tokenCan('admin')){
            $data = Pemesanan::with(['user', 'rincian.tiket'])->get();
        }else{
            $data = Pemesanan::with(['rincian.tiket'])
                ->where('id_user', $user->id_user)
                ->get();
        }

        return response()->json($data);
    }

    // Tampilkan satu pemesanan berdasarkan id
    public function show($id)
    {
        $pemesanan = Pemesanan::with(['user', 'rincian.tiket', 'pembayaran'])->find($id);

        if(!$pemesanan){
            return response()->json(['message' => 'Pemesanan tidak ditemukan'], 404);
        }

        return response()->json($pemesanan);
    }

    // Tambah pemesanan baru
    public function store(Request $request)
    {
        $request->validate([
            'id_user' => 'required|exists:users,id_user',
            'id_tiket' => 'required|exists:tikets,id_tiket',
            'jumlah_tiket' => 'required|integer|min:1',
        ]);

        try{
            DB::beginTransaction();

            $tiket = Tiket::findOrFail($request->id_tiket);

            // pastikan stok cukup
            if($tiket->stok < $request->jumlah_tiket){
                return response()->json(['message' => 'Stok tiket tidak mencukupi'], 400);
            }

            // kurangi stok tiket
            $tiket->stok -= $request->jumlah_tiket;
            $tiket->save();

            // buat pemesanan utama
            $pemesanan = Pemesanan::create([
                'id_user' => $request->id_user,
                'tanggal_pemesanan' => now(),
                'total_biaya_pemesanan' => $tiket->harga * $request->jumlah_tiket,
                'status_pemesanan' => 'Menunggu Pembayaran',
            ]);

            // buat rincian pemesanan
            RincianPemesanan::create([
                'id_pemesanan' => $pemesanan->id_pemesanan,
                'id_tiket' => $tiket->id_tiket,
                'jumlah_tiket' => $request->jumlah_tiket,
            ]);

            DB::commit();

            return response()->json([
                'message' => 'Pemesanan berhasil dibuat',
                'data' => $pemesanan->load(['rincian.tiket'])
            ], 201);

        }catch(Exception $e){
            DB::rollBack();
            return response()->json(['message' => 'Gagal membuat pemesanan', 'error' => $e->getMessage()], 500);
        }
    }

    // Batalkan pemesanan
    public function cancel($id)
    {
        $pemesanan = Pemesanan::find($id);

        if(!$pemesanan){
            return response()->json(['message' => 'Pemesanan tidak ditemukan'], 404);
        }

        if($pemesanan->status_pemesanan === 'Dibatalkan'){
            return response()->json(['message' => 'Pemesanan sudah dibatalkan']);
        }

        // kembalikan stok tiket
        foreach($pemesanan->rincian as $rincian){
            $tiket = Tiket::find($rincian->id_tiket);
            if ($tiket) {
                $tiket->stok += $rincian->jumlah_tiket;
                $tiket->save();
            }
        }

        $pemesanan->update(['status_pemesanan' => 'Dibatalkan']);

        return response()->json(['message' => 'Pemesanan berhasil dibatalkan']);
    }
}
