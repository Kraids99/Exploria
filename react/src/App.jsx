import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
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
          <Route path="/detailTiket/:id" element={<DetailTiket />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
