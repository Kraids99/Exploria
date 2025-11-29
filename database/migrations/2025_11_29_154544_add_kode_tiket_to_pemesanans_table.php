<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('pemesanans', function (Blueprint $table) {
            // tambahin kolom kode_tiket
            $table->string('kode_tiket', 50)
                  ->nullable()    // biar data lama nggak error
                  ->unique()      // tiap booking punya kode unik
                  ->after('id_pemesanan');
        });
    }

    public function down(): void
    {
        Schema::table('pemesanans', function (Blueprint $table) {
            $table->dropColumn('kode_tiket');
        });
    }
};
