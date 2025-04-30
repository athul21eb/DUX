"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle, XCircle, Loader2, ArrowRight, Ban } from "lucide-react";

import {
  CancelCheckOutSession,
  verifyCheckoutSession,
} from "@/server/actions/user/bookingManagement/book-session.server-action";
import { useSession } from "next-auth/react";
import LoadingFullScreen from "@/app/loading";
import CheckUserRoleAndRedirect from "@/components/shared/protectingRoleBasedRouteComponent";

type StatusType = "loading" | "success" | "error" | "cancelled";

export default function BookingSuccessPage() {
  const {} = useSession();
  const searchParams = useSearchParams();
  const router = useRouter();

  const sessionId = searchParams.get("session_id");
  const cancelled = searchParams.get("cancelled");
  const bookingId = searchParams.get("booking_id");
  const timeSlotId = searchParams.get("time_slot_id");

  const [status, setStatus] = useState<StatusType>("loading");

  useEffect(() => {
    const verifySession = async () => {
      if (!sessionId) return;

      try {
        const result = await verifyCheckoutSession(sessionId);
        setStatus(result.success ? "success" : "error");
      } catch (error) {
        console.error("Error verifying session:", error);
        setStatus("error");
      }
    };

    const cancelSession = async () => {
      if (!(cancelled && bookingId && timeSlotId)) return;

      try {
        const result = await CancelCheckOutSession(bookingId, timeSlotId);
        setStatus(result.success ? "cancelled" : "error");
      } catch (error) {
        console.error("Error cancelling session:", error);
        setStatus("error");
      }
    };

    if (sessionId) {
      verifySession();
    } else if (cancelled && bookingId && timeSlotId) {
      cancelSession();
    }
  }, [sessionId, cancelled, bookingId, timeSlotId]);

  const renderContent = () => {
    switch (status) {
      case "loading":
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center min-h-screen text-center px-4"
          >
            <Loader2 className="w-12 h-12 animate-spin text-blue-600 mb-4" />
            <h1 className="text-xl md:text-2xl font-semibold">
              Processing your booking...
            </h1>
            <p className="text-gray-600 mt-2">
              Please wait while we confirm your payment.
            </p>
          </motion.div>
        );

      case "success":
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center min-h-screen text-center px-4"
          >
            <CheckCircle className="w-14 h-14 text-green-600 mb-4" />
            <h1 className="text-xl md:text-2xl font-bold text-green-700">
              Booking The Session is Confirmed!
            </h1>
            <p className="text-gray-700 mt-2">
              Your booking has been successfully processed.
            </p>
            <p className="text-gray-500 mt-1">
              You will receive a confirmation email shortly.
            </p>
            <button
              onClick={() => router.push("/user/sessions")}
              className="mt-8 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center gap-2 transition"
            >
              View My Bookings <ArrowRight size={18} />
            </button>
          </motion.div>
        );

      case "error":
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center min-h-screen text-center px-4"
          >
            <XCircle className="w-14 h-14 text-red-600 mb-4" />
            <h1 className="text-xl md:text-2xl font-bold text-red-700">
              Booking Error
            </h1>
            <p className="text-gray-700 mt-2">
              There was a problem confirming your booking.
            </p>
            <p className="text-gray-500 mt-1">
              Please contact support or try again later.
            </p>
            <button
              onClick={() => router.push("/")}
              className="mt-8 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center gap-2 transition"
            >
              Go to Home <ArrowRight size={18} />
            </button>
          </motion.div>
        );

      case "cancelled":
        return (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center min-h-screen text-center px-4"
          >
            <Ban className="w-14 h-14 text-red-600 mb-4" />
            <h1 className="text-xl md:text-2xl font-bold text-red-700">
              Booking Cancelled
            </h1>
            <p className="text-gray-700 mt-2">
              Your booking was cancelled or not completed.
            </p>
            <p className="text-gray-500 mt-1">
              You can try booking again if you'd like.
            </p>
            <button
              onClick={() => router.push("/")}
              className="mt-8 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center gap-2 transition"
            >
              Go to Home <ArrowRight size={18} />
            </button>
          </motion.div>
        );
    }
  };

  return (
    <div>
      {" "}
      <Suspense fallback={<LoadingFullScreen />}>
        <CheckUserRoleAndRedirect allowedRole="user" />
      </Suspense>
      <div>{renderContent()}</div>
    </div>
  );
}
