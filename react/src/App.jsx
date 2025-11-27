import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Payment from "./pages/Payment";
import Payment2 from "./pages/Payment2.jsx";
import Payment3 from "./pages/Payment3.jsx";
import { AuthProvider } from "./context/AuthContext";
import SelectBus from "./pages/SelectBus";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/search" element={<SelectBus />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/payment2" element={<Payment2 />} />
          <Route path="/payment3" element={<Payment3 />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
