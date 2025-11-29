import express from "express";
import { addMember, getMembers } from "../controllers/groupMemberController.js";

const router = express.Router();

router.get("/", getMembers);
router.post("/", addMember);

export default router;
