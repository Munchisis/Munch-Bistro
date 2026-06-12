import { useContext, useState } from "react";
import "./Navbar.css";
import { assets } from "../../assets/assets";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { StoreContext } from "../../Context/StoreContext";

const Navbar = ({ setShowLogin }) => {
  const [menu, setMenu] = useState("home");
  const location = useLocation();
  const { getTotalCartAmount, token, setToken } = useContext(StoreContext);
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    navigate("/");
  };

  // Helper to handle navigation for anchor links
  const handleNavClick = (e, menuName) => {
    setMenu(menuName);
    if (location.pathname !== "/") {
      e.preventDefault();
      navigate("/");
      // After navigating, we wait a tiny bit for the home page to load,
      // then scroll to the section if needed.
      setTimeout(() => {
        window.location.hash = e.target.getAttribute("href");
      }, 100);
    }
  };

  // helper to check if a link is active based on the URL
  const isActive = (menuName, hash) => {
    // Active if we're on the home page AND (the state matches OR the URL hash matches)
    return (
      location.pathname === "/" && (menu === menuName || location.hash === hash)
    );
  };

  return (
    <>
      <div className="navbar">
        <Link to="/" onClick={() => setMenu("home")}>
          <img src={assets.logo} alt="Logo" className="logo" />
        </Link>

        <ul className="navbar-menu">
          <Link
            to="/"
            onClick={() => setMenu("home")}
            className={
              location.pathname === "/" && location.hash === "" ? "active" : ""
            }
          >
            Home
          </Link>
          <a
            href="#explore-menu"
            onClick={(e) => handleNavClick(e, "menu")}
            className={isActive("menu", "#explore-menu") ? "active" : ""}
          >
            Menu
          </a>
          <a
            href="#app-download"
            onClick={(e) => handleNavClick(e, "mobile-app")}
            className={isActive("mobile-app", "#app-download") ? "active" : ""}
          >
            Mobile-app
          </a>
          <a
            href="#footer"
            onClick={(e) => handleNavClick(e, "contact-us")}
            className={isActive("contact-us", "#footer") ? "active" : ""}
          >
            Contact-us
          </a>
        </ul>

        <div className="navbar-right">
          <img src={assets.search_icon} alt="search-icon" />
          <div className="navbar-search-icon">
            <Link to="/cart">
              <img src={assets.basket_icon} alt="basket_icon" />
            </Link>
            <div className={getTotalCartAmount() === 0 ? "" : "dot"}></div>
          </div>

          {!token ? (
            <button onClick={() => setShowLogin(true)}>Sign In</button>
          ) : (
            <div className="navbar-profile">
              <img src={assets.profile_icon} alt="" />
              <ul className="nav-profile-dropdown">
                <li onClick={() => navigate("/myorders")}>
                  <img src={assets.bag_icon} alt="" />
                  <p>Orders</p>
                </li>
                <hr />
                <li onClick={logout}>
                  <img src={assets.logout_icon} alt="" />
                  <p>Logout</p>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;
