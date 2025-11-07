<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TiketController;
use App\Http\Controllers\CompanyController;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Auth\AdminController;
use App\Http\Controllers\Auth\CustomerController;

Route::post('/register/admin', [AdminController::class, 'register']);
Route::post('/register/customer', [CustomerController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::get('/tikets', [TiketController::class, 'index']);
Route::get('/tikets/{id}', [TiketController::class, 'show']);

Route::get('/companys', [CompanyController::class, 'index']);
Route::get('/companys/{id}', [CompanyController::class, 'show']);

// login
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
});

// admin
Route::middleware(['auth:sanctum', 'abilities:admin'])->group(function () {
    Route::post('/tikets/create', [TiketController::class, 'store']);
    Route::post('/tikets/update/{id}', [TiketController::class, 'update']);
    Route::delete('/tikets/delete/{id}', [TiketController::class, 'destroy']);

    Route::post('/companys/create', [CompanyController::class, 'store']);
    Route::post('/companys/update/{id}', [CompanyController::class, 'update']);
    Route::delete('/companys/delete/{id}', [CompanyController::class, 'destroy']);
});