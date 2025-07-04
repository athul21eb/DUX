"use server";

import { stripe } from "@/lib/stripe";

import { revalidatePath } from "next/cache";
import Stripe from "stripe";
import { prisma } from "@/lib/db/database";

import { ValidationError } from "@/server/core/errors/errors";
import {
  ErrorResponse,
  SuccessResponse,
  TErrorResponse,
  TSuccessResponse,
} from "@/utils/serverActionResponses/serverActionResponses";
import { update_TimeSlots_By_Date_Server_Action } from "../../mentor/timeSlotManagement/update-timeSlots-by-date.server-action";
import {
  BookingManagementResponseMessages,
  DefaultResponseMessages,
} from "@/server/shared/constants/constant";
import { mentorService } from "@/server/services/mentor.service";
import { timeSlotService } from "@/server/services/timeSlot.service";
import { TimeSlotRepoInstance } from "@/server/repositories/prisma.timeSlot.repository";
import { bookingService } from "@/server/services/booking.service";

interface slot {
  start: string;
  end: string;
}

export const create_stripe_checkout_Server_Actionsss = async (
  mentorId: string,
  timeSlotId: string,
  date: string,
  userId: string,
  defaultSlots: boolean,
  initialSlots: slot[]
): Promise<TSuccessResponse<any> | TErrorResponse> => {
  try {
    // 1. Validate inputs
    if (!mentorId || !timeSlotId || !date || !userId) {
      throw new ValidationError(
        DefaultResponseMessages.ErrorInvalidInputByParametersRequired([
          `mentorId`,
          `timeSlotId`,
          `date`,
          `userId`,
        ])
      );
    }
    let bookingslotId = timeSlotId;
    // 2. Get mentor and time slot details
    const mentor = await mentorService.getMentorDetailsById(mentorId);

    if (!mentor || !mentor.profile) {
      throw new ValidationError(
        BookingManagementResponseMessages.ErrorMentorProfileNotfound
      );
    }
    //
    //  await prisma.mentor.findUnique({
    //   where: { id: mentorId },
    //   include: {
    //     profile: true,
    //   },
    // });

    // if (!mentor) {
    //   throw new Error("Mentor not found");
    // }
    const timeSlot = await timeSlotService.getTimeSlotsById(timeSlotId);

    // const timeSlot = await prisma.timeSlot.findUnique({
    //   where: { id: timeSlotId },
    // });

    if (!timeSlot) {
      throw new ValidationError(
        BookingManagementResponseMessages.ErrorTimeSlotNotFound
      );
    }

    if (timeSlot.isBooked) {
      throw new ValidationError(
        BookingManagementResponseMessages.ErrorTimeSlotAlreadyBooked
      );
    }

    // 3. Calculate session duration and format for display
    const startTime = timeSlot.startTime;
    const endTime = timeSlot.endTime;

    if (defaultSlots) {
      const res = await update_TimeSlots_By_Date_Server_Action(
        mentorId,
        date,
        initialSlots.map((slot) => ({
          mentorId: mentorId,
          start: slot.start,
          end: slot.end,
          date: new Date(date).toISOString(),
        }))
      );

      if (!res) {
        throw new ValidationError(
          BookingManagementResponseMessages.ErrorFailedToUpdateTimeSlots
        );
      }

      const newTimeSlot =
        await timeSlotService.getTimeSlotByMentorIdAndDateAndTime(
          mentorId,
          new Date(date).toISOString(),
          startTime.toString(),
          endTime.toString()
        );
      // const newTimeSlot = await prisma.timeSlot.findFirst({
      //   where: {
      //     mentorId: mentorId,
      //     date: new Date(date).toISOString(),
      //     startTime: startTime,
      //     endTime: endTime,
      //   },
      // });
      // console.log(newTimeSlot, "newTimeSlot", timeSlot);

      if (!newTimeSlot) {
        throw new ValidationError(
          BookingManagementResponseMessages.ErrorTimeSlotNotFound
        );
      }

      bookingslotId = newTimeSlot.id.toString();
    }

    // 4. Create a new pending booking in the database
    const booking = await bookingService.createBooking({
      userId: userId,
      mentorId: mentorId,
      timeSlotId: bookingslotId,
      startTime: startTime.toString(),
      endTime: endTime.toString(),
      bookingDate: date,
      status: "pending",
      paymentAmount: mentor.hourlyRate.toString(),
    });
    // const booking = await prisma.booking.create({
    //   data: {
    //     userId: userId,
    //     mentorId: mentorId,
    //     timeSlotId: bookingslotId,
    //     startTime: startTime,
    //     endTime: endTime,
    //     bookingDate: date,
    //     status: "pending",
    //     paymentAmount: mentor.hourlyRate.toString(), // Store as string to avoid precision issues
    //   },
    // });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "INR",
            product_data: {
              name: `Session with ${mentor.profile.name}`,
              description: `${mentor.expertise} | ${date} at ${startTime} - ${endTime}`,
              images: mentor.profile.image ? [mentor.profile.image] : [], // Only include if image is available
            },
            unit_amount: mentor.hourlyRate * 100, // In paise
          },
          quantity: 1,
        },
      ],
      metadata: {
        bookingId: booking.id,
        mentorId: mentorId,
        timeSlotId: bookingslotId,
        userId: userId,
        startTime: startTime,
        endTime: endTime,
        bookingDate: date,
        mentorName: mentor.profile.name,
        mentorExpertise: mentor.expertise,
        amount: mentor.hourlyRate.toString(), // Store as string to avoid precision issues
      },
      mode: "payment",
      success_url: `${process.env.NEXTAUTH_URL}/mentors/${mentorId}/booking/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXTAUTH_URL}/mentors/${mentorId}/booking/success?cancelled=true&&booking_id=${booking.id}&&time_slot_id=${bookingslotId}`,
    });

    await timeSlotService.changeStatusOfIsBooked(bookingslotId, true);
    // await prisma.timeSlot.update({
    //   where: { id: bookingslotId },

    //   data: {
    //     isBooked: true,
    //   },
    // });

    // 5. Update the booking with the session ID
    //  const  presenter =  { sessionId: session.id, sessionUrl: session.url };
    return SuccessResponse("success", {
      sessionId: session.id,
      sessionUrl: session.url,
    });
  } catch (error) {
    if (error instanceof ValidationError) {
      return ErrorResponse(error.message);
    }
    console.error(error, "Stripe checkout error:");
    return ErrorResponse(
      error instanceof Error
        ? error.message
        : "failed to Stripe checkout error:"
    );
  }
};
