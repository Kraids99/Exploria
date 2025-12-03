<?php

namespace App\Http\Controllers;

use App\Models\Rute;
use Illuminate\Http\Request;

class RuteController extends Controller
{
    // Tampilkan semua rute
    public function index()
    {
        $rutes = Rute::with(['asal', 'tujuan'])->get();

        return response()->json($rutes);
    }

    // Tampilkan satu rute berdasarkan id
    public function show($id)
    {
        $rute = Rute::with(['asal', 'tujuan'])->find($id);

        if (!$rute) {
            return response()->json(['message' => 'Rute tidak ditemukan'], 404);
        }

        return response()->json($rute);
    }

    // tambah rute baru (admin only)
    public function store(Request $request)
    {
        $request->validate([
            'id_lokasi_asal' => 'required|exists:lokasis,id_lokasi',
            'id_lokasi_tujuan' => 'required|exists:lokasis,id_lokasi',
        ]);

        $rute = Rute::create([
            'id_lokasi_asal' => $request->id_lokasi_asal,
            'id_lokasi_tujuan' => $request->id_lokasi_tujuan,
        ]);

        return response()->json([
            'message' => 'Rute berhasil ditambahkan',
            'data' => $rute
        ], 201);
    }

    // update rute (admin only)
    public function update(Request $request, $id)
    {
        $rute = Rute::find($id);

        if (!$rute) {
            return response()->json(['message' => 'Rute tidak ditemukan'], 404);
        }

        $request->validate([
            'id_lokasi_asal' => 'sometimes|exists:lokasis,id_lokasi',
            'id_lokasi_tujuan' => 'sometimes|exists:lokasis,id_lokasi',
        ]);

        $rute->update($request->all());

        return response()->json([
            'message' => 'Rute berhasil diupdate',
            'data' => $rute
        ]);
    }

    // Hapus rute (admin only)
    public function destroy($id)
    {
        $rute = Rute::find($id);

        if (!$rute) {
            return response()->json(['message' => 'Rute tidak ditemukan'], 404);
        }

        // Jika rute masih dipakai tiket
        if ($rute->tikets()->exists()) {
            return response()->json(['message' => 'Rute masih memiliki tiket, tidak bisa dihapus'], 422);
        }

        $rute->delete();

        return response()->json(['message' => 'Rute berhasil dihapus']);
    }
}
