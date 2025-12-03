<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run()
    {
        DB::table('users')->insert([ 
            [
                'nama' => 'admin',
                'no_telp' => '085261259680',
                'email' => 'admin@gmail.com',
                'password' => Hash::make('admin123'),
                'foto_user' => NULL,
                'jenis_kelamin' => NULL,
                'tanggal_lahir' => NULL,
            ],
            [
                'nama' => 'user',
                'no_telp' => '085261259680',
                'email' => 'user@gmail.com',
                'password' => Hash::make('user123'),
                'foto_user' => NULL,
                'jenis_kelamin' => NULL,
                'tanggal_lahir' => NULL,
            ]
        ]);
    }
}