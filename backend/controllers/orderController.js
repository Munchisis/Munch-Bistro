import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// placing user order from frontend
const placeOrder = async (req, res) => {
  const frontendUrl =
    process.env.FRONTEND_URL || "https://munch-bistro-frontend.onrender.com";
  const userId = req.userId || req.body.userId;
  const { items, amount, address } = req.body || {};

  if (!userId) {
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized request" });
  }

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({
      success: false,
      message: "Your cart is empty. Please add items before checking out.",
    });
  }

  if (!address || typeof address !== "object") {
    return res
      .status(400)
      .json({ success: false, message: "Address is required" });
  }

  const amountValue = Number(amount);
  if (!amountValue || amountValue <= 0) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid order total" });
  }

  try {
    const newOrder = new orderModel({
      userId,
      items,
      amount: amountValue,
      address,
    });
    await newOrder.save();
    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    const line_items = items.map((item) => ({
      price_data: {
        currency: "USD",
        product_data: {
          name: item.name || "Food Item",
        },
        unit_amount: Math.max(0, Number(item.price) || 0) * 100,
      },
      quantity: Math.max(1, Number(item.quantity) || 1),
    }));

    line_items.push({
      price_data: {
        currency: "USD",
        product_data: {
          name: "Delivery Fee",
        },
        unit_amount: 500,
      },
      quantity: 1,
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: line_items,
      mode: "payment",
      success_url: `${frontendUrl}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${frontendUrl}/verify?success=false&orderId=${newOrder._id}`,
    });

    res.json({ success: true, url: session.url });
  } catch (error) {
    console.error("Error placing order:", error);
    res.status(500).json({ success: false, message: "Error placing order" });
  }
};

const verifyOrder = async (req, res) => {
  const { orderId, success } = req.body || {};
  if (!orderId || typeof success !== "string") {
    return res
      .status(400)
      .json({ success: false, message: "Invalid verification request" });
  }

  try {
    const order = await orderModel.findById(orderId);
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    if (success === "true") {
      order.payment = true;
      await order.save();
      return res.json({ success: true, message: "Payment confirmed" });
    }

    await orderModel.findByIdAndDelete(orderId);
    return res.json({ success: false, message: "Payment not completed" });
  } catch (error) {
    console.error("Error in verifyOrder:", error);
    return res
      .status(500)
      .json({ success: false, message: "Error verifying order" });
  }
};

//user orders for frontend
const userOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({ userId: req.body.userId });
    res.json({ success: true, data: orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// listing orders for admin panel
const listOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({});
    res.json({ success: true, data: orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

//api for updating order status
const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;
    if (!orderId || !status) {
      return res
        .status(400)
        .json({ success: false, message: "orderId and status are required" });
    }

    const updatedOrder = await orderModel.findByIdAndUpdate(
      orderId,
      { status },
      { new: true },
    );

    if (!updatedOrder) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    res.json({ success: true, message: "Status Updated", data: updatedOrder });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Error updating status" });
  }
};

// API for removing/cancelling an order from Admin Panel
const removeOrder = async (req, res) => {
  try {
    // Look for 'id' as sent by your frontend axios.post(url + "/api/order/remove", { id: orderId })
    const { id } = req.body;

    if (!id) {
      return res
        .status(400)
        .json({ success: false, message: "Order ID is required" });
    }

    const deletedOrder = await orderModel.findByIdAndDelete(id);

    if (!deletedOrder) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    res.json({ success: true, message: "Order removed successfully" });
  } catch (error) {
    console.error("Error removing order:", error);
    res.status(500).json({ success: false, message: "Error removing order" });
  }
};

export {
  placeOrder,
  verifyOrder,
  userOrders,
  listOrders,
  updateStatus,
  removeOrder,
};
