<?php

namespace App\Http\Controllers\Auth;

use App\Models\User;
use App\Models\Admin;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class AdminController extends Controller
{
    public function register(Request $request)
    {
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

        // buat user baru
        $user = User::create([
            'nama' => $request->nama,
            'no_telp' => $request->no_telp,
            'email' => $request->email,
            'password' => $request->password, // sudah auto-hash di model
            'tanggal_lahir' => $request->tanggal_lahir,
            'umur' => $request->umur,
            'foto_user' => $request->foto_user,
            'jenis_kelamin' => $request->jenis_kelamin,
        ]);

        // tandai sebagai admin (relasi 1:1 ke users)
        $admin = Admin::create(['id_user' => $user->id_user]);

        // buat token Sanctum dengan role "admin"
        $token = $user->createToken('Personal Access Token', ['admin'])->plainTextToken;

        return response()->json([
            'message' => 'Admin registered successfully',
            'user' => $user,
            'admin' => $admin,
            'token' => $token,
        ], 201);
    }
}
