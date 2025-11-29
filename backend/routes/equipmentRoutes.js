import express from "express";
import { createEquipment, getEquipment } from "../controllers/equipmentController.js";

const router = express.Router();

router.get("/", getEquipment);
router.post("/", createEquipment);

export default router;
