"use server";

import { getAllSkillsDTO } from "@/server/core/dtos/skillDtos";
import { getAllUsersDTO } from "@/server/core/dtos/userDtos";
import { ValidationError } from "@/server/core/errors/errors";
import { skillService } from "@/server/services/skill.service";
import { userService } from "@/server/services/user.service";
import {
  ErrorResponse,
  SuccessResponse,
  TErrorResponse,
  TSuccessResponse,
} from "@/utils/serverActionResponses/serverActionResponses";


interface presenter extends getAllUsersDTO {
  currentPage: number;
}
export  const Get_All_Users_With_Pagination_Server_Action = async (
  page: number = 1,
  limit: number = 10
): Promise<TSuccessResponse<presenter> | TErrorResponse> => {
  try {
    const skip = (page - 1) * limit;

    const data = await userService.getAllUsersWithPagination(skip, limit);

    const presenter: presenter = {
      ...data,
      currentPage: page,
    };


    return SuccessResponse("successfully fetched Users ", presenter);
  } catch (error) {
    if (error instanceof ValidationError) {
      return ErrorResponse(error.message);
    }
    console.error(error, "error in get Users server action");
    return ErrorResponse(error instanceof Error ? error.message : "failed to fetch Users data");
  }
};
