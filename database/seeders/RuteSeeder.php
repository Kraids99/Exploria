<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RuteSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('rutes')->insert([
            ['id_lokasi_asal' => 1, 'id_lokasi_tujuan' => 3],
            ['id_lokasi_asal' => 1, 'id_lokasi_tujuan' => 4],
            ['id_lokasi_asal' => 3, 'id_lokasi_tujuan' => 5],
            ['id_lokasi_asal' => 5, 'id_lokasi_tujuan' => 4],
            ['id_lokasi_asal' => 2, 'id_lokasi_tujuan' => 1],
        ]);
    }
}
