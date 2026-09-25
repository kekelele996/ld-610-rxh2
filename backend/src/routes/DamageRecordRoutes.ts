import { Router } from "express";
import { damageRecordController } from "../controllers/DamageRecordController";

const router = Router();
router.get("/", damageRecordController.list);
router.post("/", damageRecordController.create);
router.post("/:id/convert-to-plan", damageRecordController.convertToPlan);

export default router;
