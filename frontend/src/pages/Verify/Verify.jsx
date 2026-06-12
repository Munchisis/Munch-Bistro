import { useCallback, useContext, useEffect } from "react";
import { StoreContext } from "../../Context/StoreContext";
import "./Verify.css";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";

const Verify = () => {
  const [searchParams] = useSearchParams();
  const success = searchParams.get("success");
  const orderId = searchParams.get("orderId");
  const { url } = useContext(StoreContext);
  const navigate = useNavigate();

  const verifyPayment = useCallback(async () => {
    if (!orderId || success === null) {
      navigate("/");
      return;
    }

    try {
      const response = await axios.post(url + "/api/order/verify", {
        success,
        orderId,
      });

      if (response.data?.success) {
        navigate("/myorders");
      } else {
        navigate("/");
      }
    } catch {
      navigate("/");
    }
  }, [orderId, success, url, navigate]);

  useEffect(() => {
    verifyPayment();
  }, [verifyPayment]);
  return (
    <div className="verify">
      <div className="spinner"></div>
      <p>Verifying...</p>
    </div>
  );
};

export default Verify;
