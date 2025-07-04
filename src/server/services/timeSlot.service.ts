import { ITimeSlot } from "../core/entities/timeSlot";
import { ValidationError } from "../core/errors/errors";
import { ITimeSlotRepository } from "../core/interfaces/timeSlot.repository.interface";
import { ITimeSlotService } from "../core/interfaces/timeSlot.service.interface";
import { TimeSlotRepoInstance } from "../repositories/prisma.timeSlot.repository";
import { DefaultResponseMessages, SlotManagementResponseMessages } from "../shared/constants/constant";

export class TimeSlotServiceImpl implements ITimeSlotService {
  private timeSlotRepository: ITimeSlotRepository;

  constructor(timeSlotRepository: ITimeSlotRepository) {
    this.timeSlotRepository = timeSlotRepository;
  }
  async changeStatusOfIsBooked(id: string, isBooked: boolean): Promise<boolean> {
    try{
           if(!id||!isBooked){
            throw new ValidationError(DefaultResponseMessages.ErrorInvalidInputByParametersRequired(['id','isBookedStatus']))
           }

         const changed =   await this.timeSlotRepository.update(id,{isBooked})
if(!changed){
  throw new ValidationError(SlotManagementResponseMessages.ErrorFailedToUpdateBookingStatusOfTimeSlot)
}
           return true;
    }catch(error){
      if (error instanceof ValidationError) throw error;
      console.error("Error in timeslot  Service:", error);

      throw new Error(
        SlotManagementResponseMessages.ErrorFailedToUpdateBookingStatusOfTimeSlot
      );
    }
  }
  async getTimeSlotByMentorIdAndDateAndTime(mentorId: string, date: string, startTime: string, endTime: string): Promise<ITimeSlot> {
    try{
 const timeSlotFetched = await this.timeSlotRepository.findByMentorIdAndDateAndTime(mentorId,date,startTime,endTime);

 if(!timeSlotFetched){
  throw new  ValidationError(SlotManagementResponseMessages.ErrorTimeSlotNotFound);

 }

 return timeSlotFetched
    }catch(error){
      if (error instanceof ValidationError) throw error;
      console.error("Error in timeslot  Service:", error);

      throw new Error(
        SlotManagementResponseMessages.ErrorFailedToFetchTimeSlot
      );
    }
  }
  async getTimeSlotsById(id: string): Promise<ITimeSlot> {
    try {
      const timeSlotById = await this.timeSlotRepository.findById(id);

      if (!timeSlotById) {
        throw new ValidationError(
          SlotManagementResponseMessages.ErrorTimeSlotNotFound
        );
      }

      return timeSlotById;
    } catch (error) {
      if (error instanceof ValidationError) throw error;
      console.error("Error in timeslot  Service:", error);

      throw new Error(
        SlotManagementResponseMessages.ErrorFailedToFetchTimeSlot
      );
    }
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
      if (!id || !date || !slots || !slots.length) {
        throw new ValidationError(
          SlotManagementResponseMessages.ErrorInvalidInputByIdandDateAreRequired
        );
      }

      await this.timeSlotRepository.updateSlotsForMentorByDate(id, date, slots);

      return true;
    } catch (error) {
      if (error instanceof ValidationError) throw error;
      console.error("Error in timeslot  Service:", error);

      throw new Error(
        SlotManagementResponseMessages.ErrorFailedToUpdateTimeSlots
      );
    }
  }
}

export const timeSlotService = new TimeSlotServiceImpl(TimeSlotRepoInstance);
