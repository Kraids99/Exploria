import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Payment from "./pages/Payment";
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
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
