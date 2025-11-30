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
        Schema::create('pembayarans', function (Blueprint $table) {
            $table->bigIncrements('id_pembayaran');
            $table->unsignedBigInteger('id_pemesanan');
            $table->string('metode_pembayaran', 50);
            $table->string('status_pembayaran', 50);
            $table->boolean('mail_tiket')->default(false);
            $table->date('tanggal_pembayaran')->nullable();

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
        Schema::dropIfExists('pembayarans');
    }
};
