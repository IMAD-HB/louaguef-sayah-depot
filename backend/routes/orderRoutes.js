import express from "express";
import {
  getOrders,
  getOrderById,
  createOrder,
  updateOrder,
  updateOrderStatus,
  deleteOrder,
} from "../controllers/orderController.js";

const router = express.Router();

router.get("/", getOrders);
router.post("/", createOrder);

router.put("/:id", updateOrder);
router.get("/:id", getOrderById);
router.put("/:id/status", updateOrderStatus);
router.delete("/:id", deleteOrder);

export default router;
