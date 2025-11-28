<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\TiketController;
use App\Http\Controllers\CompanyController;
use App\Http\Controllers\LokasiController;
use App\Http\Controllers\RuteController;
use App\Http\Controllers\PemesananController;
use App\Http\Controllers\PembayaranController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Auth\AdminController;
use App\Http\Controllers\Auth\CustomerController;

// Public routes
// Register
Route::post('/register/admin', [AdminController::class, 'register']);
Route::post('/register/customer', [CustomerController::class, 'register']);

// Login
Route::post('/login', [AuthController::class, 'login']);

// Check Auth
Route::middleware('auth:sanctum')->get('/check-auth', function (Request $request) {
    return response()->json([
        'user' => $request->user(),
        // gunakan token yang sedang dipakai, null-safe supaya tidak 500
        'abilities' => $request->user()?->currentAccessToken()?->abilities,
        'status' => 'ok'
    ]);
});

Route::middleware('auth:sanctum')->group(function () {
    // Logout
    Route::post('/logout', [AuthController::class, 'logout']);

    // Delete
    Route::delete('/delete', [AuthController::class, 'destroy']);

    // Tiket
    Route::get('/tiket/search', [TiketController::class, 'search']);
    Route::get('/tiket', [TiketController::class, 'index']);
    Route::get('/tiket/{id}', [TiketController::class, 'show']);
    
    // User
    Route::get('/user', [UserController::class, 'show']);
    Route::match(['put', 'patch'], '/user/update', [UserController::class, 'update']);
    Route::match(['put', 'patch'], '/user/update/password', [UserController::class, 'updatePassword']);
    Route::delete('/user', [UserController::class, 'destroy']);

    // Pemesanan
    Route::get('/pemesanan', [PemesananController::class, 'index']);
    Route::get('/pemesanan/{id}', [PemesananController::class, 'show']);

    // Pembayaran
    Route::get('/pembayaran', [PembayaranController::class, 'index']);
    Route::get('/pembayaran/{id}', [PembayaranController::class, 'show']);
});



// Company
Route::get('/company', [CompanyController::class, 'index']);
Route::get('/company/{id}', [CompanyController::class, 'show']);

// Lokasi
Route::get('/lokasi', [LokasiController::class, 'index']);
Route::get('/lokasi/{id}', [LokasiController::class, 'show']);

// Rute
Route::get('/rute', [RuteController::class, 'index']);
Route::get('/rute/{id}', [RuteController::class, 'show']);

// Review
Route::get('/review', [ReviewController::class, 'index']);
Route::get('/review/{id}', [ReviewController::class, 'show']);

Route::middleware(['auth:sanctum', 'abilities:customer'])->group(function () {
    // Pemesanan
    Route::post('/pemesanan/create', [PemesananController::class, 'store']);
    Route::put('/pemesanan/cancel/{id}', [PemesananController::class, 'cancel']);

    // Pembayaran
    Route::post('/pembayaran/create', [PembayaranController::class, 'store']);

    // Review
    Route::post('/review/create', [ReviewController::class, 'store']);
    Route::delete('/review/delete/{id}', [ReviewController::class, 'destroy']);
});

// admin
Route::middleware(['auth:sanctum', 'abilities:admin'])->group(function () {
    // Tiket
    Route::post('/tiket/create', [TiketController::class, 'store']);
    Route::put('/tiket/update/{id}', [TiketController::class, 'update']);
    Route::delete('/tiket/delete/{id}', [TiketController::class, 'destroy']);

    // Company
    Route::post('/company/create', [CompanyController::class, 'store']);
    Route::put('/company/update/{id}', [CompanyController::class, 'update']);
    Route::delete('/company/delete/{id}', [CompanyController::class, 'destroy']);

    // Lokasi
    Route::post('/lokasi/create', [LokasiController::class, 'store']);      
    Route::put('/lokasi/update/{id}', [LokasiController::class, 'update']); 
    Route::delete('/lokasi/delete/{id}', [LokasiController::class, 'destroy']);

    // Rute
    Route::post('/rute/create', [RuteController::class, 'store']);
    Route::put('/rute/update/{id}', [RuteController::class, 'update']);
    Route::delete('/rute/delete/{id}', [RuteController::class, 'destroy']);

    // Pemesanan

    // Pembayaran
    Route::put('/pembayaran/update/{id}', [PembayaranController::class, 'update']);

    // Review
});
