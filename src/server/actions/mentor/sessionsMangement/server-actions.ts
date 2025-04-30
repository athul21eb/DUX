'use server'


import { revalidatePath } from "next/cache";
import { BookingStatus } from "@prisma/client";
import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/db/database";


export interface GetMentorBookingsDTO {
  bookings: {
    id: string;
    userId: string;
    mentorId: string;
    startTime: string;
    endTime: string;
    bookingDate: string;
    paymentAmount: string;
    status: BookingStatus;
    user: {
      name: string;
      email: string;
    };
    createdAt: Date;
  }[];
  totalPages: number;
  currentPage: number;
  totalCount: number;
}

export type MentorBookingResult = {
  success: boolean;
  message: string;
  data?: GetMentorBookingsDTO;
};

export const Get_Mentor_Bookings_With_Pagination_Server_Action = async (
  page: number = 1,
  itemsPerPage: number = 10
): Promise<MentorBookingResult> => {
  try {
    // Get current user session
    const session = await auth();

    if (!session?.user) {
      return {
        success: false,
        message: "Authentication required",
      };
    }

    // Find the mentor profile associated with the current user
    const mentorProfile = await prisma.mentor.findUnique({
      where: { userId: session.user.id },
    });

    if (!mentorProfile) {
      return {
        success: false,
        message: "Mentor profile not found",
      };
    }

    // Calculate skip value for pagination
    const skip = (page - 1) * itemsPerPage;

    // Get total count of bookings for this mentor
    const totalCount = await prisma.booking.count({
      where: { mentorId: mentorProfile.id },
    });

    // Calculate total pages
    const totalPages = Math.ceil(totalCount / itemsPerPage);

    // Get bookings with pagination
    const bookings = await prisma.booking.findMany({
      where: { mentorId: mentorProfile.id },
      skip,
      take: itemsPerPage,
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return {
      success: true,
      message: "Bookings fetched successfully",
      data: {
        bookings: bookings.map(booking => ({
          ...booking,
          user: {
            ...booking.user,
            name: booking.user.name ?? "", // Provide a fallback for null values
          },
        })),
        totalPages,
        currentPage: page,
        totalCount,
      },
    };
  } catch (error) {
    console.error("Error fetching mentor bookings:", error);
    return {
      success: false,
      message: "Failed to fetch bookings",
    };
  }
};

export type CancelSessionResult = {
  success: boolean;
  message: string;
};

export const Cancel_Mentor_Session_Server_Action = async (
  bookingId: string
): Promise<CancelSessionResult> => {
  try {
    // Get current user session
    const session = await auth();

    if (!session?.user) {
      return {
        success: false,
        message: "Authentication required",
      };
    }

    // Find the mentor profile associated with the current user
    const mentorProfile = await prisma.mentor.findUnique({
      where: { userId: session.user.id },
    });

    if (!mentorProfile) {
      return {
        success: false,
        message: "Mentor profile not found",
      };
    }

    // Find the booking
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
    });

    if (!booking) {
      return {
        success: false,
        message: "Booking not found",
      };
    }

    // Verify that this booking belongs to the current mentor
    if (booking.mentorId !== mentorProfile.id) {
      return {
        success: false,
        message: "Unauthorized: This booking doesn't belong to you",
      };
    }

    // Check if booking can be cancelled (not already cancelled or completed)
    if (booking.status === BookingStatus.canceled || booking.status === BookingStatus.completed) {
      return {
        success: false,
        message: `Session cannot be cancelled because it is already ${booking.status}`,
      };
    }

    // Update booking status to cancelled
    await prisma.booking.update({
      where: { id: bookingId },
      data: { status: BookingStatus.canceled },
    });

    // Update the time slot to be available again
    await prisma.timeSlot.update({
      where: { id: booking.timeSlotId },
      data: { isBooked: false },
    });

    // Revalidate the sessions page
    revalidatePath("/dashboard/mentoring/sessions");

    return {
      success: true,
      message: "Session cancelled successfully",
    };
  } catch (error) {
    console.error("Error cancelling session:", error);
    return {
      success: false,
      message: "Failed to cancel session",
    };
  }
};

export const Get_Mentor_Session_By_Id_Server_Action = async (
  bookingId: string
): Promise<CancelSessionResult & { data?: any }> => {
  try {
    // Get current user session
    const session = await auth();

    if (!session?.user) {
      return {
        success: false,
        message: "Authentication required",
      };
    }

    // Find the mentor profile associated with the current user
    const mentorProfile = await prisma.mentor.findUnique({
      where: { userId: session.user.id },
    });

    if (!mentorProfile) {
      return {
        success: false,
        message: "Mentor profile not found",
      };
    }

    // Find the booking with user details
    const booking = await prisma.booking.findUnique({
      where: {
        id: bookingId,
        mentorId: mentorProfile.id, // Ensure it belongs to this mentor
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    if (!booking) {
      return {
        success: false,
        message: "Session not found or unauthorized",
      };
    }

    return {
      success: true,
      message: "Session fetched successfully",
      data: booking,
    };
  } catch (error) {
    console.error("Error fetching session details:", error);
    return {
      success: false,
      message: "Failed to fetch session details",
    };
  }
};