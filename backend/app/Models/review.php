<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\Pembayaran;
use App\Models\Tiket;
use App\Models\User;

class review extends Model
{
    use HasFactory;
    protected $table = 'reviews';
    protected $primaryKey = 'id_review';
    public $timestamps = false;

    // yang bisa diisi
    protected $fillable = [
        'id_pembayaran',
        'id_tiket',
        'id_user',
        'rating',
        'komentar',
        'tanggal_review',
        'status_review',
    ];

    // casting
    protected function casts(): array
    {
        return [
            'tanggal_review' => 'datetime',  
            'status_review' => 'boolean', 
        ];
    }

    //satu review punya satu pembayaran
    public function pembayaran()
    {
        return $this->belongsTo(Pembayaran::class, 'id_pembayaran');
    } 

    //sati review untuk satu tiket
    public function tiket()
    {
        return $this->belongsTo(Tiket::class, 'id_tiket');
    } 

    //satu review dibuat oleh satu user
    public function user()
    {
        return $this->belongsTo(User::class, 'id_user');
    } 
}
