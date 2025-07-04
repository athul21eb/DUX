export interface IBooking {
  id: string;
  userId: string;
  timeSlotId: string;
  mentorId: string;
  status: 'pending' | 'confirmed' | 'failed' | 'canceled' | 'completed';
  paymentId?: string;
  startTime: string;
  endTime: string;
  bookingDate: string;
  paymentAmount: string;
  createdAt: Date;
  updatedAt: Date;


}
