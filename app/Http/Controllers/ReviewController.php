<?php

namespace App\Http\Controllers;

use App\Models\Review;
use App\Models\Tiket;
use App\Models\Pemesanan;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illluminate\Support\Facades\Auth;

class ReviewController extends Controller
{
    // Tampilkan semua review mulai yang paling baru
    public function index()
    {
        $reviews = Review::with(['user:id_user,nama,foto_user', 'tiket:id_tiket,nama_tiket'])->orderBy('tanggal_review', 'desc')->get();
        // bisa pakai latest()-> tapi ga ada created_at
        return response()->json($reviews);
    }

    // Tampilkan satu review berdasarkan id
    public function show($id)
    {
        $review = Review::with(['user', 'tiket'])->find($id);

        if(!$review){
            return response()->json(['message' => 'Review tidak ditemukan'], 404);
        }

        return response()->json($review);
    }

    // Tambah review baru (customer only)
    public function store(Request $request)
    {
        $user = $request->user();

        if(!$user->tokenCan('customer')){
            return response()->json(['message' => 'Hanya customer yang dapat menulis review'], 403);
        }

        $request->validate([
            'id_tiket' => 'required|exists:tikets,id_tiket',
            'rating'   => 'required|integer|min:1|max:5',
            'komentar' => 'nullable|string|max:500',
        ]);

        $idTiket = $request->id_tiket;

        // Cari pemesanan user untuk tiket itu yang sudah dibayar
        $pemesanan = Pemesanan::where('id_user', $user->id_user)
            ->whereHas('rincianPemesanan', function($query) use ($idTiket) {
                $query->where('id_tiket', $idTiket);
            })
            ->whereHas('pembayaran', function($query) {
                $query->where('status_pembayaran', 'Berhasil');
            })
            ->first();

        if(!$pemesanan){
            return response()->json([
                'message' => 'Kamu belum melakukan pemesanan tiket ini atau belum membayar'
            ], 403);
        }

        // ambil waktu tiba dari tiket
        $tiket = Tiket::find($idTiket);

        $now = now();
        $tiba = Carbon::parse($tiket->waktu_tiba);

        // pastikan perjalanan sudah selesai dan masih dalam 1 hari setelahnya
        if($now->lt($tiba)){
            return response()->json([
                'message' => 'Review hanya bisa dilakukan setelah perjalanan selesai'
            ], 403);
        }

        if($now->diffInHours($tiba) > 24){
            return response()->json([
                'message' => 'Waktu untuk memberikan review sudah berakhir (lebih dari 1 hari)'
            ], 403);
        }

        // cek apakah user sudah pernah review tiket ini
        $sudahReview = Review::where('id_user', $user->id_user)
            ->where('id_tiket', $idTiket)
            ->exists();

        if($sudahReview){
            return response()->json([
                'message' => 'Kamu sudah pernah memberikan review untuk tiket ini'
            ], 400);
        }

        // buat review baru
        $review = Review::create([
            'id_user'   => $user->id_user,
            'id_tiket'  => $idTiket,
            'id_pembayaran'  => $pemesanan->pembayaran->id_pembayaran,
            'rating'    => $request->rating,
            'komentar'  => $request->komentar,
            'tanggal_review' => now(),
        ]);

        return response()->json([
            'message' => 'Review berhasil ditambahkan',
            'data' => $review
        ], 201);
    }

    // Hapus review
    public function destroy($id, Request $request)
    {
        $user = $request->user();
        $review = Review::find($id);

        if(!$review){
            return response()->json(['message' => 'Review tidak ditemukan'], 404);
        }

        // hanya admin atau si pembuat review yang bisa hapus
        if (!($user->tokenCan('admin') || $user->id_user === $review->id_user)) {
            return response()->json(['message' => 'Tidak punya izin menghapus review ini'], 403);
        }

        $review->delete();
        return response()->json(['message' => 'Review berhasil dihapus']);
    }
}
