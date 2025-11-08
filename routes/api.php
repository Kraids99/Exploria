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

// Logout
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);

    // User
    Route::get('/user', [UserController::class, 'show']);
    Route::put('/user', [UserController::class, 'update']);
    Route::put('/user/password', [UserController::class, 'updatePassword']);

    // Reviews
    Route::delete('/reviews/{id}', [ReviewController::class, 'destroy']);
});

// Tiket
Route::get('/tiket', [TiketController::class, 'index']);
Route::get('/tiket/{id}', [TiketController::class, 'show']);

// Company
Route::get('/company', [CompanyController::class, 'index']);
Route::get('/company/{id}', [CompanyController::class, 'show']);

// Lokasi
Route::get('/lokasi', [LokasiController::class, 'index']);
Route::get('/lokasi/{id}', [LokasiController::class, 'show']);

// Rute
Route::get('/rute', [RuteController::class, 'index']);
Route::get('/rute/{id}', [RuteController::class, 'show']);

// Pemesanan
Route::get('/pemesanan', [PemesananController::class, 'index']);
Route::get('/pemesanan/{id}', [PemesananController::class, 'show']);

// Pembayaran
Route::get('/pembayaran', [PembayaranController::class, 'index']);
Route::get('/pembayaran/{id}', [PembayaranController::class, 'show']);

// Review
Route::get('/reviews', [ReviewController::class, 'index']);
Route::get('/reviews/{id}', [ReviewController::class, 'show']);

Route::middleware(['auth:sanctum', 'abilities:customer'])->group(function () {
    // Pemesanan
    Route::post('/pemesanan', [PemesananController::class, 'store']);
    Route::put('/pemesanan/{id}/cancel', [PemesananController::class, 'cancel']);

    // Pembayaran
    Route::post('/pembayaran', [PembayaranController::class, 'store']);

    // Review
    Route::post('/reviews', [ReviewController::class, 'store']);
});

// admin
Route::middleware(['auth:sanctum', 'abilities:admin'])->group(function () {
    // Tiket
    Route::post('/tiket/create', [TiketController::class, 'store']);
    Route::post('/tiket/update/{id}', [TiketController::class, 'update']);
    Route::delete('/tiket/delete/{id}', [TiketController::class, 'destroy']);

    // Company
    Route::post('/company/create', [CompanyController::class, 'store']);
    Route::post('/company/update/{id}', [CompanyController::class, 'update']);
    Route::delete('/company/delete/{id}', [CompanyController::class, 'destroy']);

    // Lokasi
    Route::post('/lokasi', [LokasiController::class, 'store']);      
    Route::put('/lokasi/{id}', [LokasiController::class, 'update']); 
    Route::delete('/lokasi/{id}', [LokasiController::class, 'destroy']);

    // Rute
    Route::post('/rute', [RuteController::class, 'store']);
    Route::put('/rute/{id}', [RuteController::class, 'update']);
    Route::delete('/rute/{id}', [RuteController::class, 'destroy']);

    // Pemesanan

    // Pembayaran
    Route::put('/pembayaran/{id}', [PembayaranController::class, 'update']);

    // Review
});