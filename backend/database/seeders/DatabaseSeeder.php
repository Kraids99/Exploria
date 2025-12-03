<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        $this->call([
            UserSeeder::class,
            AdminSeeder::class,
            LokasiSeeder::class,
            CompanySeeder::class,
            RuteSeeder::class,
            TiketSeeder::class,
            KursiSeeder::class,
            PemesananSeeder::class,
            PembayaranSeeder::class,
            RincianPemesananSeeder::class,
        ]);
    }
}
