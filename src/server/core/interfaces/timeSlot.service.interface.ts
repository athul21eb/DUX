import { ITimeSlot } from "../entities/timeSlot";

export interface ITimeSlotService {
  getTimeSlotByMentorIdAndDateAndTime(
    mentorId: string,
    date: string,
    startTime: string,
    endTime: string
  ): Promise<ITimeSlot>;

  getTimeSlotsById(id: string): Promise<ITimeSlot>;
  getDefaultTimeSlots(id: string): Promise<ITimeSlot[]>;
  getSelectedDayTimeSlots(id: string, date: Date): Promise<ITimeSlot[]>;
  updateTimeSlotsByDate(
    id: string,
    date: Date,
    slots: createTimeSlotDTO[]
  ): Promise<boolean>;

  changeStatusOfIsBooked(id:string,isBooked:boolean):Promise<boolean>;
}
