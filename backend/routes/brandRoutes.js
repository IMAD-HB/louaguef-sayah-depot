import express from "express";
import {
  createBrand,
  getBrands,
  getBrandById,
  updateBrand,
  deleteBrand,
} from "../controllers/brandController.js";

import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.post("/", upload.single("logo"), createBrand);
router.get("/", getBrands);

router.get("/:id", getBrandById);
router.put("/:id", upload.single("logo"), updateBrand);
router.delete("/:id", deleteBrand);

export default router;
