<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasFactory, HasApiTokens;
    protected $primaryKey = 'id_user';
    protected $table = 'users';
    public $timestamps = false;

    protected $fillable = [
        'nama',
        'umur',
        'no_telp',
        'email',
        'password',
        'foto_user',
        'jenis_kelamin',
        'tanggal_lahir',
    ];

    protected function casting(): array
    {
        return [
            'tanggal_lahir' => 'date',   
            'password' => 'hashed',
        ];
    }
    
    public function admin()
    {
        return $this->hasOne(Admin::class, 'id_user');
    }
    
    public function customer()
    {
        return $this->hasOne(Customer::class, 'id_user');
    }

    public function pemesanan()
    {
        return $this->hasMany(Pemesanan::class, 'id_user');
    }

}
