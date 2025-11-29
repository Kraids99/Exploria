<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\Pembayaran;
use App\Models\Tiket;
use App\Models\User;

class Review extends Model
{
    use HasFactory;
    protected $table = 'reviews';
    protected $primaryKey = 'id_review';
    public $timestamps = false;

    protected $fillable = [
        'id_pembayaran',
        'id_tiket',
        'id_user',
        'rating',
        'komentar',
        'tanggal_review',
    ];

    protected function casts(): array
    {
        return [
            'tanggal_review' => 'datetime',   
        ];
    }
    //kolom tanggal_reviw otomatis dikonversi jadi objectTime 

    public function pembayaran()
    {
        return $this->belongsTo(Pembayaran::class, 'id_pembayaran');
    }
    //satu review punya satu pembayaran yang direferensiin 

    public function tiket()
    {
        return $this->belongsTo(Tiket::class, 'id_tiket');
    }
    //sati review untuk satu tiket 

    public function user()
    {
        return $this->belongsTo(User::class, 'id_user');
    }
    //satu review dibuat oleh satu user 
}
