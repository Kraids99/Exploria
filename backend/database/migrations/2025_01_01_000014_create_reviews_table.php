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
        Schema::create('reviews', function (Blueprint $table) {
            $table->bigIncrements('id_review');
            $table->unsignedBigInteger('id_user');
            $table->unsignedBigInteger('id_pembayaran');
            $table->unsignedBigInteger('id_tiket');
            $table->float('rating');
            $table->string('komentar')->nullable();
            $table->date('tanggal_review')->nullable();
            $table->boolean('status_review')->nullable();

            $table->foreign('id_pembayaran')
                ->references('id_pembayaran')
                ->on('pembayarans')
                ->onUpdate('cascade')
                ->onDelete('cascade');

            $table->foreign('id_tiket')
                ->references('id_tiket')
                ->on('tikets')
                ->onUpdate('cascade')
                ->onDelete('cascade');

            $table->foreign('id_user')
                ->references('id_user')
                ->on('users')
                ->onUpdate('cascade')
                ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reviews');
    }
};
