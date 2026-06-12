import React, { useEffect, useState } from "react";
import Navbar from "./components/Navbar/Navbar";
import { Route, Routes, useLocation } from "react-router-dom";
import Home from "./pages/Home/Home";
import Cart from "./pages/Cart/Cart";
import PlaceOrder from "./pages/PlaceOrder/PlaceOrder";
import Footer from "./components/Footer/Footer";
import LoginPopup from "./components/LoginPopup/LoginPopup";
import Verify from "./pages/Verify/Verify";
import MyOrders from "./pages/MyOrders/MyOrders";
import { ToastContainer } from "react-toastify";

const App = () => {
  const [showLogin, setShowLogin] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Check if we arrived here because the PlaceOrder page sent us to log in
    if (location.state?.openLogin) {
      const timeoutId = window.setTimeout(() => setShowLogin(true), 0);
      return () => window.clearTimeout(timeoutId);
    }
  }, [location]);

  return (
    <>
      {showLogin ? <LoginPopup setShowLogin={setShowLogin} /> : <></>}
      <div className="app">
        <Navbar setShowLogin={setShowLogin} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/order" element={<PlaceOrder />} />
          <Route path="/verify" element={<Verify />} />
          <Route path="/myorders" element={<MyOrders />} />
          <Route path="/login" element={<LoginPopup />} />
        </Routes>
      </div>
      <Footer />
      <ToastContainer />
    </>
  );
};

export default App;
