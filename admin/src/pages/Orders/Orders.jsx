import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { assets } from "../../assets/assets";
import Loader from "../../component/Loader/Loader";
import "./Orders.css";

const Orders = ({ url }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  // Memoized to prevent unnecessary re-renders in useEffect
  const fetchAllOrders = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${url}/api/order/list`);
      if (response.data?.success) {
        setOrders(response.data.data || []);
      } else {
        toast.error("Error fetching orders");
      }
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [url]);

  // Optimistic UI updates with precise Toast notification handling
  const updateOrderStatus = async (orderId, status) => {
    const toastId = toast.loading("Updating status...");
    try {
      const response = await axios.post(`${url}/api/order/status`, {
        orderId,
        status,
      });
      if (response.data?.success) {
        setOrders((prev) =>
          prev.map((o) => (o._id === orderId ? { ...o, status } : o)),
        );
        toast.update(toastId, {
          render: "Status updated!",
          type: "success",
          isLoading: false,
          autoClose: 3000,
        });
      } else {
        toast.update(toastId, {
          render: "Update failed",
          type: "error",
          isLoading: false,
          autoClose: 3000,
        });
      }
    } catch {
      toast.update(toastId, {
        render: "Network error",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    }
  };

  // Promise-based UI removal on delete confirmation
  const removeOrder = async (orderId) => {
    if (
      !window.confirm("Are you sure you want to cancel and remove this order?")
    )
      return;

    const cancelPromise = axios.post(`${url}/api/order/remove`, {
      id: orderId,
    });

    toast.promise(cancelPromise, {
      pending: "Cancelling order...",
      success: {
        render() {
          setOrders((prev) => prev.filter((item) => item._id !== orderId));
          return "Order removed successfully!";
        },
      },
      error: "Failed to remove order.",
    });
  };

  useEffect(() => {
    // Avoid calling setState synchronously within an effect by deferring the fetch
    const id = setTimeout(() => {
      fetchAllOrders();
    }, 0);
    return () => clearTimeout(id);
  }, [fetchAllOrders]);

  return (
    <div>
      <div className="order add">
        <h3>Order Page</h3>
        {loading ? (
          <Loader />
        ) : orders.length === 0 ? (
          <div className="no-orders">No orders have been placed yet.</div>
        ) : (
          <div className="order-list">
            {orders.map((order, idx) => {
              const addr = order.address || {};
              const itemsList = order.items || [];

              return (
                <div key={order._id || idx} className="order-item">
                  <img src={assets.parcel_icon} alt="parcel_icon" />
                  <div>
                    <p className="order-item-food">
                      {itemsList.map(
                        (item, index) =>
                          `${item.name}x${item.quantity}${index === itemsList.length - 1 ? "" : ", "}`,
                      )}
                    </p>
                    <p className="order-item-name">
                      {`${addr.firstName || ""} ${addr.lastName || ""}`.trim() ||
                        "Unknown Customer"}
                    </p>
                    <div className="order-item-address">
                      <p>{addr.street ? `${addr.street},` : ""}</p>
                      <p>
                        {[addr.city, addr.state, addr.country, addr.zipCode]
                          .filter(Boolean)
                          .join(", ")}
                      </p>
                    </div>
                    {addr.phone && (
                      <p className="order-item-phone">{addr.phone}</p>
                    )}
                  </div>
                  <p>Items: {itemsList.length}</p>
                  <p>Amount: ₦{order.amount}</p>

                  <div className="order-actions">
                    <select
                      value={order.status || "Food Processing"}
                      onChange={(e) =>
                        updateOrderStatus(order._id, e.target.value)
                      }
                    >
                      <option value="Food Processing">Food Processing</option>
                      <option value="Out for Delivery">Out for Delivery</option>
                      <option value="Delivered">Delivered</option>
                    </select>
                  </div>

                  <button
                    className="cancel-icon"
                    onClick={() => removeOrder(order._id)}
                    title="Remove Order"
                  >
                    Cancel
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
