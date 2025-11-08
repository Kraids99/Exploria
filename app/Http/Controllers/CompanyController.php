<?php

namespace App\Http\Controllers;

use App\Models\Company;
use Illuminate\Http\Request;

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

        if(!$company){
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
        $request->validate([
            'nama_company' => 'required|string|max:255',
            'email_company' => 'required|string|email|max:255|unique:companies,email_company',
            'no_telp_company' => 'required|string|max:20',
            'alamat_company' => 'required|string|max:255',
        ]);

        $company = Company::create([
            'nama_company' => $request->nama_company,
            'email_company' => $request->email_company,
            'no_telp_company' => $request->no_telp_company,
            'alamat_company' => $request->alamat_company,
        ]);

        return response()->json([
            'message' => 'Company berhasil ditambahkan',
            'data' => $company
        ], 201);
    }
    
    // Update company (admin only)
    public function update(Request $request, $id)
    {
        $company = Company::find($id);

        if(!$company){
            return response()->json(['message' => 'Company tidak ditemukan'], 404);
        }

        $data = $request->validate([
            'nama_company' => 'sometimes|string|max:255',
            'email_company' => 'sometimes|string|email|max:255|unique:companies,email_company,' . $id . ',id_company',
            'no_telp_company' => 'sometimes|string|max:20',
            'alamat_company' => 'sometimes|string|max:255',
        ]);

        // $company->update($data);
        $company->update($request->only([
            'nama_company',
            'email_company',
            'no_telp_company',
            'alamat_company'
        ]));

        return response()->json([
            'message' => 'Company berhasil diupdate',
            'data' => $company
        ]);
    }

    
    // Hapus company (admin only)
    public function destroy($id)
    {
        $company = Company::find($id);

        if(!$company){
            return response()->json(['message' => 'Company tidak ditemukan'], 404);
        }

        $company->delete();

        return response()->json(['message' => 'Company berhasil dihapus']);
    }
}
