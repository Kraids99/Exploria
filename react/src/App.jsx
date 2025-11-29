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
          <Route path="/profile" element={<Profile/>}/>
          <Route path="/selectpayment/:id" element={<Payment />}/>
          <Route path="/payment/:id" element={<Payment2 />}/>
          <Route path="/ereceipt/:id" element={<Payment3 />}/>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
