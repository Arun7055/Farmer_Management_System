import express from "express";
import { executeSQL } from "../controllers/executeController.js";

const router = express.Router();

// FINAL ENDPOINT: POST /api/execute-sql
router.post("/", executeSQL);

export default router;
