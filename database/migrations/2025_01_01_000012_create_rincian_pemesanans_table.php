<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('rincian_pemesanans', function (Blueprint $table) {
            $table->bigIncrements('id_rincian_pemesanan');
            $table->unsignedBigInteger('id_tiket');
            $table->unsignedBigInteger('id_pemesanan');
            $table->integer('jumlah_tiket');

            $table->foreign('id_tiket')
                ->references('id_tiket')
                ->on('tikets')
                ->onUpdate('cascade')
                ->onDelete('cascade');

            $table->foreign('id_pemesanan')
                ->references('id_pemesanan')
                ->on('pemesanans')
                ->onUpdate('cascade')
                ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rincian_pemesanans');
    }
};
