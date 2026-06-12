import { useCallback, useContext, useEffect, useState } from "react";
import "./MyOrders.css";
import { StoreContext } from "../../Context/StoreContext";
import axios from "axios";
import { assets } from "../../assets/assets";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/Loader/Loader";

const MyOrders = () => {
  const { url, token } = useContext(StoreContext);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const navigate = useNavigate();

  const fetchOrders = useCallback(
    async (isRefresh = false) => {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);

      try {
        const response = await axios.post(
          url + "/api/order/userorders",
          {},
          { headers: { token } },
        );
        setData(response.data?.data || []);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [token, url],
  );

  useEffect(() => {
    if (token) {
      fetchOrders();
    }
  }, [token, fetchOrders]);

  // Add this helper function inside your component before the return
  const getStatusClass = (status) => {
    switch (status) {
      case "Delivered":
        return "status-green";
      case "Processing":
        return "status-orange";
      case "Out for Delivery":
        return "status-blue";
      case "Cancelled":
        return "status-red";
      default:
        return "status-grey";
    }
  };

  return (
    <div className="my-orders">
      <h2>My Orders</h2>

      {loading ? (
        <div className="loader-center">
          <Loader />
        </div>
      ) : data.length === 0 ? (
        <div className="no-orders">
          <p>You haven't placed any orders yet!</p>
          <button className="btn" onClick={() => navigate("/")}>
            Order Now
          </button>
        </div>
      ) : (
        <div className="container">
          {data.map((order, index) => (
            <div key={order._id || index} className="my-orders-order">
              <img src={assets.parcel_icon} alt="Parcel Icon" />
              <p>
                {order.items.map((item, idx) => (
                  <span key={idx}>
                    {item.name} x {item.quantity}
                    {idx === order.items.length - 1 ? "" : ", "}
                  </span>
                ))}
              </p>
              <p>₦{order.amount.toLocaleString()}.00</p>
              <p>Items: {order.items.length}</p>
              <p>
                <span className={`status-dot ${getStatusClass(order.status)}`}>
                  &#x25cf;
                </span>{" "}
                <b>{order.status}</b>
              </p>
              <button disabled={refreshing} onClick={() => fetchOrders(true)}>
                {refreshing ? "Updating..." : "Track Order"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
