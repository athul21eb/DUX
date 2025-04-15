






   // Adjust the import path if necessary
import { prisma } from "@/lib/db/database";
import { BaseRepository } from "./prisma.BaseRepository";
import { ITimeSlot } from "../core/entities/timeSlot";

export class TimeSlotRepository extends BaseRepository<ITimeSlot> {
  constructor() {
    super(prisma.timeSlot);  // Replace 'YourTimeSlotModel' with your actual time slot model
  }


}


export const TimeSlotRepoInstance = new TimeSlotRepository();