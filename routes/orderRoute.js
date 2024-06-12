import express from "express";
import {
  placeOrder,
  userOrders,
  verifyOrder,
  listOrders,
  updateStatus,
} from "../controllers/orderController.js";
import authMiddleware from "../middleware/auth.js";

const orderRouter = express.Router();

orderRouter.post("/place", authMiddleware, placeOrder);
orderRouter.post("/userOrders", authMiddleware, userOrders);
orderRouter.post("/verify", verifyOrder);
orderRouter.post("/status", updateStatus);
orderRouter.get("/list", listOrders);

export default orderRouter;
