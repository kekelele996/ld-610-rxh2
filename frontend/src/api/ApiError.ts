import { ERROR_CODES, type ErrorCode } from "../constants/errorCodes";

export class ApiError extends Error {
  code: ErrorCode;
  status: number;

  constructor(status: number, code: string | undefined, fallbackMessage: string) {
    super(fallbackMessage);
    this.name = "ApiError";
    this.status = status;
    const known = Object.values(ERROR_CODES) as string[];
    this.code = (code && known.includes(code) ? code : ERROR_CODES.NETWORK_ERROR) as ErrorCode;
  }
}
