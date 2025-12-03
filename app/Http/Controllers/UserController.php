<?php

namespace App\Http\Controllers;

use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use Throwable;

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
            // cek email unique dan abaikan id_user
            'email' => ['sometimes', 'email', 'max:255', Rule::unique('users')->ignore($user->id_user, 'id_user')],
            'foto_user' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
            'tanggal_lahir' => 'nullable|date',
            'jenis_kelamin' => 'nullable|string|in:Laki-laki,Perempuan',
        ]);

        // jika ada file foto baru, hapus lama lalu simpan yang baru
        if ($request->hasFile('foto_user')) {
            if ($user->foto_user) {
                // foto_user menyimpan URL, ambil path /storage
                $oldPath = str_replace('/storage/', '', $user->foto_user);
                // hapus file lama di disk public
                Storage::disk('public')->delete($oldPath);
            }
            $path = $request->file('foto_user')->store('user_profile', 'public');
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

        // password_lama/old_password, password_baru/password.
        $validated = $request->validate([
            'password_lama' => 'required_without:old_password|string',
            'old_password' => 'required_without:password_lama|string',
            'password_baru' => 'required_without:password|string|min:8|confirmed',
            'password' => 'required_without:password_baru|string|min:8|confirmed',
        ]);

        $oldPassword = $validated['password_lama'] ?? $validated['old_password'] ?? null;
        $newPassword = $validated['password_baru'] ?? $validated['password'] ?? null;

        if (!$oldPassword || !$newPassword) {
            return response()->json(['message' => 'Field password tidak lengkap'], 422);
        }

        if (!Hash::check($oldPassword, $user->password)) {
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

        DB::beginTransaction();
        try {
            // Bersihkan foto lama jika ada
            if ($user->foto_user) {
                $path = str_replace('/storage/', '', $user->foto_user);
                Storage::disk('public')->delete($path);
            }

            // Hapus relasi cek di (model User)
            if ($user->customer) {
                $user->customer()->delete();
            }
            if ($user->admin) {
                $user->admin()->delete();
            }

            // Hapus user dan token user
            $user->tokens()->delete();
            $user->delete();

            // kalau sukses commit ubah di database
            DB::commit();
            return response()->json(['message' => 'Akun berhasil dihapus']);
        } catch (Throwable $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Gagal menghapus akun',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    // DB::transaction(function () use ($user)
    // sebenarnya bisa pakai ini lebih simpel cuma manual dulu biar mudah dipahami
}
