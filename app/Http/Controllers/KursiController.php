<?php

namespace App\Http\Controllers;

use App\Models\Kursi;

class KursiController extends Controller
{
    public function show($id)
    {
        // ngambil semua kursi dari tiket secara urut kode
        $kursi = Kursi::where('id_tiket', $id)->orderBy('kode')->get();

        if(!$kursi){
            return response()->json(['message' => 'Kursi tidak ditemukan'], 404);
        }

        return response()->json($kursi);
    }
}
