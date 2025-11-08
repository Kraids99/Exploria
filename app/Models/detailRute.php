<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class detailRute extends Model
{
    use HasFactory;
    protected $table = 'detail_rutes';
    protected $primaryKey = 'id_detail_tipe';
    public $timestamps = false;

    protected $fillable = [
        'id_rute',
        'id_lokasi',
        'keterangan',
        'waktu',
    ];

    public function rute()
    {
        return $this->belongsTo(Rute::class, 'id_rute');
    }

    public function lokasi()
    {
        return $this->belongsTo(Lokasi::class, 'id_lokasi');
    }
}
