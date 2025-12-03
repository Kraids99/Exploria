<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Carbon;

class PemesananSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('pemesanans')->insert([
            'id_user' => 2,
            'tanggal_pemesanan' => '2025-12-01',
            'total_biaya_pemesanan' => 155000 * 2,
            'status_pemesanan' => 'Sudah Dibayar',
            'kode_tiket' => 'EXP-SEED-TEST',
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ]);

    }
}
