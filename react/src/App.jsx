import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/customer/Home";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import { AuthProvider, useAuth } from "./context/AuthContext";
import SelectBus from "./pages/customer/Tiket";
import DetailTiket from "./pages/customer/DetailTiket";
import Profile from "./pages/customer/Profile"
import Payment from "./pages/customer/Payment.jsx";
import Payment2 from "./pages/customer/Payment2.jsx";
import Payment3 from "./pages/customer/Payment3.jsx";
import Company from "./pages/admin/company/Company.jsx";
import CompanyCreate from "./pages/admin/company/CompanyCreate.jsx";
import CompanyEdit from "./pages/admin/company/CompanyEdit.jsx";
import Lokasi from "./pages/admin/lokasi/Lokasi.jsx";
import LokasiCreate from "./pages/admin/lokasi/LokasiCreate.jsx";
import LokasiEdit from "./pages/admin/lokasi/LokasiEdit.jsx";
import Rute from "./pages/admin/rute/Rute.jsx";
import RuteCreate from "./pages/admin/rute/RuteCreate.jsx";
import RuteEdit from "./pages/admin/rute/RuteEdit.jsx";
import Tiket from "./pages/admin/tiket/Tiket.jsx";
import TiketCreate from "./pages/admin/tiket/TiketCreate.jsx";
import TiketEdit from "./pages/admin/tiket/TiketEdit.jsx";

// routernya Admin
function AdminRoute({ children }) {
  const { isAuthenticated, isAdmin } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
}

// Landing route: jika admin sudah login, langsung ke dashboard admin
function LandingRoute() {
  const { isAuthenticated, isAdmin } = useAuth();
  if (isAuthenticated && isAdmin) {
    return <Navigate to="/admin/company" replace />;
  }
  return <Home />;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingRoute />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/search" element={<SelectBus />} />
          <Route path="/detailTiket/:id" element={<DetailTiket />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/selectpayment/:id" element={<Payment />} />
          <Route path="/payment/:id" element={<Payment2 />} />
          <Route path="/ereceipt/:id" element={<Payment3 />} />
          <Route path="/admin/company" element={<AdminRoute><Company /></AdminRoute>} />
          <Route path="/admin/company/create" element={<AdminRoute><CompanyCreate /></AdminRoute>} />
          <Route path="/admin/company/:id/edit" element={<AdminRoute><CompanyEdit /></AdminRoute>} />
          <Route path="/admin/lokasi" element={<AdminRoute><Lokasi /></AdminRoute>} />
          <Route path="/admin/lokasi/create" element={<AdminRoute><LokasiCreate /></AdminRoute>} />
          <Route path="/admin/lokasi/:id/edit" element={<AdminRoute><LokasiEdit /></AdminRoute>} />
          <Route path="/admin/rute" element={<AdminRoute><Rute /></AdminRoute>} />
          <Route path="/admin/rute/create" element={<AdminRoute><RuteCreate /></AdminRoute>} />
          <Route path="/admin/rute/:id/edit" element={<AdminRoute><RuteEdit /></AdminRoute>} />
          <Route path="/admin/tiket" element={<AdminRoute><Tiket /></AdminRoute>} />
          <Route path="/admin/tiket/create" element={<AdminRoute><TiketCreate /></AdminRoute>} />
          <Route path="/admin/tiket/:id/edit" element={<AdminRoute><TiketEdit /></AdminRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
