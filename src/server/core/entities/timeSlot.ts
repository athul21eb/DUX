export interface ITimeSlot {
  id     :   String
  mentorId : String
  date ?  :   Date // Specific date for the slot
  startTime: String   // Start time of the slot
  endTime :  String   // End time of the slot
  isBooked : Boolean
}