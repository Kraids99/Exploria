import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { BASE_URL } from "../../api/index.jsx";
import logo from "../../assets/logo.png";
import defaultAvatar from "../../assets/user_default.png";

function Navbar() {
  const { isAuthenticated, user, role, logout } = useAuth();
  const navigate = useNavigate();
  const [openMenu, setOpenMenu] = useState(false);

  const handleLogout = () => {
    logout();
    localStorage.removeItem("token");
    setOpenMenu(false);
    navigate("/");
  };

  const handleProfile = () => {
    setOpenMenu(false);
    navigate("/profile");
  };

  const handleHome = () => {
    setOpenMenu(false);
    navigate("/");
  };

  // Foto dari backend sering berupa path relatif (storage/...). Fungsi ini bikin URL penuh.
  const normalizeUrl = (url) => {
    if (!url) return "";
    if (url.startsWith("http")) return url;
    return url.startsWith("/") ? `${BASE_URL}${url}` : `${BASE_URL}/${url}`;
  };

  // pakai avatar dari user jika ada, jika tidak gunakan default asset
  const avatarSrc = normalizeUrl(user?.foto_user || user?.avatar) || defaultAvatar;
  const displayName = user?.nama || "Customer";
  const displayRole = role === "admin" ? "Admin" : "Customer";

  return (
    <header className="fixed inset-x-0 top-0 z-30 border-b border-slate-200 bg-white">
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-4 py-4">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="Exploria" className="h-8 w-auto" />
        </Link>

        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setOpenMenu((v) => !v)}
                className="flex items-center gap-2 rounded-full border border-slate-200 px-2 py-1.5 text-left hover:bg-slate-50"
              >
                <img
                  src={avatarSrc}
                  alt="User avatar"
                  className="h-8 w-8 rounded-full object-cover"
                />
                <div className="hidden sm:flex flex-col leading-tight">
                  <span className="text-sm font-semibold text-slate-900">{displayName}</span>
                  <span className="text-xs text-slate-500">{displayRole}</span>
                </div>
                <span className="text-slate-500 text-lg">▼</span>
              </button>

              {openMenu && (
                <div className="absolute right-0 mt-2 w-48 rounded-xl border border-slate-200 bg-white shadow-lg py-1">
                  <button
                    onClick={handleHome}
                    className="w-full px-4 py-2 text-sm text-slate-700 text-left hover:bg-slate-50"
                  >
                    Home
                  </button>
                  <button
                    onClick={handleProfile}
                    className="w-full px-4 py-2 text-sm text-slate-700 text-left hover:bg-slate-50"
                  >
                    Profil
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2 text-sm text-red-600 text-left hover:bg-red-50"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                to="/login"
                className="rounded-full border border-slate-200 px-4 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="rounded-full border border-slate-200 px-4 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
