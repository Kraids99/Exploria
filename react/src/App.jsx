import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Payment from "./pages/Payment";
import Payment2 from "./pages/Payment2.jsx";
import Payment3 from "./pages/Payment3.jsx";
import { AuthProvider } from "./context/AuthContext";
import SelectBus from "./pages/SelectBus";
import DetailTiket from "./pages/DetailTiket";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/search" element={<SelectBus />} />
          <Route path="/detailTiket/:id" element={<DetailTiket />}/>
          <Route path="/payment/:id" element={<Payment />}/>
          <Route path="/selectpayment/:id" element={<Payment2 />}/>
          <Route path="/ereceipt/:id" element={<Payment3 />}/>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
