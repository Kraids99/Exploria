<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RincianPemesananSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('rincian_pemesanans')->insert([
            'id_tiket' => 11,
            'id_pemesanan' => 1,
            'jumlah_tiket' => 2,
        ]);

    }
}



