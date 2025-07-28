import express from "express";
import {
  registerCustomer,
  loginCustomer,
  getAllCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
  settleDebt,
} from "../controllers/customerController.js";

const router = express.Router();

router.post("/register", registerCustomer);
router.post("/login", loginCustomer);

// Admin-only
router.get("/", getAllCustomers);
router.get("/:id", getCustomerById);

router.put("/:id", updateCustomer);
router.delete("/:id", deleteCustomer);
router.put("/:id/settledebt", settleDebt);

export default router;
