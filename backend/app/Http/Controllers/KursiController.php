<?php

namespace App\Http\Controllers;

use App\Models\Kursi;

class KursiController extends Controller
{
    // Ambil semua kursi id_tiket 
    public function byTiket($id)
    {
        $kursi = Kursi::where('id_tiket', $id)->orderBy('kode')->get();

        if ($kursi->isEmpty()) {
            return response()->json(['message' => 'Kursi tidak ditemukan'], 404);
        }

        return response()->json($kursi);
    }
}
