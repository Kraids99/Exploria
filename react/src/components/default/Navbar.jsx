import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { BASE_URL } from "../../api/index.jsx";
import logo from "../../assets/logo.png";
import logovertical from "../../assets/logo-v.png";
import defaultAvatar from "../../assets/user_default.png";
import { Home, User, LogOut } from "lucide-react";

function Navbar() {
  const { isAuthenticated, user, role, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

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

  const normalizeUrl = (url) => {
    if (!url) return "";
    if (url.startsWith("http")) return url;
    return url.startsWith("/") ? `${BASE_URL}${url}` : `${BASE_URL}/${url}`;
  };

  const avatarSrc =
    normalizeUrl(user?.foto_user || user?.avatar) || defaultAvatar;
  const displayName = user?.nama || "Customer";
  const displayRole = role === "admin" ? "Admin" : "Customer";

  // ========= DI SINI: daftar route yang mau pakai sidebar di mobile =========
  const isAdminRoute = location.pathname.startsWith("/admin");
  const isAuthPage =   location.pathname === "/login" || location.pathname === "/register";
  
  // daftar halaman customer yang mau punya sidebar di mobile
  const shouldUseSidebarRoute =
    !isAdminRoute &&
    !isAuthPage &&
    (
      location.pathname === "/" ||
      location.pathname.startsWith("/profile") ||
      location.pathname.startsWith("/search") ||
      location.pathname.startsWith("/detailTiket") ||
      location.pathname.startsWith("/pesan") ||
      location.pathname.startsWith("/reviewPesanan") ||
      location.pathname.startsWith("/selectpayment") ||
      location.pathname.startsWith("/payment") ||
      location.pathname.startsWith("/ereceipt") ||
      location.pathname.startsWith("/history")
      );
  
  const showSidebarMobile = isAuthenticated && shouldUseSidebarRoute;
  return (
    <>
      {/* ================= DESKTOP / TABLET: TOP NAVBAR ================= */}
      <header className="fixed inset-x-0 top-0 z-30 border-b border-slate-200 bg-white hidden md:block">
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
                    <span className="text-sm font-semibold text-slate-900">
                      {displayName}
                    </span>
                    <span className="text-xs text-slate-500">
                      {displayRole}
                    </span>
                  </div>
                  <span className="text-slate-500 text-lg">▼</span>
                </button>

                {openMenu && (
                  <div className="absolute right-0 mt-2 w-48 rounded-full border border-slate-200 bg-white shadow-lg py-1">
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
                  className="rounded-full bg-[#f38f4a] border border-slate-200 px-4 py-1.5 text-sm font-semibold text-white hover:bg-amber-600 transition"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </nav>
      </header>

      {/* ============= MOBILE: MINI SIDEBAR KIRI (LOGIN + route tertentu) ============= */}
      {showSidebarMobile && (
        <aside className="fixed left-0 top-0 z-30 h-full md:hidden group">
          <div
            className="
              h-full
              w-14 group-hover:w-56
              bg-white
              border-r border-slate-200
              shadow-lg
              transition-[width] duration-300 ease-in-out
              flex flex-col items-center
              py-4
            "
          >
            {/* Logo (pure image, no button) */}
            <div className="mb-6 flex w-full justify-center">
              <img
                src={logovertical}
                alt="Exploria"
                className="h-10 w-auto object-contain"
              />
            </div>

            {/* Menu utama */}
            <nav className="flex flex-col gap-2 w-full">
              {/* Home */}
              <button
                type="button"
                onClick={handleHome}
                className="
                  flex items-center gap-3
                  rounded-2xl px-3 py-2.5
                  hover:bg-slate-50
                  w-full
                  justify-center group-hover:justify-start
                  transition-colors duration-200
                "
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-800">
                  <Home className="h-5 w-5" />
                </div>
                <span
                  className="
                    hidden group-hover:inline
                    text-sm font-medium text-slate-800
                  "
                >
                  Home
                </span>
              </button>

              {/* Profil */}
              <button
                type="button"
                onClick={handleProfile}
                className="
                  flex items-center gap-3
                  rounded-2xl px-3 py-2.5
                  hover:bg-slate-50
                  w-full
                  justify-center group-hover:justify-start
                  transition-colors duration-200
                "
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-800">
                  <User className="h-5 w-5" />
                </div>
                <span
                  className="
                    hidden group-hover:inline
                    text-sm font-medium text-slate-800
                  "
                >
                  Profil
                </span>
              </button>
            </nav>

            {/* Spacer biar logout di bawah */}
            <div className="flex-1" />

            {/* Logout */}
            <button
              type="button"
              onClick={handleLogout}
              className="
                mb-3
                flex items-center gap-3
                rounded-2xl px-3 py-2.5
                hover:bg-red-50
                w-full
                justify-center group-hover:justify-start
                transition-colors duration-200
              "
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-red-600">
                <LogOut className="h-5 w-5" />
              </div>
              <span
                className="
                  hidden group-hover:inline
                  text-sm font-medium text-red-600
                "
              >
                Logout
              </span>
            </button>
          </div>
        </aside>
      )}

      {/* ============= MOBILE: TOP NAVBAR (guest / halaman tanpa sidebar) ============= */}
      {(!isAuthenticated || !showSidebarMobile) && (
        <header className="fixed inset-x-0 top-0 z-30 border-b border-slate-200 bg-white md:hidden">
          <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
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
                    <span className="text-sm font-semibold text-slate-900">
                      {displayName}
                    </span>
                    <span className="text-slate-500 text-lg">▼</span>
                  </button>

                  {openMenu && (
                    <div className="absolute right-0 mt-2 w-44 rounded-xl border border-slate-200 bg-white shadow-lg py-1">
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
                    className="rounded-full bg-[#f38f4a] border border-slate-200 px-4 py-1.5 text-sm font-semibold text-white hover:bg-amber-600 transition"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </nav>
        </header>
      )}
    </>
  );
}

export default Navbar;
