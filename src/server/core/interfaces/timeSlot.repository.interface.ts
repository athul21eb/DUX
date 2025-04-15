import { BaseRepository } from "@/server/repositories/prisma.BaseRepository";
import { ITimeSlot } from "../entities/timeSlot";

export interface ITimeSlotRepository extends BaseRepository<ITimeSlot>{}
