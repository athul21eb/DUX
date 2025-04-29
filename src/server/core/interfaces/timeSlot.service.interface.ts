import { ITimeSlot } from "../entities/timeSlot";

export interface ITimeSlotService {

  getDefaultTimeSlots(id:string):Promise<ITimeSlot[]>;
  getSelectedDayTimeSlots(id:string,date:Date):Promise<ITimeSlot[]>
  updateTimeSlotsByDate(id:string,date:Date,slots:createTimeSlotDTO[]):Promise<boolean>


}
