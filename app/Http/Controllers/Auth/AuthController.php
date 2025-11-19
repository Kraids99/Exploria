<?php

namespace App\Http\Controllers\Auth;

use App\Models\User;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    // Login user dan buat token
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);

        // cari user berdasarkan email
        $user = User::where('email', $request->email)->first();

        // validasi user & password
        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Email atau password salah'], 401);
        }

        // tentukan abilities berdasarkan role user
        $abilities  = $user->admin()->exists() ? ['admin'] : ['customer'];

        // buat token baru
        $token = $user->createToken('Personal Access Token', $abilities)->plainTextToken;

        // mengembalikan response
        return response()->json([
            'message' => 'Login berhasil',
            'user' => $user,
            'abilities' => $abilities,
            'token' => $token,
        ], 200);
    }

    // Logout user
    public function logout(Request $request)
    {
        if ($request->user()) {
            $temp = $request->user();
            
            // hapus token aktif
            $request->user()->currentAccessToken()->delete();

            return response()->json(['message' => 'Logout berhasil ' . $temp->email]);
        }

        return response()->json(['message' => 'Belum login'], 401);
    }
}
