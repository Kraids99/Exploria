<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\Request;

class UserController extends Controller
{
    
    // Tampilkan profil user login
    public function show(Request $request)
    {
        return response()->json($request->user());
    }

    // Update profil user (nama, email, foto, dll)
    public function update(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'nama' => 'sometimes|string|max:100',
            'no_telp' => 'sometimes|string|max:20',
            'email' => ['sometimes', 'email', 'max:255', Rule::unique('users')->ignore($user->id_user, 'id_user')],
            'foto_user' => 'nullable|string',
            'tanggal_lahir' => 'nullable|date',
            'jenis_kelamin' => 'nullable|string|in:Laki-laki,Perempuan',
        ]);

        $user->update($validated);

        return response()->json([
            'message' => 'Profil berhasil diperbarui',
            'user' => $user
        ]);
    }

    // Ubah password user
    public function updatePassword(Request $request)
    {
        $user = $request->user();

        $request->validate([
            'password_lama' => 'required|string',
            'password_baru' => 'required|string|min:8|confirmed',
        ]);

        if(!Hash::check($request->password_lama, $user->password)){
            return response()->json(['message' => 'Password lama salah'], 400);
        }

        $user->update([
            'password' => $request->password_baru,
        ]);

        return response()->json(['message' => 'Password berhasil diubah']);
    }
}
