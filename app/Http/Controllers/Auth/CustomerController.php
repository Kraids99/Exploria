<?php

namespace App\Http\Controllers\Auth;

use App\Models\User;
use App\Models\Customer;
use Illuminate\Http\Request;
use Carbon\Carbon;
use App\Http\Controllers\Controller;

class CustomerController extends Controller
{
    public function register(Request $request)
    {
        // validasi input
        $request->validate([
            'nama' => 'required|string|max:100',
            'no_telp' => 'required|string|max:20',
            'email' => 'required|string|email|max:255|unique:users,email',
            'password' => 'required|string|min:8|confirmed',
            'tanggal_lahir' => 'required|date',
            'umur' => 'nullable|integer',
            'foto_user' => 'nullable|image|mimes:jpg,jpeg,png',
            'jenis_kelamin' => 'nullable|string',
        ]);

        $umur = Carbon::parse($request->tanggal_lahir)->age;

        $profilePath = null;
        if ($request->hasFile('foto_user')) {
            // simpan di storage/app/public/profile_pictures
            $profilePath = $request->file('foto_user')->store('foto_user', 'public');
        }

        // buat user baru
        $user = User::create([
            'nama' => $request->nama,
            'no_telp' => $request->no_telp,
            'email' => $request->email,
            'password' => $request->password,
            'tanggal_lahir' => $request->tanggal_lahir,
            'umur' => $umur,
            'foto_user' => $profilePath,
            'jenis_kelamin' => $request->jenis_kelamin,
        ]);

        // create customer
        $customer = Customer::create(['id_user' => $user->id_user]);

        // buat token sanctum dengan ability customer
        $token = $user->createToken('Personal Access Token', ['customer'])->plainTextToken;

        // mengembalikan response
        return response()->json([
            'message' => 'Customer registered successfully',
            'user' => $user,
            'customer' => $customer,
            'token' => $token,
        ], 201);
    }
}
