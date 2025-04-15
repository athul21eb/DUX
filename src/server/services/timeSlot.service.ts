import { ITimeSlot } from "../core/entities/timeSlot";
import { ITimeSlotRepository } from "../core/interfaces/timeSlot.repository.interface";
import { ITimeSlotService } from "../core/interfaces/timeSlot.service.interface";
import { TimeSlotRepoInstance } from "../repositories/prisma.timeSlot.repository";

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
  createTimeSlots(
    id: string,
    date: Date,
    slots: Partial<ITimeSlot>[]
  ): Promise<ITimeSlot[]> {
    throw new Error("Method not implemented.");
  }
}



export const timeSlotService = new TimeSlotServiceImpl(TimeSlotRepoInstance);