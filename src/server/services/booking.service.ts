import { createBookingDTO } from "../core/dtos/bookingDtos";
import { IBooking } from "../core/entities/booking";
import { ValidationError } from "../core/errors/errors";
import { IBookingRepository } from "../core/interfaces/booking.respository.interface";
import { IBookingService } from "../core/interfaces/booking.service.interface";
import { BookingRepoInstance } from "../repositories/prisma.bookingRepository";
import {
  BookingManagementResponseMessages,
  DefaultResponseMessages,
} from "../shared/constants/constant";

import { isValid, parseISO } from "date-fns";

export class BookingService implements IBookingService {
  constructor(private bookingRepository: IBookingRepository) {}

  async createBooking(data: createBookingDTO): Promise<IBooking> {
    try {
      // Validate required fields
      const requiredFields: (keyof createBookingDTO)[] = [
        "userId",
        "mentorId",
        "timeSlotId",
        "startTime",
        "endTime",
        "bookingDate",
        "status",
        "paymentAmount",
      ];

      for (const field of requiredFields) {
        if (!data[field]) {
          throw new ValidationError(
            DefaultResponseMessages.ErrorInvalidInputByParametersRequired([
              field,
            ])
          );
        }
      }

      // Validate status (must be "pending")
      if (data.status !== "pending") {
        throw new ValidationError(
          BookingManagementResponseMessages.ErrorInvalidInputBystatusTocreateBooking(
            data.status
          )
        );
      }

      // Validate dates
      if (!isValid(parseISO(data.startTime))) {
        throw new ValidationError(BookingManagementResponseMessages.ErrorInvalidInputByTimeFormat("startTime"));
      }

      if (!isValid(parseISO(data.endTime))) {
        throw new ValidationError(BookingManagementResponseMessages.ErrorInvalidInputByTimeFormat("endTime"));
      }

      if (!isValid(parseISO(data.bookingDate))) {
        throw new ValidationError(BookingManagementResponseMessages.ErrorInvalidInputByTimeFormat("bookingTime"));
      }

      const booking = await this.bookingRepository.create(data);
      if (!booking) {
        throw new ValidationError(
          BookingManagementResponseMessages.ErrorFailedToCreateBooking
        );
      }
      return booking;
    } catch (error) {
      if (error instanceof ValidationError) throw error;
      console.error("Error in create booking Service:", error);

      throw new Error(
        BookingManagementResponseMessages.ErrorFailedToCreateBooking
      );
    }
  }
}




export const bookingService = new BookingService(BookingRepoInstance);