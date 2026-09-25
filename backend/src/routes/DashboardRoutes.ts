import { Router } from "express";
import { dashboardController } from "../controllers/DashboardController";

const router = Router();
router.get("/stats", dashboardController.stats);

export default router;
