import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/customer/Home";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import { AuthProvider } from "./context/AuthContext";
import SelectBus from "./pages/customer/Tiket";
import DetailTiket from "./pages/customer/DetailTiket";
import Profile from "./pages/customer/Profile"

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/search" element={<SelectBus />} />
          <Route path="/detailTiket/:id" element={<DetailTiket />} />
          <Route path="/profile" element={<Profile/>}/>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
