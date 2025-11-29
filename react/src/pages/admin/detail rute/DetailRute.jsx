import React from "react";
import NavbarAdmin from "../../../components/default/NavbarAdmin.jsx";

// Placeholder: backend belum ada endpoint detail rute.
export default function DetailRutePlaceholder() {
  return (
    <div className="min-h-screen flex bg-orange-50">
      <NavbarAdmin />
      <main className="flex-1 p-6 lg:p-10">
        <h1 className="text-2xl font-semibold text-orange-900">Detail Rute</h1>
        <p className="text-sm text-orange-700 mt-2">
          Endpoint detail rute belum tersedia di backend. Tambahkan route & controller dulu untuk CRUD detail rute.
        </p>
      </main>
    </div>
  );
}
