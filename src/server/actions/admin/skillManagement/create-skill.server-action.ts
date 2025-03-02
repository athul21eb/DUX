"use server";


import { createSkillDTO } from "@/server/core/dtos/skillDtos";
import { ValidationError } from "@/server/core/errors/errors";
import { skillService } from "@/server/services/skill.service";
import {
  ErrorResponse,
  SuccessResponse,
  TErrorResponse,
  TSuccessResponse,
} from "@/utils/serverActionResponses/serverActionResponses";
import {  skillSchema } from "@/utils/validator/skillform";



export  const Admin_Create_Skill_Server_Action = async (
  data:createSkillDTO
): Promise<TSuccessResponse<null> | TErrorResponse> => {
  try {

    const validatedData = skillSchema.parse(data);

    if(!validatedData){
      throw new ValidationError("Invalid data to create skill");
    }

    const {name,description} = validatedData

    const createdSkill = await skillService.createSkill({name,description})


    return SuccessResponse("new skill created successfully ");
  } catch (error) {
    if (error instanceof ValidationError) {
      return ErrorResponse(error.message);
    }
    console.error(error, "error in  server action");
    return ErrorResponse(error instanceof Error ? error.message : "failed to");
  }
};
