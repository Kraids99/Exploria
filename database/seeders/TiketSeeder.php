<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TiketSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('tikets')->insert([
            [
                'id_rute' => 1,
                'id_company' => 1,
                'nama_tiket' => 'Yogyakarta - Semarang (Pagi)',
                'jumlah_kursi' => 40,
                'waktu_keberangkatan' => '2025-11-20 08:00:00',
                'waktu_tiba' => '2025-11-20 20:00:00',
                'durasi' => 12,
                'harga' => 350000,
                'stok' => 40,
            ],
            [
                'id_rute' => 2,
                'id_company' => 1,
                'nama_tiket' => 'Jakarta - Bandung (Sore)',
                'jumlah_kursi' => 30,
                'waktu_keberangkatan' => '2025-11-20 15:00:00',
                'waktu_tiba' => '2025-11-20 18:00:00',
                'durasi' => 3,
                'harga' => 120000,
                'stok' => 30,
            ],
            [
                'id_rute' => 3,
                'id_company' => 2,
                'nama_tiket' => 'Malang - Yogyakarta (Malam)',
                'jumlah_kursi' => 50,
                'waktu_keberangkatan' => '2025-11-20 21:00:00',
                'waktu_tiba' => '2025-11-21 05:00:00',
                'durasi' => 8,
                'harga' => 250000,
                'stok' => 50,
            ],
        ]);
    }
}
