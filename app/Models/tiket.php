<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\Rute;
use App\Models\Company;
use App\Models\Kursi;
use App\Models\RincianPemesanan;
use App\Models\Review;

class Tiket extends Model
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
    
    protected function casts(): array
    {
        return [
            'waktu_keberangkatan' => 'datetime',   
            'waktu_tiba' => 'datetime',
        ];
    }

    public function rute()
    {
        return $this->belongsTo(Rute::class, 'id_rute');
    }
    //satu tiket punya satu rute 

    public function company()
    {
        return $this->belongsTo(Company::class, 'id_company');
    }
    //satu tiket punya satu company 

    public function kursi()
    {
        return $this->hasMany(Kursi::class, 'id_tiket');
    }
    //satu tiket punya banyak kursi 

    // public function rincian()
    // {
    //     return $this->hasMany(RincianPemesanan::class, 'id_tiket');
    // }

    // public function reviews()
    // {
    //     return $this->hasMany(Review::class, 'id_tiket');
    // }

    // public function getKodeTiketAttribute()
    // {
    //     return 'T' . $this->id_tiket;
    // }

    //alasan di komen : relasinya skrg belum di butuhkan di user 

    

}
