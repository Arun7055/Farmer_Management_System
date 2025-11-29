import express from "express";
import { createGroup, getGroups } from "../controllers/groupController.js";

const router = express.Router();

router.get("/", getGroups);
router.post("/", createGroup);

export default router;
