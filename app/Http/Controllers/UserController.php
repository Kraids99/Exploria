<?php

namespace App\Http\Controllers;

use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
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
            // terima file foto (opsional)
            'foto_user' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
            'tanggal_lahir' => 'nullable|date',
            'jenis_kelamin' => 'nullable|string|in:Laki-laki,Perempuan',
        ]);

        // jika ada file foto baru, hapus lama lalu simpan yang baru
        if ($request->hasFile('foto_user')) {
            if ($user->foto_user) {
                // foto_user menyimpan URL, ambil path relative /storage
                $oldPath = str_replace('/storage/', '', $user->foto_user);
                Storage::disk('public')->delete($oldPath);
            }
            $path = $request->file('foto_user')->store('avatars', 'public');
            $validated['foto_user'] = Storage::url($path);
        }

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

        // Terima kedua bentuk nama field supaya kompatibel (password_lama/old_password, password_baru/password).
        $validated = $request->validate([
            'password_lama' => 'required_without:old_password|string',
            'old_password' => 'required_without:password_lama|string',
            'password_baru' => 'required_without:password|string|min:8|confirmed',
            'password' => 'required_without:password_baru|string|min:8|confirmed',
        ]);

        // Normalisasi nama field ke variabel tunggal
        $oldPassword = $validated['password_lama'] ?? $validated['old_password'] ?? null;
        $newPassword = $validated['password_baru'] ?? $validated['password'] ?? null;

        if(!$oldPassword || !$newPassword){
            return response()->json(['message' => 'Field password tidak lengkap'], 422);
        }

        if(!Hash::check($oldPassword, $user->password)){
            return response()->json(['message' => 'Password lama salah'], 400);
        }

        $user->update([
            // Hash secara eksplisit agar aman (meski cast sudah hashed).
            'password' => Hash::make($newPassword),
        ]);

        return response()->json(['message' => 'Password berhasil diubah']);
    }

    // Hapus akun user 
    public function destroy(Request $request)
    {
        $user = $request->user();

        if (!$user) {
            return response()->json(['message' => 'Belum login'], 401);
        }

        DB::transaction(function () use ($user) {
            if ($user->foto_user) {
                $path = str_replace('/storage/', '', $user->foto_user);
                Storage::disk('public')->delete($path);
            }

            if ($user->customer) {
                $user->customer()->delete();
            }
            if ($user->admin) {
                $user->admin()->delete();
            }

            // hapus token aktif
            $user->tokens()->delete();

            $user->delete();
        });

        return response()->json(['message' => 'Akun berhasil dihapus']);
    }
}
