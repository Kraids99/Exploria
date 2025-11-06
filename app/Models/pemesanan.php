<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Pemesanan extends Model
{
    use HasFactory;
    protected $table = 'pemesanans';
    protected $primaryKey = 'id_pemesanan';
    
    protected $fillable = [
        'id_user',
        'tanggal_pemesanan',
        'total_biaya_pemesanan',
        'status_pemesanan',
    ];

    protected function casts(): array
    {
        return [
            'tanggal_pemesanan' => 'dateTime',   
        ];
    }

    public function user()
    {
        return this->belongTo(User::class, 'id_user');
    }

    public function pembayaran()
    {
        return $this->hasOne(Pembayaran::class, 'id_pemesanan');
    }

    public function rincianPemesanan()
    {
        return $this->hasMany(RincianPemesanan::class,'id_pemesanan');
    }
}
