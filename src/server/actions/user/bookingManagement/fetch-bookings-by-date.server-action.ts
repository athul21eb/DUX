"use server";

import { prisma } from "@/lib/db/database";
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

interface presenter {
  id: string;
  start: string;
  end: string;
  isBooked: boolean;
}

export const Fetch_Bookings_By_Date_Server_Action = async (
  id: string,
  date: string
): Promise<TSuccessResponse<presenter[] | null> | TErrorResponse> => {
  try {
    if (!id && !date) {
      throw new ValidationError(
        SlotManagementResponseMessages.ErrorInvalidInputByIdandDateAreRequired
      );
    }
    const mentor = await mentorService.getMentorDetailsById(id);

    if (!mentor) {
      throw new ValidationError(
        SlotManagementResponseMessages.ErrorMentorProfileNotfound
      );
    }

    const Bookings = await prisma.booking.findMany({
      where: {
        mentorId: id,
        bookingDate: date,
        status: { in: ["confirmed", "pending"] }
      },
    });

    if (!Bookings || !Bookings?.length) {
      throw new ValidationError(
        SlotManagementResponseMessages.ErrorTimeSlotsNotFoundByDate(date)
      );
    }

    const formattedBookings: presenter[] = Bookings.map((booking) => ({
      id: booking.id as string,
      start: booking.startTime as string,
      end: booking.endTime as string,
      isBooked: true,
    }));

    return SuccessResponse(
      SlotManagementResponseMessages.SuccessTimeSlotsFetchedByDate(date),
      formattedBookings
    );
  } catch (error) {
    if (error instanceof ValidationError) {
      return ErrorResponse(error.message);
    }
    console.error(error, "error in  server action");
    return ErrorResponse(
      error instanceof Error
        ? error.message
        : SlotManagementResponseMessages.ErrorFailedToFetchTimeSlots
    );
  }
};
