<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TiketSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('tikets')->insert([
            // ==== RUTE 1: Yogyakarta -> Semarang ====
            [
                'id_rute' => 1,
                'id_company' => 1,
                'nama_tiket' => 'Yogyakarta - Semarang (Pagi)',
                'jumlah_kursi' => 40,
                'waktu_keberangkatan' => '2025-11-20 08:00:00',
                'waktu_tiba' => '2025-11-20 12:00:00',
                'durasi' => 4,
                'harga' => 150000,
                'stok' => 40,
            ],
            [
                'id_rute' => 1,
                'id_company' => 2,
                'nama_tiket' => 'Yogyakarta - Semarang (Malam)',
                'jumlah_kursi' => 45,
                'waktu_keberangkatan' => '2025-11-20 20:00:00',
                'waktu_tiba' => '2025-11-21 00:00:00',
                'durasi' => 4,
                'harga' => 155000,
                'stok' => 45,
            ],

            // ==== RUTE 2: Yogyakarta -> Jakarta ====
            [
                'id_rute' => 2,
                'id_company' => 1,
                'nama_tiket' => 'Yogyakarta - Jakarta (Siang)',
                'jumlah_kursi' => 30,
                'waktu_keberangkatan' => '2025-11-21 13:00:00',
                'waktu_tiba' => '2025-11-21 21:00:00',
                'durasi' => 8,
                'harga' => 350000,
                'stok' => 30,
            ],
            [
                'id_rute' => 2,
                'id_company' => 2,
                'nama_tiket' => 'Yogyakarta - Jakarta (Malam)',
                'jumlah_kursi' => 35,
                'waktu_keberangkatan' => '2025-11-21 21:00:00',
                'waktu_tiba' => '2025-11-22 05:00:00',
                'durasi' => 8,
                'harga' => 360000,
                'stok' => 35,
            ],

            // ==== RUTE 3: Jakarta -> Bandung ====
            [
                'id_rute' => 3,
                'id_company' => 1,
                'nama_tiket' => 'Jakarta - Bandung (Pagi)',
                'jumlah_kursi' => 32,
                'waktu_keberangkatan' => '2025-11-22 07:00:00',
                'waktu_tiba' => '2025-11-22 11:00:00',
                'durasi' => 4,
                'harga' => 120000,
                'stok' => 32,
            ],
            [
                'id_rute' => 3,
                'id_company' => 2,
                'nama_tiket' => 'Jakarta - Bandung (Sore)',
                'jumlah_kursi' => 32,
                'waktu_keberangkatan' => '2025-11-22 16:00:00',
                'waktu_tiba' => '2025-11-22 20:00:00',
                'durasi' => 4,
                'harga' => 130000,
                'stok' => 32,
            ],

            // ==== RUTE 4: Bandung -> Jakarta ====
            [
                'id_rute' => 4,
                'id_company' => 1,
                'nama_tiket' => 'Bandung - Jakarta (Pagi)',
                'jumlah_kursi' => 40,
                'waktu_keberangkatan' => '2025-11-23 07:30:00',
                'waktu_tiba' => '2025-11-23 11:30:00',
                'durasi' => 4,
                'harga' => 130000,
                'stok' => 40,
            ],
            [
                'id_rute' => 4,
                'id_company' => 2,
                'nama_tiket' => 'Bandung - Jakarta (Malam)',
                'jumlah_kursi' => 38,
                'waktu_keberangkatan' => '2025-11-23 20:30:00',
                'waktu_tiba' => '2025-11-24 00:30:00',
                'durasi' => 4,
                'harga' => 135000,
                'stok' => 38,
            ],

            // ==== RUTE 5: Semarang -> Yogyakarta ====
            [
                'id_rute' => 5,
                'id_company' => 1,
                'nama_tiket' => 'Semarang - Yogyakarta (Pagi)',
                'jumlah_kursi' => 36,
                'waktu_keberangkatan' => '2025-11-24 08:00:00',
                'waktu_tiba' => '2025-11-24 12:00:00',
                'durasi' => 4,
                'harga' => 150000,
                'stok' => 36,
            ],
            [
                'id_rute' => 5,
                'id_company' => 2,
                'nama_tiket' => 'Semarang - Yogyakarta (Malam)',
                'jumlah_kursi' => 36,
                'waktu_keberangkatan' => '2025-11-24 19:00:00',
                'waktu_tiba' => '2025-11-24 23:00:00',
                'durasi' => 4,
                'harga' => 155000,
                'stok' => 36,
            ],
        ]);
    }
}
