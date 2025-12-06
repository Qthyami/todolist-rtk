import { instance } from "common/api/common.api";
import { BaseResponseType } from "common/types/common.types";

// Параметры для логина
export type LoginParamsType = {
  email: string;
  password: string;
  rememberMe: boolean;
  captcha?: string;
};

// Ответ login с токеном
export type LoginResponseType = BaseResponseType<{ userId?: number; token?: string }>;

// API
export const authAPI = {
  login(data: LoginParamsType) {
    return instance.post<LoginResponseType>("auth/login", data);
  },
  logout() {
    return instance.delete<BaseResponseType<{ userId?: number }>>("auth/login");
  },
  me() {
    return instance.get<BaseResponseType<{ id: number; email: string; login: string }>>("auth/me");
  },
};
