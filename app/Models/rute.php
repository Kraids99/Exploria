<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class rute extends Model
{
    use HasFactory;
    protected $table = 'rutes';
    protected $primaryKey = 'id_rute';
    public $timestamps = false;

    protected $fillable = [
        'id_lokasi_asal',
        'id_lokasi_tujuan',
    ];

    public function asal()
    {
        return $this->belongsTo(Lokasi::class, 'id_lokasi_asal');
    }

    public function tujuan()
    {
        return $this->belongsTo(Lokasi::class, 'id_lokasi_tujuan');
    }

    public function tikets()
    {
        return $this->hasMany(Tiket::class, 'id_rute');
    }
}
