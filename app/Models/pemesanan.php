<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\User;
use App\Models\Pembayaran;
use App\Models\RincianPemesanan;

class Pemesanan extends Model
{
    use HasFactory;
    protected $table = 'pemesanans';
    protected $primaryKey = 'id_pemesanan';
    public $timestamps = false; //untuk created at / updated at 
    
    protected $fillable = [
        'id_user',
        'tanggal_pemesanan',
        'total_biaya_pemesanan',
        'status_pemesanan',
        'kode_tiket',
    ];

    protected function casts(): array
    {
        return [
            'tanggal_pemesanan' => 'datetime',   
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'id_user');
    }
    //satu pemesanan dibuat oleh satu user 

    public function pembayaran()
    {
        return $this->hasOne(Pembayaran::class, 'id_pemesanan');
    }
    //satu pemesanan punya satu pembayaran 

    public function rincianPemesanan()
    {
        return $this->hasMany(RincianPemesanan::class,'id_pemesanan');
    }
    //satu pemesanan punya banyak rincian_pemesanan 

}
