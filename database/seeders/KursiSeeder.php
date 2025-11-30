<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\Tiket;

class KursiSeeder extends Seeder
{

    public function run(): void
    {
        $tikets = Tiket::all();

        foreach ($tikets as $tiket) {

            $kursi = [];
            $rows = [1,2,3,4,5,6,7,8];
            $cols = ['A','B','C','D'];

            foreach ($rows as $row) {

                if ($row == 4 || $row == 5) {
                    foreach (['C','D'] as $col) {
                        $kursi[] = [
                            'id_tiket' => $tiket->id_tiket,
                            'kode' => $row . $col,
                            'status_kursi' => 0,
                        ];
                    }
                } 
                else {
                    foreach ($cols as $col) {
                        $kursi[] = [
                            'id_tiket' => $tiket->id_tiket,
                            'kode' => $row . $col,
                            'status_kursi' => 0,
                        ];
                    }
                }
            }

            DB::table('kursis')->insert($kursi);
        }
    }
    // public function run(): void
    // {
    //     DB::table('kursis')->insert([
    //         // Baris 1
    //         ['id_tiket' => 1, 'kode' => '1A', 'status_kursi' => 0],
    //         ['id_tiket' => 1, 'kode' => '1B', 'status_kursi' => 0],
    //         ['id_tiket' => 1, 'kode' => '1C', 'status_kursi' => 0],
    //         ['id_tiket' => 1, 'kode' => '1D', 'status_kursi' => 0],

    //         // Baris 2
    //         ['id_tiket' => 1, 'kode' => '2A', 'status_kursi' => 0],
    //         ['id_tiket' => 1, 'kode' => '2B', 'status_kursi' => 0],
    //         ['id_tiket' => 1, 'kode' => '2C', 'status_kursi' => 0],
    //         ['id_tiket' => 1, 'kode' => '2D', 'status_kursi' => 0],

    //         // Baris 3
    //         ['id_tiket' => 1, 'kode' => '3A', 'status_kursi' => 0],
    //         ['id_tiket' => 1, 'kode' => '3B', 'status_kursi' => 0],
    //         ['id_tiket' => 1, 'kode' => '3C', 'status_kursi' => 0],
    //         ['id_tiket' => 1, 'kode' => '3D', 'status_kursi' => 0],

    //         // Baris Toilet (4A & 4B tidak ada)
    //         ['id_tiket' => 1, 'kode' => '4C', 'status_kursi' => 0],
    //         ['id_tiket' => 1, 'kode' => '4D', 'status_kursi' => 0],

    //         // Baris Pintu (5A & 5B tidak ada)
    //         ['id_tiket' => 1, 'kode' => '5C', 'status_kursi' => 0],
    //         ['id_tiket' => 1, 'kode' => '5D', 'status_kursi' => 0],

    //         // Baris 6
    //         ['id_tiket' => 1, 'kode' => '6A', 'status_kursi' => 0],
    //         ['id_tiket' => 1, 'kode' => '6B', 'status_kursi' => 0],
    //         ['id_tiket' => 1, 'kode' => '6C', 'status_kursi' => 0],
    //         ['id_tiket' => 1, 'kode' => '6D', 'status_kursi' => 0],

    //         // Baris 7
    //         ['id_tiket' => 1, 'kode' => '7A', 'status_kursi' => 0],
    //         ['id_tiket' => 1, 'kode' => '7B', 'status_kursi' => 0],
    //         ['id_tiket' => 1, 'kode' => '7C', 'status_kursi' => 0],
    //         ['id_tiket' => 1, 'kode' => '7D', 'status_kursi' => 0],

    //         // Baris 8
    //         ['id_tiket' => 1, 'kode' => '8A', 'status_kursi' => 0],
    //         ['id_tiket' => 1, 'kode' => '8B', 'status_kursi' => 0],
    //         ['id_tiket' => 1, 'kode' => '8C', 'status_kursi' => 0],
    //         ['id_tiket' => 1, 'kode' => '8D', 'status_kursi' => 0],
    //     ]);
    // }
}
