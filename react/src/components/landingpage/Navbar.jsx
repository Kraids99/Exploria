import logoExploria from "../../assets/logo.png"; 
import "../../style/landingpage/navBar.css";
import "../../App.css";

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
          <button className="btn-login">Login</button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
