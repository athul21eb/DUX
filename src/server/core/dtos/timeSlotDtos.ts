

interface createTimeSlotDTO{

  start: string;
  end: string;
  date:string;
  mentorId:string

}


interface TimeSlotDTO{
  id?: string;
  mentorId?: string;
  start: string;
  end: string;
  isBooked?: boolean;
}