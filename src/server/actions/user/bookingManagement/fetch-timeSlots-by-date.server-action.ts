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

interface presenter  {

  id:string;
  start:string;
  end:string;
  isBooked:boolean;

}

export const Fetch_TimeSlots_By_Date_With_IsBooked_Server_Action = async (
  id: string,date:string
): Promise<TSuccessResponse<presenter[]|null> | TErrorResponse> => {
  try {
    if (!id&&!date) {
      throw new ValidationError(SlotManagementResponseMessages.ErrorInvalidInputByIdandDateAreRequired);
    }
  const mentor = await mentorService.getMentorDetailsById(id);

    if (!mentor) {
      throw new ValidationError(SlotManagementResponseMessages.ErrorMentorProfileNotfound);
    }

    const TimeSlots = await timeSlotService.getSelectedDayTimeSlots(mentor.id,new Date(date) );


    if (!TimeSlots||!TimeSlots?.length) {
      throw new ValidationError(SlotManagementResponseMessages.ErrorTimeSlotsNotFoundByDate(date));
    }

    const formattedTimeSlots:presenter[] = TimeSlots.map((slot) => ({
      id: slot.id as string,
      start: slot.startTime as string ,
      end: slot.endTime as string,
      isBooked:slot.isBooked as boolean
    }));



    return SuccessResponse(
      SlotManagementResponseMessages.SuccessTimeSlotsFetchedByDate(date),
      formattedTimeSlots
    );


  } catch (error) {
    if (error instanceof ValidationError) {
      return ErrorResponse(error.message);
    }
    console.error(error, "error in  server action");
    return ErrorResponse(
      error instanceof Error ? error.message : SlotManagementResponseMessages.ErrorFailedToFetchTimeSlots
    );
  }
};
