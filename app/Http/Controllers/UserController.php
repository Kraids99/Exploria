<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    // public function register(Request $request)
    // {
    //     $request->validate([
    //         'nama' => 'required|string|max:255',
    //         'email' => 'required|string|email|max:255|unique:users',
    //         'password' => 'required|string|min:8|confirmed',
    //     ]);

    //     $user = User::create([
    //         'name' => $request->name,
    //         'email' => $request->email,
    //         'password' => $request->password,
    //     ]);

    //     Auth::login($user);

    //     return response()->json(['message' => 'User registered successfully'], 201);
    // }

    // public function login(Request $request)
    // {
    //     $credentials = $request->validate([
    //         'email' => 'required|email',
    //         'password' => 'required|string|min:8',
    //     ]);

    //     if (!Auth::attempt($credentials)) {
    //         return response()->json(['message' => 'Email atau password salah'], 401);
    //     }

    //     $user = Auth::user();

    //     $token = $user->createToken('Personal Access Token')->plainTextToken;

    //     if($user->admin){
    //         $role = 'admin';
    //     }elseif($user->customer){
    //         $role = 'customer';
    //     }else{
    //         $role = 'user';
    //     }

    //     return response()->json([
    //         'message' => 'Login berhasil',
    //         'user' => $user,
    //         'role' => $role,
    //         'token' => $token,
    //     ]);
    // }

    // public function updateProfile(Request $request)
    // {
    //     $user = Auth::user();

    //     if (!$user) {
    //        return response()->json(['message' => 'Unauthorized'], 401);
    //     }

    //     $request->validate([
    //         'nama' => 'string|max:255',
    //         'umur' => 'nullable|integer',
    //         'no_telp' => 'nullable|string|max:20',
    //         'foto_user' => 'nullable|string',
    //         'jenis_kelamin' => 'nullable|string',
    //         'tanggal_lahir' => 'nullable|date',
    //     ]);

    //     $user->update($request->only([
    //         'nama', 'umur', 'no_telp', 'foto_user', 'jenis_kelamin', 'tanggal_lahir'
    //     ]));

    //     return response()->json([
    //         'message' => 'Profile updated successfully',
    //         'user' => $user->fresh(),
    //     ]);
    // }

    // public function destroy(Request $request)
    // {
    //     $user = Auth::user();

    //     if(!$user){
    //         return response()->json(['message' => 'Unauthorized'], 401);
    //     }

    //     if($user->admin){
    //         return response()->json(["message"=> 'Admin user cannot be deleted'], 403);
    //     }

    //     $user->tokens()->delete();
    //     $user->delete();   
    // }

    // public function logout(Request $request)
    // {
    //     $user = Auth::user();

    //     if(!$user){
    //         return response()->json(['message' => 'Unauthorized'], 401);
    //     }

    //     $user->tokens()->delete();

    //     return response()->json(['message' => 'Logged out successfully']);
    // }
}
