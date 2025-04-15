import { ITimeSlot } from "../entities/timeSlot";

export interface ITimeSlotService {

  getDefaultTimeSlots(id:string):Promise<ITimeSlot[]>;
  getSelectedDayTimeSlots(id:string,date:Date):Promise<ITimeSlot[]>
  createTimeSlots(id:string,date:Date,slots:Partial<ITimeSlot>[]):Promise<ITimeSlot[]>


}
