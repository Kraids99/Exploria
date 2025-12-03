<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\Tiket;
use App\Models\Pemesanan;

class rincianPemesanan extends Model
{
    use HasFactory;
    protected $table = 'rincian_pemesanans';
    protected $primaryKey = 'id_rincian_pemesanan';
    public $timestamps = false;

    // yang bisa diisi
    protected $fillable = [
        'id_tiket',
        'id_pemesanan',
        'jumlah_tiket',
    ];

    //1 tiket dimiliki oleh banyak rincian pemesanan
    public function tiket()
    {
        return $this->belongsTo(Tiket::class, 'id_tiket');
    }
    
    //1 pemesanan memiliki banyak rincian pemesanan
    public function pemesanan()
    {
        return $this->belongsTo(Pemesanan::class, 'id_pemesanan');
    }
}
