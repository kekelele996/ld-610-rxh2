import { ERROR_CODES } from "./errorCodes";

export const ERROR_MESSAGES: Record<string, string> = {
  [ERROR_CODES.AUTH_REQUIRED]: "请先登录后再继续操作",
  [ERROR_CODES.RBAC_DENIED]: "当前角色没有执行该动作的权限",
  [ERROR_CODES.VALIDATION_FAILED]: "请完整填写方案标题和修复方法",
  [ERROR_CODES.RATE_LIMITED]: "请求过于频繁，请稍后再试",
  [ERROR_CODES.DAMAGE_RECORD_NOT_FOUND]: "病害记录不存在或已被关闭",
  [ERROR_CODES.RELIC_NOT_FOUND]: "关联文物不存在",
  [ERROR_CODES.DAMAGE_NOT_SEVERE]: "仅高 / 严重等级的病害可以转修复方案",
  [ERROR_CODES.PLAN_ALREADY_EXISTS]: "该病害已有修复方案（草稿或待审批），请勿重复提交",
  [ERROR_CODES.NETWORK_ERROR]: "网络异常，方案未提交，请稍后重试"
};
