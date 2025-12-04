import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/customer/home/Home.jsx";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import SelectBus from "./pages/customer/tiket/Tiket.jsx";
import DetailTiket from "./pages/customer/tiket/DetailTiket.jsx";
import Profile from "./pages/customer/profile/Profile.jsx";
import Payment from "./pages/customer/payment/Payment.jsx";
import Payment2 from "./pages/customer/payment/Payment2.jsx";
import Payment3 from "./pages/customer/payment/Payment3.jsx";
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
import PembayaranAdmin from "./pages/admin/pembayaran/Pembayaran.jsx";
import Laporan from "./pages/admin/laporan/Laporan.jsx";
import Pemesanan from "./pages/customer/pemesanan/Pemesanan.jsx";
import ReviewPemesanan from "./pages/customer/pemesanan/ReviewPemesanan.jsx"; 
import History from "./pages/customer/history/History.jsx";
import AdminRoute from "./routes/AdminRoute.jsx";
import CustomerRoute from "./routes/CustomerRoute.jsx";
import AuthRoute from "./routes/AuthRoute.jsx";
import Bali from "./components/detaillandingpage/destinasi/Bali.jsx"; 
import Bandung from "./components/detaillandingpage/destinasi/Bandung.jsx";
import Yogyakarta from "./components/detaillandingpage/destinasi/Yogyakarta.jsx";
import Surabaya from "./components/detaillandingpage/destinasi/Surabaya.jsx"; 
import Discount from "./components/detaillandingpage/deals/Diskon.jsx";

function LandingRoute() {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (token && role === "admin") {
    return <Navigate to="/admin/company" replace />;
  }
  return <Home />;
}

{/* <CustomerRoute> itu punya customer */}
{/* <AdminRoute> itu punya admin */}
// sisanya public route

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingRoute />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/search" element={<SelectBus />} />
        <Route path="/detailTiket/:id" element={<DetailTiket />} />
        <Route path="/pesan/:id_tiket" element={<CustomerRoute><Pemesanan /></CustomerRoute>}/>
        <Route path="/reviewPesanan/:id_pemesanan" element={<CustomerRoute><ReviewPemesanan /></CustomerRoute>}/>
        <Route path="/selectpayment/:id_pemesanan" element={<CustomerRoute><Payment /></CustomerRoute>} />
        <Route path="/payment/:id_pembayaran" element={<CustomerRoute><Payment2 /></CustomerRoute>} />
        <Route path="/ereceipt/:id" element={<CustomerRoute><Payment3 /></CustomerRoute>} />
        <Route path="/profile" element={<AuthRoute><Profile /></AuthRoute>} />
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
        <Route path="/admin/pembayaran" element={<AdminRoute><PembayaranAdmin /></AdminRoute>} />
        <Route path="/admin/laporan" element={<AdminRoute><Laporan /></AdminRoute>} />
        <Route path="/history" element={<CustomerRoute><History /></CustomerRoute>} />
        <Route path="/history" element={<History />}/>
          <Route path="/destinasi/bali" element={<Bali />}/>
          <Route path="/destinasi/bandung" element={<Bandung />}/>
          <Route path="/destinasi/yogyakarta" element={<Yogyakarta />}/>
          <Route path="/destinasi/surabaya" element={<Surabaya />}/>
          <Route path="/diskon" element={<Discount />}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
