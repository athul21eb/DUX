"use server";

import { ValidationError } from "@/server/core/errors/errors";
import { userService } from "@/server/services/user.service";
import {
  ErrorResponse,
  SuccessResponse,
  TErrorResponse,
  TSuccessResponse,
} from "@/utils/serverActionResponses/serverActionResponses";

export const Change_IsBlocked_Status_Server_Action = async (
  id: string,
  status: boolean
): Promise<TSuccessResponse<null> | TErrorResponse> => {
  try {

    console.log(id,typeof status)
    if (!id || typeof status !== "boolean") {
      throw new ValidationError("invalid data to change isBlocked status");
    }

    const changedStatus = await userService.changeIsBlockedStatus(id, status);

    return SuccessResponse(`successfully ${status ? "blocked" : "unblocked"} `);
  } catch (error) {
    if (error instanceof ValidationError) {
      return ErrorResponse(error.message);
    }
    console.error(error, "error in  server action");
    return ErrorResponse(error instanceof Error ? error.message : "failed to");
  }
};
