import express from "express";
import {
  registerAdmin,
  loginAdmin,
  getAllAdmins,
  getAdminById,
  updateAdmin,
  deleteAdmin,
} from "../controllers/adminController.js";

const router = express.Router();

router.post("/register", registerAdmin);
router.post("/login", loginAdmin);

router.get("/", getAllAdmins);
router.get("/:id", getAdminById);

router.put("/:id", updateAdmin);
router.delete("/:id", deleteAdmin);

export default router;
