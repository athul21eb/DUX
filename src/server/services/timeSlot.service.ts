import { ITimeSlot } from "../core/entities/timeSlot";
import { ValidationError } from "../core/errors/errors";
import { ITimeSlotRepository } from "../core/interfaces/timeSlot.repository.interface";
import { ITimeSlotService } from "../core/interfaces/timeSlot.service.interface";
import { TimeSlotRepoInstance } from "../repositories/prisma.timeSlot.repository";
import { SlotManagementResponseMessages } from "../shared/constants/constant";

export class TimeSlotServiceImpl implements ITimeSlotService {
  private timeSlotRepository: ITimeSlotRepository;

  constructor(timeSlotRepository: ITimeSlotRepository) {
    this.timeSlotRepository = timeSlotRepository;
  }
  getDefaultTimeSlots(id: string): Promise<ITimeSlot[]> {
    return this.timeSlotRepository.findAll({
      where: {
        date: null,
        mentorId: id,
      },
      orderBy: [{ startTime: "asc" }],
    });
  }
  getSelectedDayTimeSlots(id: string, date: Date): Promise<ITimeSlot[]> {
    return this.timeSlotRepository.findAll({
      where: {
        date: date,
        mentorId: id,
      },
      orderBy: [{ startTime: "asc" }],
    });
  }
  async updateTimeSlotsByDate(
    id: string,
    date: Date,
    slots: createTimeSlotDTO[]
  ): Promise<boolean> {
    try {
    if (!id || !date || !slots||!slots.length) {
        throw new ValidationError(SlotManagementResponseMessages.ErrorInvalidInputByIdandDateAreRequired);
      }

      // const response = await this.timeSlotRepository.deleteAllByDate(id, date);
      // if (!response) {
      //   throw new ValidationError(SlotManagementResponseMessages.ErrorFailedToUpdateTimeSlots);

      // }

    //  slots.forEach(async (slot) => {
    //     await this.timeSlotRepository.create(slot);
    //   })

    await this.timeSlotRepository.updateSlotsForMentorByDate(id, date, slots);

      return true;
    } catch (error) {
      if (error instanceof ValidationError) throw error;
      console.error("Error in timeslot  Service:", error);

     throw new Error(SlotManagementResponseMessages.ErrorFailedToUpdateTimeSlots)
    }
  }
}

export const timeSlotService = new TimeSlotServiceImpl(TimeSlotRepoInstance);
