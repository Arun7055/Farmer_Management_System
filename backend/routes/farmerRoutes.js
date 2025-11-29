import express from "express";
import {
    getAllFarmers,
    getFarmer,
    createFarmer,
    updateFarmer,
    deleteFarmer
} from "../controllers/farmerController.js";

const router = express.Router();

router.get("/", getAllFarmers);
router.get("/:id", getFarmer);
router.post("/", createFarmer);
router.put("/:id", updateFarmer);
router.delete("/:id", deleteFarmer);

export default router;
