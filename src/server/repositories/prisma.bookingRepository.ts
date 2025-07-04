import { prisma } from "@/lib/db/database";
import { IBooking } from "../core/entities/booking";
import { IBookingRepository } from "../core/interfaces/booking.respository.interface";
import { BaseRepository } from "./prisma.BaseRepository";



export class BookingRepository extends BaseRepository<IBooking> implements IBookingRepository{

  constructor(){
    super(prisma.booking);
  }

}



export const BookingRepoInstance = new BookingRepository();
