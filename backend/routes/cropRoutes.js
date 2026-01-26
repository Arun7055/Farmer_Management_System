import express from "express";
import { createCrop, getAllCrops, getCropSummary } from "../controllers/cropController.js";

const router = express.Router();

router.get("/", getAllCrops);
router.post("/", createCrop);
router.post("/crop-summary", getCropSummary);

export default router;
