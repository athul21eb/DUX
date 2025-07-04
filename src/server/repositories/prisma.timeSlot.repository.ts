import { prisma } from "@/lib/db/database";
import { BaseRepository } from "./prisma.BaseRepository";
import { ITimeSlot } from "../core/entities/timeSlot";
import { ITimeSlotRepository } from "../core/interfaces/timeSlot.repository.interface";

export class TimeSlotRepository
  extends BaseRepository<ITimeSlot>
  implements ITimeSlotRepository
{
  constructor() {
    super(prisma.timeSlot);
  }
  async findByMentorIdAndDateAndTime(
    mentorId: string,
    date: string,
    startTime: string,
    endTime: string
  ): Promise<ITimeSlot | null> {
    return await  this.model.findFirst({
      where: {
        mentorId,
        date,
        startTime,
        endTime,
      },
    });
  }

  async deleteAllByDate(mentorId: string, date: Date): Promise<boolean> {
    try {
      await this.model.deleteMany({
        where: {
          mentorId,
          date,
        },
      });
      return true;
    } catch (error) {
      console.error("Error deleting time slots:", error);
      return false;
    }
  }

  async updateSlotsForMentorByDate(
    mentorId: string,
    date: Date,
    slots: createTimeSlotDTO[]
  ): Promise<boolean> {
    try {
      await prisma.$transaction(async (tx) => {
        // 1. Delete existing slots for mentor + date
        await tx.timeSlot.deleteMany({
          where: {
            mentorId,
            date,
          },
        });

        // 2. Insert new slots
        if (slots.length > 0) {
          await tx.timeSlot.createMany({
            data: slots.map((slot) => ({
              mentorId,
              startTime: slot.start, // Add `!` because you know it is there
              endTime: slot.end,
              date: slot.date, // fallback to function param date if slot.date missing
              isBooked: false,
            })),
            skipDuplicates: true,
          });
        }
      });

      return true;
    } catch (error) {
      console.error("Error updating time slots:", error);
      return false;
    }
  }
}

export const TimeSlotRepoInstance = new TimeSlotRepository();
