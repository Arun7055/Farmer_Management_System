import express from "express";
import { createEquipment, getEquipment, toggleAvailability } from "../controllers/equipmentController.js";

const router = express.Router();

router.get("/", getEquipment);
router.post("/", createEquipment);
router.put("/:id/toggle-availability", toggleAvailability);

export default router;
