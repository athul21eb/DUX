"use server";

import { ITimeSlot } from "@/server/core/entities/timeSlot";
import { ValidationError } from "@/server/core/errors/errors";
import { mentorService } from "@/server/services/mentor.service";
import { timeSlotService } from "@/server/services/timeSlot.service";
import { SlotManagementResponseMessages } from "@/server/shared/constants/constant";
import {
  ErrorResponse,
  SuccessResponse,
  TErrorResponse,
  TSuccessResponse,
} from "@/utils/serverActionResponses/serverActionResponses";



export const update_TimeSlots_By_Date_Server_Action = async (
  id: string,
  date: string,
  slots: createTimeSlotDTO[]
): Promise<TSuccessResponse< null> | TErrorResponse> => {
  try {
    if (!id && !date) {
      throw new ValidationError(SlotManagementResponseMessages.ErrorInvalidInputByIdandDateAreRequired);
    }
    const mentor = await mentorService.getMentorDetailsById(id);

    if (!mentor) {
      throw new ValidationError(SlotManagementResponseMessages.ErrorMentorProfileNotfound);
    }


    const TimeSlots = await timeSlotService.updateTimeSlotsByDate(
      mentor.id,
      new Date(date),
      slots
    );

    return SuccessResponse(SlotManagementResponseMessages.SuccessTimeSlotsUpdatedByDate(date), null);
  } catch (error) {
    if (error instanceof ValidationError) {
      return ErrorResponse(error.message);
    }
    console.error(error, "error in  server action");
    return ErrorResponse(
      error instanceof Error ? error.message : SlotManagementResponseMessages.ErrorFailedToUpdateTimeSlots
    );
  }
};
