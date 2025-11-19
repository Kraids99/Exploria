import logoH from "../../assets/logo-h.jpg"; 
import "../../style/landingpage/footer.css";
import "../../App.css";

function Footer() {
  return (
    <footer className="footer" id="contact">
      <div className="footer-inner">
        <div className="footer-left">
          <div className="footer-logo">
            <div className="footer-logo-icon">
              <img src={logoH} alt="Logo Exploria" className="footer-logo-icon-img"></img>
            </div>
            <div>
              <div style={{ fontWeight: 600 }}>Exploria</div>
              <div style={{ fontSize: "0.8rem", color: "#9ca3af" }}>
                Bus Ticket Platform
              </div>
            </div>
          </div>
          <div className="footer-copy">
            Copyright © Exploria. All rights reserved.
          </div>
        </div>

        <div className="footer-right">
          <div className="footer-links">
            <a href="#contact">Contact Us</a>
            <a href="#">About</a>
            <a href="#">Term &amp; Conditions</a>
            <a href="#">Privacy Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
