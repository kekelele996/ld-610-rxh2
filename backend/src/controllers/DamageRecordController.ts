import type { NextFunction, Request, Response } from "express";
import { damageRecordService } from "../services/DamageRecordService";
import { createHttpError } from "../utils/httpError";

const wrap = (error: unknown, next: NextFunction) => {
  if (error && typeof error === "object" && "code" in error) {
    next(error);
    return;
  }
  next(createHttpError(400, "VALIDATION_FAILED", "failed to convert damage record to plan"));
};

export const damageRecordController = {
  list: (_req: Request, res: Response) => res.json(damageRecordService.list()),
  create: (req: Request, res: Response) => res.status(201).json(damageRecordService.create(req.body)),
  convertToPlan: (req: Request, res: Response, next: NextFunction) => {
    try {
      const actor = (req as Request & { user?: { id: number } }).user ?? { id: 1 };
      const plan = damageRecordService.convertToPlan(Number(req.params.id), req.body ?? {}, actor);
      res.status(201).json(plan);
    } catch (error) {
      wrap(error, next);
    }
  }
};
