<?php

namespace App\Http\Controllers\Auth;

use App\Models\User;
use App\Models\Admin;
use Illuminate\Http\Request;
use Carbon\Carbon;
use App\Http\Controllers\Controller;

class AdminController extends Controller
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
            'foto_user' => 'nullable|string',
            'jenis_kelamin' => 'nullable|string',
        ]);

        $umur = Carbon::parse($request->tanggal_lahir)->age;

        // buat user baru
        $user = User::create([
            'nama' => $request->nama,
            'no_telp' => $request->no_telp,
            'email' => $request->email,
            'password' => $request->password, // sudah auto-hash di model
            'tanggal_lahir' => $request->tanggal_lahir,
            'umur' => $umur,
            'foto_user' => $request->foto_user,
            'jenis_kelamin' => $request->jenis_kelamin,
        ]);

        // create admin
        $admin = Admin::create(['id_user' => $user->id_user]);

        // opsi lain untuk membuat admin
        // $admin = new Admin(['id_user' => $user->id_user]);
        // $admin->save();

        // buat token Sanctum dengan ability admin
        $token = $user->createToken('Personal Access Token', ['admin'])->plainTextToken;

        // mengembalikan response
        return response()->json([
            'message' => 'Admin registered successfully',
            'user' => $user,
            'admin' => $admin,
            'token' => $token,
        ], 201);
    }
}
