import express from "express";
import {
    getAllLands,
    getLand,
    createLand,
    updateLand,
    deleteLand,
    getLandSummary
} from "../controllers/landController.js";

const router = express.Router();

router.get("/", getAllLands);
router.get("/:id", getLand);
router.post("/", createLand);
router.put("/:id", updateLand);
router.delete("/:id", deleteLand);
router.post("/land-summary", getLandSummary);

export default router;