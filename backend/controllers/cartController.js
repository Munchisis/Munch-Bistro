import userModel from "../models/userModel.js";

const addToCart = async (req, res) => {
  const itemId = req.body?.itemId;
  const userId = req.userId;

  if (!itemId) {
    return res
      .status(400)
      .json({ success: false, message: "Item ID is required" });
  }

  try {
    const userData = await userModel.findById(userId);
    if (!userData) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const cartData = { ...(userData.cartData || {}) };
    cartData[itemId] = (cartData[itemId] || 0) + 1;

    await userModel.findByIdAndUpdate(userId, { cartData }, { new: true });
    res.json({ success: true, cartData, message: "Added to cart" });
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({ success: false, message: "Error adding to cart" });
  }
};

const removeFromCart = async (req, res) => {
  const itemId = req.body?.itemId;
  const userId = req.userId;

  if (!itemId) {
    return res
      .status(400)
      .json({ success: false, message: "Item ID is required" });
  }

  try {
    const userData = await userModel.findById(userId);
    if (!userData) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const cartData = { ...(userData.cartData || {}) };
    const currentQuantity = Number(cartData[itemId] || 0);

    if (currentQuantity <= 0) {
      return res
        .status(400)
        .json({ success: false, message: "Item is not in cart" });
    }

    if (currentQuantity === 1) {
      delete cartData[itemId];
    } else {
      cartData[itemId] = currentQuantity - 1;
    }

    await userModel.findByIdAndUpdate(userId, { cartData }, { new: true });
    res.json({ success: true, cartData, message: "Removed from cart" });
  } catch (error) {
    console.error("Error removing from cart:", error);
    res
      .status(500)
      .json({ success: false, message: "Error removing from cart" });
  }
};

const getCart = async (req, res) => {
  const userId = req.userId;

  try {
    const userData = await userModel.findById(userId);
    if (!userData) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.json({ success: true, cartData: userData.cartData || {} });
  } catch (error) {
    console.error("Error fetching cart data:", error);
    res
      .status(500)
      .json({ success: false, message: "Error fetching cart data" });
  }
};

export { addToCart, removeFromCart, getCart };
