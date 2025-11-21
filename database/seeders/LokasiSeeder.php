<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class LokasiSeeder extends Seeder
{
    public function run()
    {
        DB::table('lokasis')->insert([
            ['terminal' => 'Terminal Jombor', 'kota' => 'Yogyakarta'],
            ['terminal' => 'Terminal Giwangan', 'kota' => 'Yogyakarta'],
            ['terminal' => 'Terminal Terboyo', 'kota' => 'Semarang'],
            ['terminal' => 'Kampung Rambutan', 'kota' => 'Jakarta'],
            ['terminal' => 'Leuwipanjang', 'kota' => 'Bandung'],
        ]);
    }
}
