import express from "express";
import { createEquipment, getEquipment, toggleAvailability, createEquipmentRequest, getEquipmentRequests } from "../controllers/equipmentController.js";

const router = express.Router();

router.get("/", getEquipment);
router.post("/", createEquipment);
router.put("/:id/toggle-availability", toggleAvailability);
router.post("/request", createEquipmentRequest);
router.get("/request/:farmerId", getEquipmentRequests);

export default router;