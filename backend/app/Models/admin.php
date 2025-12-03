<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\User;

class admin extends Model
{
    use HasFactory;
    protected $table = 'admins';
    protected $primaryKey = 'id_admin';
    public $timestamps = false;
    
    // yang bisa diisi
    protected $fillable = [
        'id_user'
    ];

    // admin dimiliki oleh 1 user
    public function user()
    {
        return $this->belongsTo(User::class, 'id_user');
    }

}
