<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\Tiket;

class kursi extends Model
{
    use HasFactory;
    protected $table = 'kursis';
    protected $primaryKey = 'id_kursi';
    public $timestamps = false;
    //kasi tau laravel ttg nama databse 

    // yang bisa diisi
    protected $fillable = [
        'id_tiket',
        'kode',
        'status_kursi',
    ];

    //1 kursi milik satu tiket 
    public function tiket()
    {
        return $this->belongsTo(Tiket::class, 'id_tiket');
    }
}
