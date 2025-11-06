<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class lokasi extends Model
{
    use HasFactory;
    protected $table = 'lokasis';
    protected $primaryKey = 'id_lokasi';
    public $timestamps = false;

    protected $fillable = [
        'terminal',
        'kota',
    ];

    public function ruteAsal()
    {
        return $this->hasMany(Rute::class, 'id_lokasi_asal');
    }

    public function ruteTujuan()
    {
        return $this->hasMany(Rute::class, 'id_lokasi_tujuan');
    }

    public function detailRute()
    {
        return $this->hasMany(DetailRute::class, 'id_lokasi');
    }
}
