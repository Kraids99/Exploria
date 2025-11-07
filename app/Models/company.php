<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class company extends Model
{
    use HasFactory;
    protected $table = 'companies';
    protected $primaryKey = 'id_company';
    public $timestamps = false;

    protected $fillable = [
        'nama_company',
        'email_company',
        'no_telp_company',
        'alamat_company',
    ];
    
    public function tikets()
    {
        return $this->hasMany(Tiket::class, 'id_company');
    }
}
