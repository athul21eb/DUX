import { createBookingDTO } from "../dtos/bookingDtos";
import { IBooking } from "../entities/booking";





export interface IBookingService {

   createBooking(data:createBookingDTO):Promise<IBooking>

}