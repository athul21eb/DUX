"use server";

import { Skill } from "@/server/core/entities/skill";
import { ValidationError } from "@/server/core/errors/errors";
import { skillService } from "@/server/services/skill.service";
import { SkillManagementResponseMessages } from "@/server/shared/constants/constant";
import {
  ErrorResponse,
  SuccessResponse,
  TErrorResponse,
  TSuccessResponse,
} from "@/utils/serverActionResponses/serverActionResponses";

export const Get_All_Skills_For_Register_As_Mentor_Form_Server_Action =
  async (): Promise<TSuccessResponse<Skill[]> | TErrorResponse> => {
    try {
      const allSkills = await skillService.getAllSkills();
      return SuccessResponse(
        SkillManagementResponseMessages.SuccessSkillsFetched,
        allSkills
      );
    } catch (error) {
      if (error instanceof ValidationError) {
        return ErrorResponse(error.message);
      }
      console.error(error, "error in get all skills  server action");
      return ErrorResponse(
        error instanceof Error
          ? error.message
          : SkillManagementResponseMessages.ErrorFailedToFetchSkills
      );
    }
  };
