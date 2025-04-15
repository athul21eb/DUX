"use server";

import { ITimeSlot } from "@/server/core/entities/timeSlot";
import { ValidationError } from "@/server/core/errors/errors";
import { mentorService } from "@/server/services/mentor.service";
import { timeSlotService } from "@/server/services/timeSlot.service";
import {
  ErrorResponse,
  SuccessResponse,
  TErrorResponse,
  TSuccessResponse,
} from "@/utils/serverActionResponses/serverActionResponses";

export const Default_TimeSlots_Server_Action = async (
  id: string
): Promise<TSuccessResponse<ITimeSlot[]> | TErrorResponse> => {
  try {
    if (!id) {
      throw new ValidationError("id is required");
    }

    const mentor = await mentorService.getMentorDetailsByUserId(id);

    if (!mentor) {
      throw new ValidationError("mentor profile not found");
    }

    const defaultTimeSlots = await timeSlotService.getDefaultTimeSlots(
      mentor.id
    );

    return SuccessResponse(
      "successfull dfefault times slots fetched",
      defaultTimeSlots
    );
  } catch (error) {
    if (error instanceof ValidationError) {
      return ErrorResponse(error.message);
    }
    console.error(error, "error in  server action");
    return ErrorResponse(
      error instanceof Error ? error.message : "failed to fetcxh time slots"
    );
  }
};
