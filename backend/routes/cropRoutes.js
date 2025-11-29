import express from "express";
import { createCrop, getAllCrops } from "../controllers/cropController.js";

const router = express.Router();

router.get("/", getAllCrops);
router.post("/", createCrop);

export default router;
