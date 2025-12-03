<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\User;


class customer extends Model
{
    use HasFactory;
    protected $table = 'customers';
    protected $primaryKey = 'id_customer';
    public $timestamps = false;
    
    // yang bisa diisi
    protected $fillable = [
        'id_user'
    ];

    // customer dimiliki oleh 1 user
    public function user()
    {
        return $this->belongsTo(User::class, 'id_user');
    }
}
