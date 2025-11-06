<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class review extends Model
{
    use HasFactory;
    protected $table = 'reviews';
    protected $primaryKey = 'id_review';
    public $timestamps = false;

    protected $fillable = [
        'id_pembayaran',
        'id_tiket',
        'rating',
        'komentar',
        'tanggal_review',
    ];

    public function pembayaran()
    {
        return $this->belongsTo(Pembayaran::class, 'id_pembayaran');
    }

    public function tiket()
    {
        return $this->belongsTo(Tiket::class, 'id_tiket');
    }
}
