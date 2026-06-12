/* eslint-disable no-unused-vars */
import { useContext, useEffect } from "react";
import { StoreContext } from "../../Context/StoreContext";
import "./Verify.css";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";

const Verify = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const success = searchParams.get("success");
  const orderId = searchParams.get("orderId");
  const { url } = useContext(StoreContext);
  const navigate = useNavigate();

  const verifyPayment = async () => {
    console.log("Verifying payment with:", { success, orderId });
    const response = await axios.post(url + "/api/order/verify", {
      success,
      orderId,
    });
    console.log("Verify response:", response.data);
    if (response.data.success) {
      navigate("/myorders");
    } else {
      navigate("/");
    }
  };

  useEffect(() => {
    verifyPayment();
  }, []);
  return (
    <div className="verify">
      <div className="spinner"></div>
      <p>Verifying...</p>
    </div>
  );
};

export default Verify;
