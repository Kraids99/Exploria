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
        Schema::create('detail_rutes', function (Blueprint $table) {
            $table->id('id_detail_tipe');
            $table->unsignedBigInteger('id_rute');
            $table->unsignedBigInteger('id_lokasi');
            $table->string('keterangan')->nullable();
            $table->dateTime('waktu');

            $table->foreign('id_rute')
                ->references('id_rute')
                ->on('rutes')
                ->onUpdate('cascade')
                ->onDelete('cascade');

            $table->foreign('id_lokasi')
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
        Schema::dropIfExists('detail_rutes');
    }
};
