<?php

namespace App\Http\Controllers;

use App\Models\Kursi;

class KursiController extends Controller
{
    public function byTiket($id)
    {
        $kursi = Kursi::where('id_tiket', $id)
                      ->orderBy('kode')
                      ->get();
        //ini querynya 

        return response()->json([
            'message' => 'Daftar kursi',
            'data'    => $kursi,
        ]);
        //balikin json ke frontend 
    }
    //mengambil semua kursi berdasarkan id_tiket 
}
