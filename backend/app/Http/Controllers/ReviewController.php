<?php

namespace App\Http\Controllers;

use App\Models\Pembayaran;
use App\Models\Pemesanan;
use App\Models\Review;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;


class ReviewController extends Controller
{

    // Tampilkan semua review mulai yang paling baru
    public function index(Request $request)
    {
        // berdasarkan tiket yg dibuka
        $query = Review::with([
            'user:id_user,nama,foto_user',
            'tiket:id_tiket,nama_tiket'
        ])->where('id_tiket', $request->id_tiket);

        $reviews = $query->orderBy('tanggal_review', 'desc')->get();

        return response()->json($reviews);
    }


    // Tampilkan satu review berdasarkan id
    public function show($id)
    {
        $review = Review::with(['user', 'tiket'])->find($id);

        if (!$review) {
            return response()->json(['message' => 'Review tidak ditemukan'], 404);
        }

        return response()->json($review);
    }

    // Tambah review baru (customer only)
    public function store(Request $request)
    {
        $user = $request->user();

        $request->validate([
            'id_pembayaran' => 'required|exists:pembayarans,id_pembayaran',
            'id_tiket' => 'required|exists:tikets,id_tiket',
            'rating' => 'required|integer|min:1|max:5',
            'komentar' => 'nullable|string',
            'status_review' => 'nullable|boolean',
        ]);

        // Pastikan pembayaran milik user ini dan SUDAH dibayar (status = 1)
        $pembayaran = Pembayaran::with('pemesanan.rincianPemesanan')
            ->where('id_pembayaran', $request->id_pembayaran)
            ->whereHas('pemesanan', function ($query) use ($user) {
                $query->where('id_user', $user->id_user);
            })
            ->first();

        if (!$pembayaran) {
            return response()->json(['message' => 'Kamu belum melakukan pemesanan tiket ini atau belum membayar'], 403);
        }

        // Pastikan tiket yang di-review ada di pemesanan ini
        $pemesanan = $pembayaran->pemesanan;
        $rincianTiket = $pemesanan->rincianPemesanan()->where('id_tiket', $request->id_tiket)->with('tiket')->first();

        if (!$rincianTiket) {
            return response()->json([
                'message' => 'Kamu belum melakukan pemesanan tiket ini atau belum membayar',
            ], 403);
        }

        // Pastikan perjalanan sudah selesai dan masih dalam 30 hari review
        $tiket = $rincianTiket->tiket;

        // fallback waktu selesai: waktu_tiba -> waktu_keberangkatan -> tanggal_pemesanan
        $rawTiba = $tiket->waktu_tiba ?? $tiket->waktu_keberangkatan ?? $pembayaran->pemesanan?->tanggal_pemesanan;
        $tiba = $rawTiba ? Carbon::parse($rawTiba) : now();

        $deadline = $tiba->copy()->addDays(30);
        if ($deadline && now()->greaterThan($deadline)) {
            return response()->json(['message' => 'Batas review 30 hari setelah tiba'], 422);
        }

        // Cegah double review
        $sudahReview = Review::where('id_user', $user->id_user)
            ->where('id_pembayaran', $pembayaran->id_pembayaran)
            ->where('id_tiket', $request->id_tiket)
            ->exists();

        if ($sudahReview) {
            return response()->json(['message' => 'Kamu sudah memberikan review untuk tiket ini'], 422);
        }

        // Simpan review
        $review = Review::create([
            'id_user' => $user->id_user,
            'id_pembayaran' => $pembayaran->id_pembayaran,
            'id_tiket' => $request->id_tiket,
            'rating' => $request->rating,
            'komentar' => $request->komentar,
            'tanggal_review' => now(), 
            'status_review' => $request->status_review??false, 
        ]);


        return response()->json(['message' => 'Review berhasil dibuat','data' => $review], 201);
    }

    // Hapus review
    public function destroy($id, Request $request)
    {
        $user = $request->user();
        $review = Review::find($id);

        if (!$review) {
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
