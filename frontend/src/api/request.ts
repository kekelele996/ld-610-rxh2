// 统一的 /api 请求封装：集中处理非 2xx 响应的错误码与错误消息
export class ApiError extends Error {
  code: string;
  status: number;

  constructor(status: number, code: string, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
  }
}

export async function requestJson<T>(input: string, init?: RequestInit): Promise<T> {
  const res = await fetch(input, {
    headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
    ...init
  });
  if (!res.ok) {
    let code = "INTERNAL_ERROR";
    let message = `请求失败（${res.status}）`;
    try {
      const body = await res.json();
      if (body?.code) code = String(body.code);
      if (body?.message) message = String(body.message);
    } catch {
      // 非 JSON 错误响应时保留默认消息
    }
    throw new ApiError(res.status, code, message);
  }
  return (await res.json()) as T;
}
