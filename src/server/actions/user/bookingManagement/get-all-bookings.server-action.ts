// get-all-bookings.server-action.ts
'use server'

import { prisma } from "@/lib/db/database";
import { BookingStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";


export interface GetAllBookingsDTO {
  bookings: {
    id: string;
    mentorId: string;
    startTime: string;
    endTime: string;
    bookingDate: string;
    paymentAmount: string;
    status: BookingStatus;
    user: {
      name: string;
      image: string | null;
    };
    mentor: {
      expertise: string;
      profile: {
        name: string;
        image: string | null;
      }
    };
    createdAt: Date;
  }[];
  totalPages: number;
  currentPage: number;
  totalCount: number;
}

export type BookingResult = {
  success: boolean;
  message: string;
  data?: GetAllBookingsDTO;
};

export const Get_All_Bookings_With_Pagination_Server_Action = async (
  page: number = 1,
  itemsPerPage: number = 10
): Promise<BookingResult> => {
  try {
    // Calculate skip value for pagination
    const skip = (page - 1) * itemsPerPage;

    // Get total count of bookings
    const totalCount = await prisma.booking.count();

    // Calculate total pages
    const totalPages = Math.ceil(totalCount / itemsPerPage);

    // Get bookings with pagination
    const bookings = await prisma.booking.findMany({
      skip,
      take: itemsPerPage,
      include: {
        user: {
          select: {
            name: true,
            image: true,
          },
        },
        mentor: {
          select: {
            expertise: true,
            // Removed the 'user' property as it does not exist in 'MentorSelect<DefaultArgs>'
            profile: {
              select: {
                name: true,
                image: true,
              },
            },
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
            name: booking.user.name ?? "Unknown", // Ensure name is non-nullable
          },
          mentor: {
            ...booking.mentor,
            profile: {
              ...booking.mentor.profile,
              name: booking.mentor.profile.name ?? "Unknown", // Ensure profile name is non-nullable
            },
          },
        })),
        totalPages,
        currentPage: page,
        totalCount,
      },
    };
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return {
      success: false,
      message: "Failed to fetch bookings",
    };
  }
};

// // cancel-booking.server-action.ts
// 'use server'

// import { prisma } from "@/server/prisma";
// import { revalidatePath } from "next/cache";
// import { BookingStatus } from "@prisma/client";

export type CancelBookingResult = {
  success: boolean;
  message: string;
};

export const Cancel_Booking_Server_Action = async (
  bookingId: string
): Promise<CancelBookingResult> => {
  try {
    // Find the booking first
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
    });

    if (!booking) {
      return {
        success: false,
        message: "Booking not found",
      };
    }

    // Check if booking can be cancelled (not already cancelled or completed)
    if (booking.status === BookingStatus.canceled || booking.status === BookingStatus.completed) {
      return {
        success: false,
        message: `Booking cannot be cancelled because it is already ${booking.status}`,
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

    // Revalidate the bookings page
    revalidatePath("/admin/bookings");
    revalidatePath("/dashboard/bookings");

    return {
      success: true,
      message: "Booking cancelled successfully",
    };
  } catch (error) {
    console.error("Error cancelling booking:", error);
    return {
      success: false,
      message: "Failed to cancel booking",
    };
  }
};

// // get-booking-by-id.server-action.ts
// 'use server'

// import { prisma } from "@/server/prisma";
// import { BookingStatus } from "@prisma/client";
// import { revalidatePath } from "next/cache";

export interface BookingDetailsDTO {
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
  mentor: {
    user: {
      name: string;
    };
    profile: {
      name: string;
      image: string | null;
    };
  };
  createdAt: Date;
}

export type GetBookingResult = {
  success: boolean;
  message: string;
  data?: BookingDetailsDTO;
};

export const Get_Booking_By_Id_Server_Action = async (
  bookingId: string
): Promise<GetBookingResult> => {
  try {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
        mentor: {
          select: {
            expertise: true,
            // Removed the 'user' property as it does not exist in 'MentorSelect<DefaultArgs>'
            profile: {
              select: {
                name: true,
                image: true,
              },
            },
          },
        },
      },
    });

    if (!booking) {
      return {
        success: false,
        message: "Booking not found",
      };
    }

    return {
      success: true,
      message: "Booking fetched successfully",
      data: {
        ...booking,
        user: {
          ...booking.user,
          name: booking.user.name ?? "Unknown", // Ensure name is non-nullable
        },
        mentor: {
          ...booking.mentor,
          profile: {
            ...booking.mentor.profile,
            name: booking.mentor.profile.name ?? "Unknown", // Ensure profile name is non-nullable
          },
          user: {
            name: ""
          }
        },
      },
    };
  } catch (error) {
    console.error("Error fetching booking:", error);
    return {
      success: false,
      message: "Failed to fetch booking",
    };
  }
};