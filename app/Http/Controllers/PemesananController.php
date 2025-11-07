<?php

namespace App\Http\Controllers;

use App\Models\Pemesanan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PemesananController extends Controller
{
    /**
     * Menampilkan semua pemesanan milik user (customer)
     */
    public function index()
    {
        $user = Auth::user();

        $pemesanan = Pemesanan::where('id_user', $user->id_user)
            ->with(['rincianPemesanan.tiket'])
            ->get();

        return response()->json([
            'message' => 'Daftar pemesanan milik user',
            'data' => $pemesanan
        ]);
    }

    /**
     * Membuat pemesanan baru
     */
    public function store(Request $request)
    {
        $user = Auth::user();

        $request->validate([
            'total_biaya_pemesanan' => 'required|numeric|min:0',
            'status_pemesanan' => 'required|string|max:100'
        ]);

        $pemesanan = Pemesanan::create([
            'id_user' => $user->id_user,
            'tanggal_pemesanan' => now(),
            'total_biaya_pemesanan' => $request->total_biaya_pemesanan,
            'status_pemesanan' => $request->status_pemesanan
        ]);

        return response()->json([
            'message' => 'Pemesanan berhasil dibuat',
            'data' => $pemesanan
        ], 201);
    }

    /**
     * Lihat detail pemesanan spesifik
     */
    public function show($id)
    {
        $user = Auth::user();

        $pemesanan = Pemesanan::where('id_pemesanan', $id)
            ->where('id_user', $user->id_user)
            ->with(['rincianPemesanan.tiket'])
            ->first();

        if (!$pemesanan) {
            return response()->json(['message' => 'Pemesanan tidak ditemukan'], 404);
        }

        return response()->json([
            'message' => 'Detail pemesanan ditemukan',
            'data' => $pemesanan
        ]);
    }

    /**
     * Update status atau data pemesanan
     */
    public function update(Request $request, $id)
    {
        $user = Auth::user();

        $pemesanan = Pemesanan::where('id_pemesanan', $id)
            ->where('id_user', $user->id_user)
            ->first();

        if (!$pemesanan) {
            return response()->json(['message' => 'Pemesanan tidak ditemukan'], 404);
        }

        $request->validate([
            'status_pemesanan' => 'sometimes|string|max:100',
            'total_biaya_pemesanan' => 'sometimes|numeric|min:0'
        ]);

        $pemesanan->update($request->only(['status_pemesanan', 'total_biaya_pemesanan']));

        return response()->json([
            'message' => 'Pemesanan berhasil diupdate',
            'data' => $pemesanan
        ]);
    }

    /**
     * Hapus pemesanan
     */
    public function destroy($id)
    {
        $user = Auth::user();

        $pemesanan = Pemesanan::where('id_pemesanan', $id)
            ->where('id_user', $user->id_user)
            ->first();

        if (!$pemesanan) {
            return response()->json(['message' => 'Pemesanan tidak ditemukan'], 404);
        }

        $pemesanan->delete();

        return response()->json(['message' => 'Pemesanan berhasil dihapus']);
    }
}
