import express, { request } from "express";
import authMiddleware from "../middlewares/Auth.js";
import { placeOrder, userOrders, verifyOrder, listOrders, updateStatus, removeOrder } from "../controllers/orderController.js";

const orderRouter = express.Router();

orderRouter.post("/place", authMiddleware, placeOrder);
orderRouter.post("/verify", verifyOrder)
orderRouter.post("/userorders", authMiddleware, userOrders)
orderRouter.get("/list", listOrders)
orderRouter.post("/status", updateStatus)
orderRouter.post("/remove", removeOrder);


export default orderRouter;
