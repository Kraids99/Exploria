<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Notifications\Notifiable;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;
use Carbon\Carbon;
use App\Models\Admin;
use App\Models\Customer;
use App\Models\Pemesanan;

class User extends Authenticatable
{
    use HasFactory, HasApiTokens;
    protected $primaryKey = 'id_user';
    protected $table = 'users';
    public $timestamps = false;

    // yang bisa diisi
    protected $fillable = [
        'nama',
        'no_telp',
        'email',
        'password',
        'foto_user',
        'jenis_kelamin',
        'tanggal_lahir',
    ];

    // casting
    protected function casts(): array
    {
        return [
            'tanggal_lahir' => 'date',   
            'password' => 'hashed',
        ];
    }
    
    // satu user punya satu admin
    public function admin()
    {
        return $this->hasOne(Admin::class, 'id_user');
    }
    
    // satu user punya satu customer
    public function customer()
    {
        return $this->hasOne(Customer::class, 'id_user');
    }

    // satu user punya banyak pemesanan
    public function pemesanan()
    {
        return $this->hasMany(Pemesanan::class, 'id_user');
    }

    // satu user punya banyak review
    public function reviews()
    {
        return $this->hasMany(review::class, 'id_user');
    }
}
