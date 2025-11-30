<?php

namespace App\Http\Controllers;

use App\Models\Pemesanan;
use App\Models\RincianPemesanan;
use App\Models\Tiket;
use App\Models\Kursi;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Exception;
use Illuminate\Support\Facades\DB;

class PemesananController extends Controller
{
    // Tampilkan semua pemesanan (admin) atau milik sendiri (customer)
    public function index(Request $request)
    {
        $user = $request->user();

        if (!$user) {
            return response()->json(['message' => 'Belum login'], 401);
        }

        if ($user->tokenCan('admin')) {
            $data = Pemesanan::with(['user', 'rincianPemesanan.tiket'])->get();
        } else {
            $data = Pemesanan::with(['rincianPemesanan.tiket'])->where('id_user', $user->id_user)->get();
        }

        return response()->json($data);
    }

    // Tampilkan satu pemesanan berdasarkan id
    public function show($id)
    {
        $pemesanan = Pemesanan::with([
            'user',
            'rincianPemesanan.tiket.company',
            'rincianPemesanan.tiket.rute.asal',
            'rincianPemesanan.tiket.rute.tujuan',
            'pembayaran',
        ])->find($id);

        if (!$pemesanan) {
            return response()->json(['message' => 'Pemesanan tidak ditemukan'], 404);
        }

        return response()->json($pemesanan);
    }

    // Tambah pemesanan baru
    public function store(Request $request)
    {
        $request->validate([
            'id_tiket' => 'required|exists:tikets,id_tiket',
            'kursi_ids' => 'required|array|min:1',
            'kursi_ids.*' => 'integer|exists:kursis,id_kursi', // atau kursi, sesuai nama tabel
        ]);


        try {
            DB::beginTransaction();

            $user = $request->user();

            DB::transaction(function () use ($request, $user, &$pemesanan) {
                // cek kursi masih kosong
                $kursi = Kursi::whereIn('id_kursi', $request->kursi_ids)
                    ->where('status_kursi', 0)
                    ->lockForUpdate()
                    ->get();

                if (count($kursi) !== count($request->kursi_ids)) {
                    abort(422, 'Ada kursi yang sudah dipesan orang lain');
                }

                // tandai kursi jadi terisi
                Kursi::whereIn('id_kursi', $request->kursi_ids)
                    ->update(['status_kursi' => 1]);
            });
            $tiket = Tiket::findOrFail($request->id_tiket);

            $jumlahTiket = count($request->kursi_ids);

            if ($tiket->stok < $jumlahTiket) {
                return response()->json(['message' => 'Stok tiket tidak mencukupi'], 400);
            }

            // kurangi stok
            $tiket->stok -= $jumlahTiket;
            $tiket->save();

            // pemesanan utama
            $pemesanan = Pemesanan::create([
                'id_user' => $user->id_user,
                'tanggal_pemesanan' => now(),
                'total_biaya_pemesanan' => $tiket->harga * $jumlahTiket,
                'status_pemesanan' => 'Menunggu Pembayaran',
                'kode_tiket' => 'EXP-' . strtoupper(Str::random(8)),
            ]);

            if (!$pemesanan->kode_tiket) {
                $pemesanan->kode_tiket = 'EXP-' . now()->format('YmdHis') . '-' . rand(1000, 9999);
                $pemesanan->save();
            }

            // rincian pemesanan (jumlah total saja, sesuai ERD kamu)
            RincianPemesanan::create([
                'id_pemesanan' => $pemesanan->id_pemesanan,
                'id_tiket' => $tiket->id_tiket,
                'jumlah_tiket' => $jumlahTiket,
            ]);

            // update status kursi
            Kursi::whereIn('id_kursi', $request->kursi_ids)
                ->where('id_tiket', $tiket->id_tiket)
                ->update(['status_kursi' => true]);
            
            //cek kursi kosong -> cek stok tiket -> buat pemesanan + rincian 
            // -> tandai kursi terisi -> commit transaksi 

            DB::commit();

            return response()->json([
                'message' => 'Pemesanan berhasil dibuat',
                'data' => $pemesanan->load(['rincianPemesanan.tiket']),
            ], 201);
        } catch (Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Gagal membuat pemesanan',
                'error' => $e->getMessage(),
            ], 500);
        }
    }




    // Batalkan pemesanan berdasarkan id 
    public function cancel($id)
    {
        $pemesanan = Pemesanan::with('rincianPemesanan')->find($id);

        if (!$pemesanan) {
            return response()->json(['message' => 'Pemesanan tidak ditemukan'], 404);
        }

        if ($pemesanan->status_pemesanan === 'Dibatalkan') {
            return response()->json(['message' => 'Pemesanan sudah dibatalkan']);
        }

        // kembalikan stok tiket
        foreach ($pemesanan->rincianPemesanan as $rincian) {
            $tiket = Tiket::find($rincian->id_tiket);
            if ($tiket) {
                $tiket->stok += $rincian->jumlah_tiket;
                $tiket->save();
            }
        }

        $pemesanan->update(['status_pemesanan' => 'Dibatalkan']);

        return response()->json(['message' => 'Pemesanan berhasil dibatalkan']);
    }
}
