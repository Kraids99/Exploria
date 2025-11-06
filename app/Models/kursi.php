<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class kursi extends Model
{
    use HasFactory;
    protected $table = 'kursis';
    protected $primaryKey = 'id_kursi';
    public $timestamps = false;

    protected $fillable = [
        'id_tiket',
        'kode',
        'status_kursi',
    ];

    public function tiket()
    {
        return $this->belongsTo(Tiket::class, 'id_tiket');
    }
}
