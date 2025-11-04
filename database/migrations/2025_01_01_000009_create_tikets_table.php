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
        Schema::create('tikets', function (Blueprint $table) {
            $table->id('id_tiket');
            $table->unsignedBigInteger('id_rute');
            $table->unsignedBigInteger('id_company');
            $table->string('nama_tiket');
            $table->integer('jumlah_kursi');
            $table->dateTime('waktu_keberangkatan');
            $table->dateTime('waktu_tiba');
            $table->integer('durasi');
            $table->decimal('harga', 10, 2);
            $table->integer('stok');
            $table->timestamps();

            $table->foreign('id_rute')
                ->references('id_rute')
                ->on('rutes')
                ->onUpdate('cascade')
                ->onDelete('cascade');

            $table->foreign('id_company')
                ->references('id_company')
                ->on('companies')
                ->onUpdate('cascade')
                ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tikets');
    }
};
