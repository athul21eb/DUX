'use server'

import { UserProfileDTO } from "@/server/core/dtos/userDtos";
import { ValidationError } from "@/server/core/errors/errors";
import { userService } from "@/server/services/user.service";
import { UserManagementResponseMessages } from "@/server/shared/constants/constant";
import { ErrorResponse, SuccessResponse, TErrorResponse, TSuccessResponse } from "@/utils/serverActionResponses/serverActionResponses"



export const Fetch_User_Details_By_Email_Server_Action = async (
  userEmail: string
): Promise<TSuccessResponse<UserProfileDTO> | TErrorResponse> => {
  try {
    if (!userEmail) {
      throw new ValidationError(UserManagementResponseMessages.ErrorInvalidInputToFetchUsersDetailsByEmail);
    }

    const fetchedUser = await userService.getUserDetailsByEmail(userEmail);

    if (!fetchedUser) {
      throw new ValidationError(UserManagementResponseMessages.ErrorUserNotFound);
    }

    const presenter: UserProfileDTO = {
      name: fetchedUser.name ?? "",
      email: fetchedUser.email ?? "",
      phone: fetchedUser.phone ?? undefined,
      gender: fetchedUser.gender ?? undefined,
      dob: fetchedUser.dob ? new Date(fetchedUser.dob).toISOString() : undefined,
      image: fetchedUser.image ?? undefined,
    };

    return SuccessResponse(UserManagementResponseMessages.SuccessUserDetailsFetched, presenter);
  } catch (error) {
    console.error("Error in Fetch_User_Details_By_Email_Server_Action:", error);
    return ErrorResponse(error instanceof ValidationError ? error.message : UserManagementResponseMessages.ErrorFailedToFetchUserDetails, );
  }
};
