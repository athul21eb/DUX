// src/utils/responses.ts

export type TSuccessResponse<T> = {
  success: true;
  message: string;
  data?: T;
};

export type TErrorResponse = {
  success: false; // ✅ Use success: false instead of error: true for consistency
  message: string;
};

export const SuccessResponse = <T>(
  message: string,
  data?: T
): TSuccessResponse<T> => ({
  success: true,
  message,
  data,
});

export const ErrorResponse = (message: string): TErrorResponse => ({
  success: false,
  message,
});
