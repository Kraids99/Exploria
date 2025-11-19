// src/components/Navbar.jsx
import logoExploria from "../assets/logo.png"; // ← path logo kamu

function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar-inner">
        {/* LOGO */}
        <div className="nav-logo">
          <img
            src={logoExploria}
            alt="Exploria logo"
            className="nav-logo-img"
          />
        </div>

        {/* AKSI KANAN */}
        <div className="nav-actions">
          <button className="btn-outline">Login</button>
          <button className="btn-primary">Sign Up</button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
