"use server";



import { ValidationError } from "@/server/core/errors/errors";
import { skillService } from "@/server/services/skill.service";
import {
  ErrorResponse,
  SuccessResponse,
  TErrorResponse,
  TSuccessResponse,
} from "@/utils/serverActionResponses/serverActionResponses";
import { skillFormType, skillSchema } from "@/utils/validator/skillform";



export  const Admin_Delete_Skill_Server_Action = async (
  id:string
): Promise<TSuccessResponse<null> | TErrorResponse> => {
  try {



    if(!id ){
      throw new ValidationError("Invalid data to delete skill");
    }



    const deletedOrNot = await skillService.deleteSkill(id)


    return SuccessResponse(" skill deleted  successfully ");
  } catch (error) {
    if (error instanceof ValidationError) {
      return ErrorResponse(error.message);
    }
    console.error(error, "error in  server action");
    return ErrorResponse(error instanceof Error ? error.message : "failed to");
  }
};
