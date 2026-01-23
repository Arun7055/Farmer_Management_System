import express from "express";
import { processAIQuery } from "../controllers/aiController.js";

const router = express.Router();

router.post("/query", processAIQuery);

export default router;
