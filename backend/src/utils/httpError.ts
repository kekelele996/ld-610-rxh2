import type { ErrorCode } from "../constants/errorCodes";

export interface HttpError {
  status: number;
  code: ErrorCode | "INTERNAL_ERROR";
  message: string;
}

export const createHttpError = (status: number, code: HttpError["code"], message: string): HttpError => ({ status, code, message });
