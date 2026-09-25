import type { Request, Response, NextFunction } from "express";
import { damageRecordService } from "../services/DamageRecordService";
import { AppError } from "../utils/AppError";
import { ERROR_CODES } from "../constants/errorCodes";
import { ERROR_MESSAGES } from "../constants/errorMessages";
import type { ConvertToPlanPayload } from "../types/DamageRecordPayload";

export const damageRecordController = {
  // GET /api/damage-record?severity=CRITICAL
  list: (req: Request, res: Response) => {
    const severity = typeof req.query.severity === "string" ? req.query.severity : undefined;
    res.json(damageRecordService.list(severity));
  },

  create: (req: Request, res: Response) => res.status(201).json(damageRecordService.create(req.body)),

  // POST /api/damage-record/:id/convert-to-plan
  convertToPlan: (req: Request, res: Response, next: NextFunction) => {
    try {
      const damageId = Number(req.params.id);
      if (!Number.isFinite(damageId)) {
        throw new AppError(400, ERROR_CODES.VALIDATION_FAILED, ERROR_MESSAGES.VALIDATION_FAILED);
      }
      const ownerId = (req as unknown as { user?: { id?: number } }).user?.id ?? 1;
      const result = damageRecordService.convertToPlan(damageId, req.body as ConvertToPlanPayload, ownerId);
      res.status(201).json(result);
    } catch (error) {
      // controller 层包装一次，再交给全局错误处理中间件，避免在单一位置吞掉异常
      next(error instanceof AppError ? error : new AppError(500, "INTERNAL_ERROR", String((error as Error).message)));
    }
  }
};
