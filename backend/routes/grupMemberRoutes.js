import express from "express";
import {
  addMember,
  getMembers
} from "../controllers/groupMemberController.js";

const router = express.Router();

/*
  /api/groups/:groupId/members
*/

router.get("/:groupId/members", getMembers);
router.post("/:groupId/members", addMember);

export default router;
