<?php

namespace App\Http\Controllers;

use App\Models\Tiket;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Carbon;

class TiketController extends Controller
{
    // Tampilkan semua tiket
    public function index()
    {
        $allTiket = Tiket::where('waktu_keberangkatan', '>=', Carbon::now())->get();
        return response()->json($allTiket);
    }

    // Tampilan satu tiket berdasarkan id
    public function show($id)
    {
        $tiket = Tiket::with(['company', 'rute.asal', 'rute.tujuan'])
            ->where('waktu_keberangkatan', '>=', Carbon::now())
            ->find($id);

        if (!$tiket) {
            return response()->json(['message' => 'Tiket tidak ditemukan'], 404);
        }

        return response()->json([
            'message' => 'Detail tiket',
            'data' => $tiket,
        ]);
    }


    // Buat tiket baru (admin only)
    public function store(Request $request)
    {
        $request->validate([
            'id_rute' => 'required|exists:rutes,id_rute',
            'id_company' => 'required|exists:companies,id_company',
            'nama_tiket' => 'required|string|max:255',
            'jumlah_kursi' => 'required|integer|min:1',
            'waktu_keberangkatan' => 'required|date_format:m/d/Y H:i:s',
            'waktu_tiba' => 'required|date_format:m/d/Y H:i:s|after:waktu_keberangkatan',
            // 'waktu_keberangkatan' => 'required|dateTime',
            // 'waktu_tiba' => 'required|dateTime|after:waktu_keberangkatan',
            'durasi' => 'required|integer|min:1',
            'harga' => 'required|numeric|min:0',
            'stok' => 'required|integer|min:0',
        ]);

        // Pastikan waktu keberangkatan tidak di masa lalu
        $berangkat = Carbon::createFromFormat('m/d/Y H:i:s', $request->waktu_keberangkatan);
        if($berangkat->isPast()) 
        {
            return response()->json([
                'message' => 'Waktu keberangkatan tidak boleh di masa lalu'
            ], 422);
        }

        $tiket = Tiket::create([
            'id_rute' => $request['id_rute'],
            'id_company' => $request['id_company'],
            'nama_tiket' => $request['nama_tiket'],
            'jumlah_kursi' => $request['jumlah_kursi'],
            'waktu_keberangkatan' => $request['waktu_keberangkatan'],
            'waktu_tiba' => $request['waktu_tiba'],
            'durasi' => $request['durasi'],
            'harga' => $request['harga'],
            'stok' => $request['stok'],
        ]);

        return response()->json([
            'message' => 'Tiket berhasil dibuat',
            'data' => $tiket
        ], 201);
    }

    // Update tiket (admin only)
    public function update(Request $request, $id)
    {

        $tiket = Tiket::find($id);

        if (!$tiket) {
            return response()->json(['message' => 'Tiket tidak ditemukan'], 404);
        }

        $request->validate([
            'id_rute' => 'sometimes|exists:rutes,id_rute',
            'id_company' => 'sometimes|exists:companies,id_company',
            'nama_tiket' => 'sometimes|string|max:255',
            'jumlah_kursi' => 'sometimes|integer|min:1',
            'waktu_keberangkatan' => 'sometimes|date',
            'waktu_tiba' => 'sometimes|date|after:waktu_keberangkatan',
            'durasi' => 'sometimes|integer|min:1',
            'harga' => 'sometimes|numeric|min:0',
            'stok' => 'sometimes|integer|min:0',
        ]);

        // cek harus lebih dr masa lalu
        if ($request->has('waktu_keberangkatan')) {
            $berangkat = Carbon::parse($request->waktu_keberangkatan);
            if ($berangkat->isPast()) {
                return response()->json([
                    'message' => 'Waktu keberangkatan tidak boleh di masa lalu'
                ], 422);
            }
        }

        if ($request->has('waktu_tiba')) {
            $tiba = Carbon::parse($request->waktu_tiba);
            if ($tiba->isPast()) {
                return response()->json([
                    'message' => 'Waktu tiba tidak boleh di masa lalu'
                ], 422);
            }
        }

        $tiket->update($request->all());

        return response()->json([
            'message' => 'Tiket berhasil diupdate',
            'data' => $tiket
        ]);
    }

    // Hapus tiket (admin only)
    public function destroy($id)
    {
        $tiket = Tiket::find($id);

        if (!$tiket) {
            return response()->json(['message' => 'Tiket tidak ditemukan'], 404);
        }

        $tiket->delete();
        return response()->json(['message' => 'Tiket berhasil dihapus']);
    }

    // Cari tiket berdasarkan kota asal, kota tujuan, dan tanggal (customer)
    public function search(Request $request)
    {
        $from = $request->from;
        $to = $request->to;
        $date = $request->date;
        $start = Carbon::parse($date)->startOfDay();
        $end = Carbon::parse($date)->addDays(7)->endOfDay();
        $now = Carbon::now();

        $tiket = Tiket::with(['company', 'rute.asal', 'rute.tujuan'])
            ->whereHas('rute.asal', function ($q) use ($from) {
                $q->where('kota', $from);
            })
            ->whereHas('rute.tujuan', function ($q) use ($to) {
                $q->where('kota', $to);
            })
            ->whereBetween('waktu_keberangkatan', [
                $start,
                $end
            ])
            ->where('waktu_keberangkatan', '>=', $now)
            ->get();

        return response()->json($tiket);
    }
}
