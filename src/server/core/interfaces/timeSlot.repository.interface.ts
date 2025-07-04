import { BaseRepository } from "@/server/repositories/prisma.BaseRepository";
import { ITimeSlot } from "../entities/timeSlot";

export interface ITimeSlotRepository extends BaseRepository<ITimeSlot> {
  findByMentorIdAndDateAndTime(
    mentorId: string,
    date: string,
    startTime: string,
    endTime: string
  ): Promise<ITimeSlot | null>;
  deleteAllByDate(mentorId: string, date: Date): Promise<boolean>;

  updateSlotsForMentorByDate(
    mentorId: string,
    date: Date,
    slots: createTimeSlotDTO[]
  ): Promise<boolean>;
}
