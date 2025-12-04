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
import defaultAvatar from "../../assets/user_default.png";


//helper untuk memastikan url profile valid 

const normalizeAvatarUrl = (raw) => {
  if (!raw) return defaultAvatar;
  if (raw.startsWith("http")) return raw;

  const host = BASE_URL.replace(/\/+$/, "");
  const cleaned = raw.replace(/^\/+/, "");
  const path = cleaned.startsWith("storage/") ? cleaned : `storage/${cleaned}`;

  return `${host}/${path}`;
};

//menu default sidebar admin 
const defaultItems = [
  { label: "Company", icon: Building2, path: "/admin/company" },
  { label: "Lokasi", icon: MapPin, path: "/admin/lokasi" },
  { label: "Rute", icon: Route, path: "/admin/rute" },
  { label: "Tiket", icon: Ticket, path: "/admin/tiket" },
  { label: "Pembayaran", icon: CreditCard, path: "/admin/pembayaran" },
  { label: "Laporan", icon: FileText, path: "/admin/laporan" },
];

function NavbarAdmin({ items }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch (err) {
      return null;
    }
  });
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const menu = items && items.length ? items : defaultItems;

  //sinkron user kalau local berubah 
  useEffect(() => {
    const syncUser = () => {
      try {
        setUser(JSON.parse(localStorage.getItem("user")));
      } catch (err) {
        setUser(null);
      }
    };

    syncUser();
    window.addEventListener("storage", syncUser);
    return () => window.removeEventListener("storage", syncUser);
  }, []);

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
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <aside
      className="
        group
        relative flex
        w-16 md:w-64
        hover:w-52 md:hover:w-64
        transition-[width]
        duration-300
        ease-in-out
        bg-gradient-to-b
        from-[#2b1305]
        via-[#1f0d05]
        to-[#150803]
        text-white
        flex-col
      "
    >
      <div className="px-3 py-4 border-b border-white/10 relative">
        <div className="flex flex-col items-center gap-3 md:flex-row md:items-center">
          <div className="w-11 h-11 rounded-full overflow-hidden bg-slate-700/60 flex items-center justify-center text-white font-semibold ring-2 ring-white/10">
            <img
              src={avatarSrc}
              alt="Admin"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = defaultAvatar;
              }}
            />
          </div>

          <div className="hidden group-hover:block md:block leading-tight text-left">
            <h1 className="text-sm font-semibold text-orange-100">
              Admin Panel
            </h1>
            <p className="text-[12px] text-white/80">{displayName}</p>
            <p className="text-[11px] text-white/60">{displayEmail}</p>
          </div>
        </div>

        {/* Tombol dropdown profile */}
        <button
          type="button"
          onClick={() => setIsProfileOpen((prev) => !prev)}
          className="absolute right-2 top-4 p-1 rounded-full hover:bg-white/10 transition"
        >
          <ChevronDown
            className={`w-4 h-4 text-white/80 transition-transform ${
              isProfileOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {isProfileOpen && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setIsProfileOpen(false)}
            />
            <div className="absolute left-2 right-2 mt-2 rounded-xl border border-white/10 bg-[#1a0f08] py-1 shadow-lg shadow-black/40 z-20">
              <button
                onClick={handleProfile}
                className="w-full px-4 py-2 text-sm text-orange-50 text-left hover:bg-white/5 flex items-center gap-3"
              >
                <User className="w-4 h-4" />
                <span>Profil</span>
              </button>
              <div className="border-t border-white/10 my-1" />
              <button
                onClick={handleLogout}
                className="w-full px-4 py-2 text-sm text-red-200 text-left hover:bg-red-500/10 flex items-center gap-3"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </>
        )}
      </div>

      <nav className="flex-1 px-2 py-4 space-y-2 overflow-y-auto">
        {menu.map((item) => {
          const active =
            item.path &&
            item.path !== "#" &&
            pathname.startsWith(item.path);

          return (
            <Link
              key={item.label}
              to={item.path}
              className={`
                flex items-center gap-3
                px-3 py-2.5 rounded-lg text-sm
                justify-center md:justify-start group-hover:justify-start
                transition
                ${
                  active
                    ? "bg-orange-600 text-white shadow-sm"
                    : "text-orange-50/90 hover:bg-white/5"
                }
              `}
            >
              <item.icon className="w-5 h-5 shrink-0" />
              <span className="hidden group-hover:inline md:inline whitespace-nowrap">
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

export default NavbarAdmin;