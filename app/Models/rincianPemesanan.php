<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\Tiket;
use App\Models\Pemesanan;

class RincianPemesanan extends Model
{
    use HasFactory;
    protected $table = 'rincian_pemesanans';
    protected $primaryKey = 'id_rincian_pemesanan';
    public $timestamps = false;

    protected $fillable = [
        'id_tiket',
        'id_pemesanan',
        'jumlah_tiket',
    ];

    public function tiket()
    {
        return $this->belongsTo(Tiket::class, 'id_tiket');
    }
    //1 tiket 

    public function pemesanan()
    {
        return $this->belongsTo(Pemesanan::class, 'id_pemesanan');
    }
    //1 pemesanan 
}
