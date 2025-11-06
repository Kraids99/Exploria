<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class tiket extends Model
{
    use HasFactory;
    protected $primaryKey = 'id_tiket';
    protected $table = 'tikets';

    protected $fillable = [
        'id_rute',
        'id_company',
        'nama_tiket',
        'jumlah_kursi',
        'waktu_keberangkatan',
        'waktu_tiba',
        'durasi',
        'harga',
        'stok',
    ];
    
    public function rute()
    {
        return $this->belongsTo(Rute::class, 'id_rute');
    }

    public function company()
    {
        return $this->belongsTo(Company::class, 'id_company');
    }

    public function kursi()
    {
        return $this->hasMany(Kursi::class, 'id_tiket');
    }

    public function rincian()
    {
        return $this->hasMany(RincianPemesanan::class, 'id_tiket');
    }

    public function reviews()
    {
        return $this->hasMany(Review::class, 'id_tiket');
    }

    // public function getKodeTiketAttribute()
    // {
    //     return 'T' . $this->id_tiket;
    // }

}
