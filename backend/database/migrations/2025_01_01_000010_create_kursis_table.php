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
        Schema::create('kursis', function (Blueprint $table) {
            $table->bigIncrements('id_kursi');
            $table->unsignedBigInteger('id_tiket');
            $table->string('kode', 10);
            $table->boolean('status_kursi')->default(true);

            $table->foreign('id_tiket')
                ->references('id_tiket')
                ->on('tikets')
                ->onUpdate('cascade')
                ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('kursis');
    }
};
