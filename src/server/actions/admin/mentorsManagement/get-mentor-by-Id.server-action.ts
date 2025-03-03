'use server'

import { MentorsWithRelations } from "@/server/core/dtos/mentorDtos";
import { ValidationError } from "@/server/core/errors/errors";
import { mentorService } from "@/server/services/mentor.service";
import { ErrorResponse, SuccessResponse, TErrorResponse, TSuccessResponse } from "@/utils/serverActionResponses/serverActionResponses"



export const Get_Mentor_Details_By_Id_Server_Action = async(id:string):Promise<TSuccessResponse<MentorsWithRelations>|TErrorResponse>=>{


  try {


    if(!id){
      throw new ValidationError("id is required")
    }

    const mentor = await mentorService.getMentorDetailsById(id)
    return SuccessResponse('successess mentor details fetched ',mentor);
  } catch (error) {
  if (error instanceof ValidationError) {
      return ErrorResponse(error.message);
    }
    console.error(error, "error in  server action");
    return ErrorResponse(
      error instanceof Error ? error.message : "failed to"
    );
  }


}