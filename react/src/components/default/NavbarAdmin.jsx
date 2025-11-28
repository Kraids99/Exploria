import React, { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
    Building2,
    FileText,
    MapPin,
    Route,
    Ticket,
    User,
    Settings,
    LogOut,
    ChevronDown,
    CreditCard,
} from "lucide-react";
import { BASE_URL } from "../../api";

// Navbar samping kanan
const defaultItems = [
    { label: "Company", icon: Building2, path: "/admin/company" },
    { label: "Lokasi", icon: MapPin, path: "/admin/lokasi" },
    { label: "Detail Rute", icon: FileText, path: "/admin/detail-rute" },
    { label: "Rute", icon: Route, path: "/admin/rute" },
    { label: "Tiket", icon: Ticket, path: "/admin/tiket" },
    { label: "Pembayaran", icon: CreditCard, path: "/admin/pembayaran"},
];

export default function NavbarAdmin({ items }) {
    const { pathname } = useLocation();
    const navigate = useNavigate();
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const menu = items && items.length ? items : defaultItems;
    const user = useMemo(() => {
        try {
            return JSON.parse(localStorage.getItem("user") || "null");
        } catch (e) {
            return null;
        }
    }, []);

    const avatarSrc = useMemo(() => {
        if (!user?.user_profile) return null;
        return `${BASE_URL}/storage/${user.user_profile}`;
    }, [user]);

    return (
        <aside className="w-64 bg-gradient-to-b from-[#2b1305] via-[#1f0d05] to-[#150803] text-white flex flex-col">
            <div className="px-5 py-5 border-b border-white/10 relative">
                <h1 className="text-xl font-semibold text-orange-100">Admin Panel</h1>
                <div className="mt-4">
                    <button
                        type="button"
                        onClick={() => setIsProfileOpen((prev) => !prev)}
                        className="w-full flex items-center justify-between gap-3 px-3 py-2 rounded-lg hover:bg-white/10 transition"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-11 h-11 rounded-full overflow-hidden bg-gradient-to-br from-orange-400 to-amber-600 flex items-center justify-center text-white font-semibold ring-2 ring-white/20">
                                {avatarSrc ? (
                                    <img
                                        src={avatarSrc}
                                        alt="Admin"
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            e.currentTarget.style.display = "none";
                                        }}
                                    />
                                ) : (
                                    (user?.nama || "A").charAt(0).toUpperCase()
                                )}
                            </div>
                            <div className="leading-tight text-left">
                                <p className="text-sm font-semibold">
                                    {user?.nama || "Admin"}
                                </p>
                                <p className="text-[11px] text-orange-100/70">
                                    {user?.email || "admin@example.com"}
                                </p>
                            </div>
                        </div>
                        <ChevronDown
                            className={`w-4 h-4 text-orange-100/80 transition-transform ${isProfileOpen ? "rotate-180" : ""
                                }`}
                        />
                    </button>

                    {isProfileOpen && (
                        <>
                            <div
                                className="fixed inset-0 z-10"
                                onClick={() => setIsProfileOpen(false)}
                            />
                            <div className="absolute left-5 right-5 mt-2 bg-white text-slate-800 rounded-xl shadow-2xl border border-slate-100 py-2 z-20">
                                <button
                                    onClick={() => {
                                        setIsProfileOpen(false);
                                        navigate("/profile?admin=1");
                                    }}
                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-orange-50 hover:text-orange-700 transition"
                                >
                                    <User className="w-4 h-4" />
                                    Profil Saya
                                </button>
                                <button
                                    onClick={() => {
                                        setIsProfileOpen(false);
                                        navigate("/settings?admin=1");
                                    }}
                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-orange-50 hover:text-orange-700 transition"
                                >
                                    <Settings className="w-4 h-4" />
                                    Pengaturan
                                </button>
                                <div className="border-t border-slate-100 my-1" />
                                <button
                                    onClick={() => {
                                        setIsProfileOpen(false);
                                        localStorage.clear();
                                        navigate("/");
                                    }}
                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition"
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
                    <a
                        key={item.label}
                        href={item.path}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition ${item.path && item.path !== "#" && pathname.startsWith(item.path)
                                ? "bg-orange-600 text-white shadow-sm"
                                : "text-orange-50/90 hover:bg-white/5"
                            }`}
                    >
                        <item.icon className="w-5 h-5" />
                        <span>{item.label}</span>
                    </a>
                ))}
            </nav>
        </aside>
    );
}
