"use server";

import { updateSkillDTO } from "@/server/core/dtos/skillDtos";
import { ValidationError } from "@/server/core/errors/errors";
import { skillService } from "@/server/services/skill.service";
import { SkillManagementResponseMessages } from "@/server/shared/constants/constant";
import {
  ErrorResponse,
  SuccessResponse,
  TErrorResponse,
  TSuccessResponse,
} from "@/utils/serverActionResponses/serverActionResponses";
import { skillSchema } from "@/utils/validator/skillform";

export const Admin_Update_Skill_Server_Action = async (
  data: updateSkillDTO
): Promise<TSuccessResponse<null> | TErrorResponse> => {
  try {
    const validatedData = skillSchema.parse(data);

    if (!validatedData) {
      throw new ValidationError(SkillManagementResponseMessages.ErrorInvalidInputToUpdate);
    }
    const { id ,name,description} = validatedData;
    if (!id||!name||!description) {
      throw new ValidationError(SkillManagementResponseMessages.ErrorInvalidInputToUpdate);
    }

    const updatedSkill = await skillService.updateSkill({id,name,description});

    return SuccessResponse(SkillManagementResponseMessages.SuccessSkillUpdated, null);
  } catch (error) {
    if (error instanceof ValidationError) {
      return ErrorResponse(error.message);
    }
    console.error(error, "error in update skill  server action");
    return ErrorResponse(error instanceof Error ? error.message : SkillManagementResponseMessages.ErrorFailedToUpdateSkill);
  }
};
