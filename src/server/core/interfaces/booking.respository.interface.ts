import { BaseRepository } from "@/server/repositories/prisma.BaseRepository";
import { IBooking } from "../entities/booking";



export interface  IBookingRepository extends BaseRepository<IBooking>{



}