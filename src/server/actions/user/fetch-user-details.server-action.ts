'use server'

import { UserProfileDTO } from "@/server/core/dtos/userDtos";
import { ValidationError } from "@/server/core/errors/errors";
import { userService } from "@/server/services/user.service";
import { ErrorResponse, SuccessResponse, TErrorResponse, TSuccessResponse } from "@/utils/serverActionResponses/serverActionResponses"

interface Presenter extends UserProfileDTO{}

export const Fetch_User_Details_By_Email_Server_Action = async (
  userEmail: string
): Promise<TSuccessResponse<Presenter> | TErrorResponse> => {
  try {
    if (!userEmail) {
      throw new ValidationError("Invalid user email");
    }

    const fetchedUser = await userService.getUserDetailsByEmail(userEmail);

    if (!fetchedUser) {
      throw new ValidationError("User not found");
    }

    const presenter: Presenter = {
      name: fetchedUser.name ?? "",
      email: fetchedUser.email ?? "",
      phone: fetchedUser.phone ?? undefined,
      gender: fetchedUser.gender ?? undefined,
      dob: fetchedUser.dob ? new Date(fetchedUser.dob).toISOString() : undefined,
      image: fetchedUser.image ?? undefined,
    };

    return SuccessResponse("Successfully fetched user data", presenter);
  } catch (error) {
    console.error("Error in Fetch_User_Details_By_Email_Server_Action:", error);
    return ErrorResponse(error instanceof ValidationError ? error.message : "Failed to fetch user details");
  }
};
