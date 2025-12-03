<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CompanySeeder extends Seeder
{
    public function run()
    {
        DB::table('companies')->insert([
            [
                'nama_company' => 'Exploria Trans',
                'email_company' => 'exploria@travel.com',
                'no_telp_company' => '081234567890',
                'alamat_company' => 'Jl. Raya Ringroad Utara No. 1, Sleman',
                'logo_company' => 'logos/exploria.png'
            ],
            [
                'nama_company' => 'Argo Bis Indonesia',
                'email_company' => 'argobis@travel.com',
                'no_telp_company' => '082233445566',
                'alamat_company' => 'Jl. Gatot Subroto No. 22, Jakarta',
                'logo_company' => 'logos/argobis.png'
            ],
        ]);
    }
}
