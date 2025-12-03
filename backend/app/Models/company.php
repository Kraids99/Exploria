<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\Tiket;

class company extends Model
{
    use HasFactory;
    protected $table = 'companies';
    protected $primaryKey = 'id_company';
    public $timestamps = false;

    // yang bisa diisi
    protected $fillable = [
        'nama_company',
        'email_company',
        'no_telp_company',
        'alamat_company',
        'logo_company',
    ];
    
    // 1 company memiliki banyak tiket
    public function tikets()
    {
        return $this->hasMany(Tiket::class, 'id_company');
    }
}
