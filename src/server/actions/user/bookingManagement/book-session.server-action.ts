"use server";

import { stripe } from "@/lib/stripe";

import { revalidatePath } from "next/cache";
import Stripe from "stripe";
import { prisma } from "@/lib/db/database";

import { ValidationError } from "@/server/core/errors/errors";
import {
  ErrorResponse,
  SuccessResponse,
  TErrorResponse,
  TSuccessResponse,
} from "@/utils/serverActionResponses/serverActionResponses";
import { update_TimeSlots_By_Date_Server_Action } from "../../mentor/timeSlotManagement/update-timeSlots-by-date.server-action";

interface slot {
  start: string;
  end: string;
}

export const create_stripe_checkout_Server_Action = async (
  mentorId: string,
  timeSlotId: string,
  date: string,
  userId: string,
  defaultSlots: boolean,
  initialSlots: slot[]
): Promise<TSuccessResponse<any> | TErrorResponse> => {
  try {
    // 1. Validate inputs
    if (!mentorId || !timeSlotId || !date || !userId) {
      throw new Error("Missing required parameters");
    }
    let bookingslotId = timeSlotId;
    // 2. Get mentor and time slot details
    const mentor = await prisma.mentor.findUnique({
      where: { id: mentorId },
      include: {
        profile: true,
      },
    });

    if (!mentor) {
      throw new Error("Mentor not found");
    }

    const timeSlot = await prisma.timeSlot.findUnique({
      where: { id: timeSlotId },
    });

    if (!timeSlot) {
      throw new Error("Time slot not found");
    }

    if (timeSlot.isBooked) {
      throw new Error("This time slot is already booked");
    }

    // 3. Calculate session duration and format for display
    const startTime = timeSlot.startTime;
    const endTime = timeSlot.endTime;

    if (defaultSlots) {
      const res = await update_TimeSlots_By_Date_Server_Action(
        mentorId,
        date,
        initialSlots.map((slot) => ({
          mentorId: mentorId,
          start: slot.start,
          end: slot.end,
          date: new Date(date).toISOString(),
        }))
      );

      if (!res) {
        throw new Error("Failed to update time slots");
      }

      const newTimeSlot = await prisma.timeSlot.findFirst({
        where: {
          mentorId: mentorId,
          date: new Date(date).toISOString(),
          startTime: startTime,
          endTime: endTime,
        },
      });
      console.log(newTimeSlot, "newTimeSlot", timeSlot);
      if (!newTimeSlot) {
        throw new Error("New time slot not found");
      }

      bookingslotId = newTimeSlot.id;
    }

    // 4. Create a new pending booking in the database
    const booking = await prisma.booking.create({
      data: {
        userId: userId,
        mentorId: mentorId,
        timeSlotId: bookingslotId,
        startTime: startTime,
        endTime: endTime,
        bookingDate: date,
        status: "pending",
        paymentAmount: mentor.hourlyRate.toString(), // Store as string to avoid precision issues
      },
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "INR",
            product_data: {
              name: `Session with ${mentor.profile.name}`,
              description: `${mentor.expertise} | ${date} at ${startTime} - ${endTime}`,
              images: mentor.profile.image ? [mentor.profile.image] : [], // Only include if image is available
            },
            unit_amount: mentor.hourlyRate * 100, // In paise
          },
          quantity: 1,
        },
      ],
      metadata: {
        bookingId: booking.id,
        mentorId: mentorId,
        timeSlotId: bookingslotId,
        userId: userId,
        startTime: startTime,
        endTime: endTime,
        bookingDate: date,
        mentorName: mentor.profile.name,
        mentorExpertise: mentor.expertise,
        amount: mentor.hourlyRate.toString(), // Store as string to avoid precision issues
      },
      mode: "payment",
      success_url: `${process.env.NEXTAUTH_URL}/mentors/${mentorId}/booking/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXTAUTH_URL}/mentors/${mentorId}/booking/success?cancelled=true&&booking_id=${booking.id}&&time_slot_id=${bookingslotId}`,
    });

    await prisma.timeSlot.update({
      where: { id: bookingslotId },

      data: {
        isBooked: true,
      },
    });

    // 5. Update the booking with the session ID
    //  const  presenter =  { sessionId: session.id, sessionUrl: session.url };
    return SuccessResponse("success", {
      sessionId: session.id,
      sessionUrl: session.url,
    });
  } catch (error) {
    if (error instanceof ValidationError) {
      return ErrorResponse(error.message);
    }
    console.error(error, "Stripe checkout error:");
    return ErrorResponse(
      error instanceof Error
        ? error.message
        : "failed to Stripe checkout error:"
    );
  }
};

