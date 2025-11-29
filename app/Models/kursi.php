<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\Tiket;

class Kursi extends Model
{
    use HasFactory;
    protected $table = 'kursis';
    protected $primaryKey = 'id_kursi';
    public $timestamps = false;
    //kasi tau laravel ttg nama databse 

    protected $fillable = [
        'id_tiket',
        'kode',
        'status_kursi',
    ];

    public function tiket()
    {
        return $this->belongsTo(Tiket::class, 'id_tiket');
    }

    //1 kursi milik satu tiket 
}
