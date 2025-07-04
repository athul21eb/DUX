


export interface createBookingDTO {
  userId: string;
  mentorId: string;
  timeSlotId: string;
  startTime: string;
  endTime: string;
  bookingDate: string;
  status: "pending";
  paymentAmount: string;
}
