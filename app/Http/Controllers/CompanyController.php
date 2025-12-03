<?php

namespace App\Http\Controllers;

use App\Models\Company;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

class CompanyController extends Controller
{
    // Tampilkan semua company
    public function index()
    {
        $companies = Company::all();

        return response()->json([
            'message' => 'Daftar semua company',
            'data' => $companies
        ]);
    }

    // Tampilkan satu company berdasarkan id
    public function show($id)
    {
        $company = Company::find($id);

        if (!$company) {
            return response()->json(['message' => 'Company tidak ditemukan'], 404);
        }

        return response()->json([
            'message' => 'Detail company ditemukan',
            'data' => $company
        ]);
    }

    // Tambah company baru (admin only)
    public function store(Request $request)
    {
        $data = $request->validate([
            'nama_company' => 'required|string|max:255',
            'email_company' => 'required|string|email|max:255|unique:companies,email_company',
            'no_telp_company' => 'required|string|max:20',
            'alamat_company' => 'required|string|max:255',
            'logo_company' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
        ]);

        if ($request->hasFile('logo_company')) {
            $data['logo_company'] = $request->file('logo_company')->store('company-logos', 'public');
        }

        $company = Company::create($data);

        return response()->json([
            'message' => 'Company berhasil ditambahkan',
            'data' => $company
        ], 201);
    }

    // Update company (admin only)
    public function update(Request $request, $id)
    {
        $company = Company::find($id);

        if (!$company) {
            return response()->json(['message' => 'Company tidak ditemukan'], 404);
        }

        $data = $request->validate([
            'nama_company' => 'sometimes|string|max:255',
            'email_company' => ['sometimes','email','max:255', Rule::unique('companies', 'email_company')->ignore($id,'id_company'),],
            'no_telp_company' => 'sometimes|string|max:20',
            'alamat_company' => 'sometimes|string|max:255',
            'logo_company' => 'sometimes|file|image|max:2048',
        ]);

        if ($request->hasFile('logo_company')) {
            if ($company->logo_company) {
                Storage::disk('public')->delete($company->logo_company);
            }
            $data['logo_company'] = $request->file('logo_company')->store('company-logos', 'public');
        }

        $company->update($data);

        return response()->json([
            'message' => 'Company berhasil diupdate',
            'data' => $company
        ]);
    }


    // Hapus company (admin only)
    public function destroy($id)
    {
        $company = Company::find($id);

        if (!$company) {
            return response()->json(['message' => 'Company tidak ditemukan'], 404);
        }

        // Kalau ada tiket pakai ni company
        if ($company->tikets()->exists()) {
            return response()->json(['message' => 'Company memiliki tiket aktif/riwayat, tidak bisa dihapus'], 422);
        }

        $company->delete();

        return response()->json(['message' => 'Company berhasil dihapus']);
    }
}
