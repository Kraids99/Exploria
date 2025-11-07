<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;


class admin extends Model
{
    use HasFactory;
    protected $table = 'admins';
    protected $primaryKey = 'id_admin';
    public $timestamps = false;
    
    protected $fillable = [
        'id_user'
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'id_user');
    }

}
