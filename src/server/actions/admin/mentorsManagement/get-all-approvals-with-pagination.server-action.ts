"use server";

import { getAllApprovalsDTO } from "@/server/core/dtos/mentorDtos";

import { ValidationError } from "@/server/core/errors/errors";
import { mentorService } from "@/server/services/mentor.service";
import { MentorMangementResponseMessages } from "@/server/shared/constants/constant";

import {
  ErrorResponse,
  SuccessResponse,
  TErrorResponse,
  TSuccessResponse,
} from "@/utils/serverActionResponses/serverActionResponses";


interface presenter extends getAllApprovalsDTO {
  currentPage: number;
}
export  const Get_All_Mentor_Approvals_With_Pagination_Server_Action = async (
  page: number = 1,
  limit: number = 10
): Promise<TSuccessResponse<presenter> | TErrorResponse> => {
  try {
    const skip = (page - 1) * limit;

    const data = await mentorService.getAllMentorApprovalsWithPagination(skip, limit);

    const presenter: presenter = {
      ...data,
      currentPage: page,
    };


    return SuccessResponse(MentorMangementResponseMessages.SuccessMentorApprovalsFetched, presenter);
  } catch (error) {
    if (error instanceof ValidationError) {
      return ErrorResponse(error.message);
    }
    console.error(error, "error in get metor approvals server action");
    return ErrorResponse(error instanceof Error ? error.message : MentorMangementResponseMessages.ErrorFailedToFetchMentorApprovals);
  }
};
