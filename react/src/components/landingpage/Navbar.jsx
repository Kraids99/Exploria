import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import logo from "../../assets/logo.png"; 

function Navbar() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="fixed inset-x-0 top-0 z-30 border-b border-slate-200 bg-white">
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-4 py-4">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="Exploria" className="h-8 w-auto" />
        </Link>

        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="rounded-full border border-slate-200 px-4 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Logout
            </button>
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
