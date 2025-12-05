<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\Rute;
use App\Models\DetailRute;

class Lokasi extends Model
{
    use HasFactory;
    protected $table = 'lokasis';
    protected $primaryKey = 'id_lokasi';
    public $timestamps = false;

    // yang bisa diisi
    protected $fillable = [
        'terminal',
        'kota',
    ];

    // 1 lokasi bisa menjadi asal banyak rute
    public function ruteAsal()
    {
        return $this->hasMany(Rute::class, 'id_lokasi_asal');
    }

    // 1 lokasi bisa menjadi tujuan banyak rute
    public function ruteTujuan()
    {
        return $this->hasMany(Rute::class, 'id_lokasi_tujuan');
    }

}
