<?php

namespace App\Http\Controllers;

use App\Models\Lokasi;
use Illuminate\Http\Request;

class LokasiController extends Controller
{
    // Tampilkan semua lokasi
    public function index()
    {
        $lokasi = Lokasi::all();
        return response()->json($lokasi);
    }

    // Tampilkan satu lokasi berdasarkan id
    public function show($id)
    {
        $lokasi = Lokasi::find($id);

        if (!$lokasi) {
            return response()->json(['message' => 'Lokasi tidak ditemukan'], 404);
        }
        return response()->json($lokasi);
    }

    // Tambah lokasi baru (admin only)
    public function store(Request $request)
    {
        $request->validate([
            'terminal' => 'required|string|max:255',
            'kota' => 'required|string|max:255',
        ]);

        $lokasi = Lokasi::create([
            'terminal' => $request->terminal,
            'kota' => $request->kota,
        ]);

        return response()->json([
            'message' => 'Lokasi berhasil ditambahkan',
            'data' => $lokasi
        ], 201);
    }

    // update lokasi (admin only)
    public function update(Request $request, $id)
    {
        $lokasi = Lokasi::find($id);

        if (!$lokasi) {
            return response()->json(['message' => 'Lokasi tidak ditemukan'], 404);
        }

        $request->validate([
            'terminal' => 'sometimes|string|max:255',
            'kota' => 'sometimes|string|max:255',
        ]);

        $lokasi->update($request->all());

        return response()->json([
            'message' => 'Lokasi berhasil diupdate',
            'data' => $lokasi
        ]);
    }

    // hapus lokasi (admin only)
    public function destroy($id)
    {
        $lokasi = Lokasi::find($id);

        if (!$lokasi) {
            return response()->json(['message' => 'Lokasi tidak ditemukan'], 404);
        }

        //jika lokasi masih dipakai rute
        if ($lokasi->ruteAsal()->exists() || $lokasi->ruteTujuan()->exists()) {
            return response()->json(['message' => 'Lokasi masih dipakai di rute, tidak bisa dihapus'], 422);
        }

        $lokasi->delete();

        return response()->json(['message' => 'Lokasi berhasil dihapus']);
    }
}
