import { BaseRepository } from "@/server/repositories/prisma.BaseRepository";
import { ITimeSlot } from "../entities/timeSlot";

export interface ITimeSlotRepository extends BaseRepository<ITimeSlot> {
  deleteAllByDate(mentorId: string, date: Date): Promise<boolean>;

  updateSlotsForMentorByDate(
    mentorId: string,
    date: Date,
    slots: createTimeSlotDTO[]
  ): Promise<boolean>;
}