export async function handleStripeWebhook(req: Request) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature") as string;

  if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
    throw new Error("Missing Stripe webhook signature or secret");
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Webhook signature verification failed", err);
    throw new Error("Webhook signature verification failed");
  }

  const session = event.data.object as Stripe.Checkout.Session;
  const bookingId = session.metadata?.bookingId;
  const timeSlotId = session.metadata?.timeSlotId;
  const mentorId = session.metadata?.mentorId;
  const paymentAmount = session.metadata?.amount;

  try {
    if (event.type === "checkout.session.completed") {
      if (bookingId && timeSlotId && mentorId && paymentAmount) {
        const amountFloat = parseFloat(paymentAmount);
        const mentorShare = parseFloat((amountFloat * 0.95).toFixed(2)); // 95%
        const transactionId = session.id; // or session.payment_intent as string

        // Update booking status
        await prisma.booking.update({
          where: { id: bookingId },
          data: {
            status: "confirmed",
            paymentId: session.payment_intent as string,
          },
        });

        // Mark timeslot as booked
        await prisma.timeSlot.update({
          where: { id: timeSlotId },
          data: { isBooked: true },
        });

        // Get the mentor's user ID
        const mentor = await prisma.mentor.findUnique({
          where: { id: mentorId },
          include: { profile: true },
        });

        const mentorUserId = mentor?.userId;

        if (mentorUserId) {
          // Ensure wallet exists
          let wallet = await prisma.wallet.findUnique({
            where: { userId: mentorUserId },
          });

          if (!wallet) {
            wallet = await prisma.wallet.create({
              data: {
                userId: mentorUserId,
                balance: 0,
              },
            });
          }

          // Create a transaction
          await prisma.transaction.create({
            data: {
              transactionId,
              paymentId: session.payment_intent as string,
              walletId: wallet.id,
              bookingId,
              description: `Mentor payout for booking ${bookingId}`,
              amount: mentorShare,
              type: "credit",
              status: "success",
            },
          });

          // Update wallet balance
          await prisma.wallet.update({
            where: { id: wallet.id },
            data: {
              balance: {
                increment: mentorShare,
              },
            },
          });
        }

        // Revalidate paths
        revalidatePath(`/mentors/${mentorId}/booking`);
        revalidatePath(`/mentors/${mentorId}`);
      }
    }

    return new Response(JSON.stringify({ received: true }));
  } catch (error) {
    console.error("Error handling Stripe webhook:", error);
    return new Response("Webhook error", { status: 500 });
  }
}

// Function to verify a checkout session status
export async function verifyCheckoutSession(sessionId: string) {
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === "paid") {
      return { success: true };
    }

    return { success: false };
  } catch (error) {
    console.error("Error verifying checkout session:", error);
    return { success: false };
  }
}

export async function CancelCheckOutSession(
  bookingId: string,
  timeSlotId: string
) {
  try {
    if (bookingId && timeSlotId) {
      await prisma.booking.delete({
        where: { id: bookingId },
      });

      await prisma.timeSlot.update({
        where: { id: timeSlotId },
        data: { isBooked: false },
      });
      return { success: true };
    }
    return { success: false };
  } catch (error) {
    console.error("Error cancel checkout session:", error);
    return { success: false };
  }
}
