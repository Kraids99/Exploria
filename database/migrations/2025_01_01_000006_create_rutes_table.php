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
        Schema::create('rutes', function (Blueprint $table) {
            $table->bigIncrements('id_rute');
            $table->unsignedBigInteger('id_lokasi_asal');
            $table->unsignedBigInteger('id_lokasi_tujuan');

            $table->foreign('id_lokasi_asal')
                ->references('id_lokasi')
                ->on('lokasis')
                ->onUpdate('cascade')
                ->onDelete('cascade');

            $table->foreign('id_lokasi_tujuan')
                ->references('id_lokasi')
                ->on('lokasis')
                ->onUpdate('cascade')
                ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rutes');
    }
};
