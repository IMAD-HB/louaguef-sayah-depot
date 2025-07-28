import express from "express";
import {
  getSettlements,
  getTodaySettlements,
  addSettlement,
  deleteAllSettlements,
} from "../controllers/settlementController.js";

const router = express.Router();

router.get("/", getSettlements);
router.get("/today", getTodaySettlements);
router.post("", addSettlement);
router.delete("/", deleteAllSettlements);

export default router;
