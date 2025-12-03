<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PembayaranSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('pembayarans')->insert([
            'id_pemesanan' => 1,
            'metode_pembayaran' => 'BCA',
            'status_pembayaran' => 1, // sudah dibayar
            'mail_tiket' => false,
            'tanggal_pembayaran' => '2025-12-02',
        ]);
    }
}
