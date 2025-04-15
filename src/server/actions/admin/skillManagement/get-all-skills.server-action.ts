"use server";

import { getAllSkillsDTO } from "@/server/core/dtos/skillDtos";
import { ValidationError } from "@/server/core/errors/errors";
import { skillService } from "@/server/services/skill.service";
import { SkillManagementResponseMessages } from "@/server/shared/constants/constant";
import {
  ErrorResponse,
  SuccessResponse,
  TErrorResponse,
  TSuccessResponse,
} from "@/utils/serverActionResponses/serverActionResponses";


interface presenter extends getAllSkillsDTO {
  currentPage: number;
}
export  const Get_All_Skills_With_Pagination_Server_Action = async (
  page: number = 1,
  limit: number = 10
): Promise<TSuccessResponse<presenter> | TErrorResponse> => {
  try {
    const skip = (page - 1) * limit;

    const data = await skillService.getAllSkillsWithPagination(skip, limit);

    const presenter: presenter = {
      ...data,
      currentPage: page,
    };


    return SuccessResponse(SkillManagementResponseMessages.SuccessSkillsFetched, presenter);
  } catch (error) {
    if (error instanceof ValidationError) {
      return ErrorResponse(error.message);
    }
    console.error(error, "error in get skills server action");
    return ErrorResponse(error instanceof Error ? error.message : SkillManagementResponseMessages.ErrorFailedToFetchSkills);
  }
};
