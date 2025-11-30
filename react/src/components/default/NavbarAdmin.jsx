import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import {
  Building2,
  FileText,
  MapPin,
  Route,
  Ticket,
  CreditCard,
  User,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { BASE_URL } from "../../api";
import { useAuth } from "../../context/AuthContext";
import defaultAvatar from "../../assets/user_default.png";

const normalizeAvatarUrl = (raw) => {
  if (!raw) return defaultAvatar;
  if (raw.startsWith("http")) return raw;

  const host = BASE_URL.replace(/\/+$/, "");
  const cleaned = raw.replace(/^\/+/, "");
  const path = cleaned.startsWith("storage/") ? cleaned : `storage/${cleaned}`;

  return `${host}/${path}`;
};

// Navbar samping kanan
const defaultItems = [
  { label: "Company", icon: Building2, path: "/admin/company" },
  { label: "Lokasi", icon: MapPin, path: "/admin/lokasi" },
  { label: "Rute", icon: Route, path: "/admin/rute" },
  { label: "Tiket", icon: Ticket, path: "/admin/tiket" },
  { label: "Pembayaran", icon: CreditCard, path: "/admin/pembayaran" },
  { label: "Laporan", icon: FileText, path: "/admin/laporan" },
];

export default function NavbarAdmin({ items }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user, refreshAuth, logout } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const menu = items && items.length ? items : defaultItems;

  useEffect(() => {
    if (!user) {
      refreshAuth();
    }
    // refreshAuth not in deps to avoid rerun on provider re-render
  }, [user]);

  const avatarSrc = useMemo(() => {
    const raw = user?.user_profile || user?.foto_user || "";
    return normalizeAvatarUrl(raw);
  }, [user]);

  const displayName = user?.nama || "Admin";
  const displayEmail = user?.email || "admin@example.com";

  const handleProfile = () => {
    setIsProfileOpen(false);
    navigate("/profile?admin=1");
  };

  const handleLogout = () => {
    setIsProfileOpen(false);
    logout();
    navigate("/");
  };

  return (
    <aside className="w-64 bg-gradient-to-b from-[#2b1305] via-[#1f0d05] to-[#150803] text-white flex flex-col">
      <div className="px-5 py-5 border-b border-white/10 relative">
        <h1 className="text-xl font-semibold text-orange-100">Admin Panel</h1>
        <div className="mt-4 relative">
          <button
            type="button"
            onClick={() => setIsProfileOpen((prev) => !prev)}
            className="w-full flex items-center justify-between gap-3 rounded-lg px-1 py-2 text-left hover:bg-white/5 transition"
          >
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full overflow-hidden bg-slate-700/60 flex items-center justify-center text-white font-semibold ring-2 ring-white/10">
                {avatarSrc ? (
                  <img
                    src={avatarSrc}
                    alt="Admin"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = defaultAvatar;
                    }}
                  />
                ) : (
                  displayName
                )}
              </div>
              <div className="leading-tight text-left">
                <p className="text-sm font-semibold text-white">{displayName}</p>
                <p className="text-[12px] text-white/70">{displayEmail}</p>
              </div>
            </div>
            <ChevronDown
              className={`w-4 h-4 text-white/80 transition-transform ${isProfileOpen ? "rotate-180" : ""}`}
            />
          </button>

          {isProfileOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setIsProfileOpen(false)}
              />
              <div className="absolute left-0 right-0 mt-2 w-full rounded-xl border border-white/10 bg-[#1a0f08] py-1 shadow-lg shadow-black/40 z-20">
                <button
                  onClick={handleProfile}
                  className="w-full px-4 py-2 text-sm text-orange-50 text-left hover:bg-white/5 flex items-center gap-3"
                >
                  <User className="w-4 h-4" />
                  Profil
                </button>
                <div className="border-t border-white/10 my-1" />
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-2 text-sm text-red-200 text-left hover:bg-red-500/10 flex items-center gap-3"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {/* kalau map => ( ) return otomatis bedanya dengan { } harus pakai return manual */}
        {menu.map((item) => (
         <Link
            key={item.label}
            to={item.path}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition ${
              item.path && item.path !== "#" && pathname.startsWith(item.path)
                ? "bg-orange-600 text-white shadow-sm"
                : "text-orange-50/90 hover:bg-white/5"
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}
