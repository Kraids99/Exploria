<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Pembayaran extends Model   // ← huruf besar
{
    use HasFactory;

    protected $table = 'pembayarans';
    protected $primaryKey = 'id_pembayaran';
    public $timestamps = false;
    //kasi tau laravel nama databse 

    // yang bisa diisi
    protected $fillable = [
        'id_pemesanan',
        'metode_pembayaran',
        'status_pembayaran',
        'mail_tiket',
        'tanggal_pembayaran',
    ];

    //satu pembayaran dimiliki satu pemesanan 
    public function pemesanan()
    {
        return $this->belongsTo(Pemesanan::class, 'id_pemesanan');
    }
    
    //satu pembayaran punya satu review 
    public function review()
    {
        return $this->hasOne(Review::class, 'id_pembayaran');
    }
}
