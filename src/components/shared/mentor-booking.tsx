"use client";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { format, addDays } from "date-fns";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  Clock,
  IndianRupee,
  Calendar,
  ArrowRight,
  AlertCircle,
  Loader2,
} from "lucide-react";
import toast from "react-hot-toast";
import { useTransitionRouter } from "next-view-transitions";
import { Fetch_TimeSlots_By_Date_With_IsBooked_Server_Action } from "@/server/actions/user/bookingManagement/fetch-timeSlots-by-date.server-action";
import { useSession } from "next-auth/react";
import { create_stripe_checkout_Server_Action } from "@/server/actions/user/bookingManagement/book-session.server-action";
import { Fetch_Bookings_By_Date_Server_Action } from "@/server/actions/user/bookingManagement/fetch-bookings-by-date.server-action";

interface Slot {
  id: string;
  start: string;
  end: string;
  isBooked?: boolean;
}

interface MentorProfile {
  id: string;
  name: string;
  image: string;
  expertise: string;
  verified: "verified" | "pending" | "rejected";
  hourlyRate: number;
  bio?: string;
  experience?: string;
}

interface MentorBookingProps {
  mentor: MentorProfile;
  initialSlots: Slot[];
}

// Mock function to book a session
const bookMentorSession = async (
  mentorId: string,
  date: string,
  slotId: string,
  userId: string
): Promise<boolean> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1200));

  // 90% chance of success
  return Math.random() > 0.1;
};

export default function MentorBooking({
  mentor,
  initialSlots,
}: MentorBookingProps) {
  const next7Days = Array.from({ length: 7 }, (_, i) =>
    addDays(new Date(), i + 1)
  );
  const [selectedDate, setSelectedDate] = useState<Date>(next7Days[0]);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [availableSlots, setAvailableSlots] = useState<Slot[]>(initialSlots);
  const [defaultSlots, setDefaultSlots] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isBooking, setIsBooking] = useState<boolean>(false);
  const { data } = useSession();
  const router = useTransitionRouter();

  // Fetch slots when date changes
  useEffect(() => {
    const loadSlots = async () => {
      setIsLoading(true);
      try {
        const formattedDate = format(selectedDate, "yyyy-MM-dd");
        const response =
          await Fetch_TimeSlots_By_Date_With_IsBooked_Server_Action(
            mentor.id,
            formattedDate
          );

        console.log(response);
        if (response.success && response.data) {
          setAvailableSlots(response.data);
          setDefaultSlots(false);
        } else {
          setAvailableSlots(initialSlots);
          setDefaultSlots(true);
        }

        setSelectedSlot(null); // Reset selection when date changes
      } catch (error) {
        console.error("Error loading slots:", error);
        toast.error("Failed to load available time slots");
        setAvailableSlots(initialSlots);
      } finally {
        setIsLoading(false);
      }
    };

    loadSlots();
  }, [selectedDate, mentor.id]);

  const handleBookSession = async () => {
    if (!selectedSlot) return;

    setIsBooking(true);
    try {
      const formattedDate = format(selectedDate, "yyyy-MM-dd");
      const res = await create_stripe_checkout_Server_Action(
        mentor.id,
        selectedSlot.id,
        formattedDate,
        data?.user?.id as string,
        defaultSlots,
        initialSlots.map((slot) => ({
          start: slot.start,
          end: slot.end,
        }))
      );

      if (res.success) {
        // Redirect to Stripe checkout
        window.location.href = res.data.sessionUrl;
        //   toast.success(
        //     "Booking Successful"
        //     // description: `Your session with ${mentor.name} on ${format(
        //     //   selectedDate,
        //     //   "MMMM d"
        //     // )} at ${selectedSlot.start} has been booked.`,
        //   );

        //   // Update the slot as booked
        //   setAvailableSlots((prev) =>
        //     prev.map((slot) =>
        //       slot.id === selectedSlot.id ? { ...slot, isBooked: true } : slot
        //     )
        //   );
        setSelectedSlot(null);
      } else {
        toast.error("Unable to book this session. Please try again.");
      }
    } catch (error) {
      console.error("Error booking session:", error);
      toast("Something went wrong while booking your session");
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Mentor Profile Card */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage
                  src={mentor.image || ""}
                  alt={mentor.name || "Mentor"}
                />
                <AvatarFallback>
                  {mentor.name?.substring(0, 2) || "MN"}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-2xl">{mentor.name}</CardTitle>
                <CardDescription className="text-lg">
                  {mentor.expertise}
                </CardDescription>
                <div className="flex items-center gap-2 mt-1">
                  <Badge
                    variant={
                      mentor.verified === "verified"
                        ? "default"
                        : mentor.verified === "rejected"
                        ? "destructive"
                        : "secondary"
                    }
                  >
                    {mentor.verified.toUpperCase()}
                  </Badge>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <IndianRupee className="h-3 w-3" /> {mentor.hourlyRate}/hr
                  </Badge>
                </div>
              </div>
            </div>

            <div className="flex items-center mt-2 md:mt-0">
              <Button
                className="w-full md:w-auto"
                onClick={() => {
                  router.push(`/mentors/${mentor.id}`);
                }}
              >
                View Profile
              </Button>
            </div>
          </div>
        </CardHeader>

        {mentor.bio && (
          <CardContent className="border-t pt-4">
            <h3 className="font-medium mb-1">About</h3>
            <p className="text-sm text-muted-foreground">{mentor.bio}</p>
          </CardContent>
        )}
      </Card>

      {/* Booking Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Book a Session
          </CardTitle>
          <CardDescription>
            Select a date and time slot to book a session with {mentor.name}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Date Selection */}
          <div>
            <h3 className="text-sm font-medium mb-3">Select Date</h3>
            <Tabs
              value={format(selectedDate, "yyyy-MM-dd")}
              onValueChange={(value) => setSelectedDate(new Date(value))}
              className="w-full"
            >
              <TabsList className="grid grid-cols-7 h-auto">
                {next7Days.map((date, i) => (
                  <TabsTrigger
                    key={i}
                    value={format(date, "yyyy-MM-dd")}
                    className="flex flex-col py-2 h-auto"
                  >
                    <span className="text-xs font-normal opacity-80">
                      {format(date, "EEE")}
                    </span>
                    <span className="text-base font-medium">
                      {format(date, "d")}
                    </span>
                  </TabsTrigger>
                ))}
              </TabsList>

              {next7Days.map((date, i) => (
                <TabsContent
                  key={i}
                  value={format(date, "yyyy-MM-dd")}
                  className="mt-4"
                >
                  <div className="p-2 rounded-md bg-muted/50">
                    <p className="text-sm mb-3">
                      Available slots for {format(date, "MMMM d, yyyy")}:
                    </p>

                    {isLoading ? (
                      <div className="flex justify-center items-center h-32">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      </div>
                    ) : availableSlots.length > 0 ? (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                        {availableSlots
                          .sort(
                            (a: Slot, b: Slot) =>
                              convertTo24Hour(a.start) -
                              convertTo24Hour(b.start)
                          )
                          .map((slot) => (
                            <Button
                              key={slot.id}
                              variant={
                                selectedSlot?.id === slot.id
                                  ? "default"
                                  : "outline"
                              }
                              size="sm"
                              className={`flex items-center justify-center ${
                                slot.isBooked
                                  ? "opacity-50 cursor-not-allowed"
                                  : ""
                              }`}
                              disabled={slot.isBooked}
                              onClick={() => setSelectedSlot(slot)}
                            >
                              <Clock className="h-3 w-3 mr-1.5" />
                              <span>
                                {slot.start}-{slot.end}
                              </span>
                              {slot.isBooked && (
                                <Badge
                                  variant="outline"
                                  className="ml-1.5 text-[10px] py-0"
                                >
                                  Booked
                                </Badge>
                              )}
                            </Button>
                          ))}
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-32 bg-background rounded-md border border-dashed">
                        <div className="flex flex-col items-center text-center p-4">
                          <AlertCircle className="h-8 w-8 text-muted-foreground mb-2" />
                          <p className="text-sm text-muted-foreground">
                            No available slots for this date.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>

          {/* Selected Slot Summary */}
          {selectedSlot && (
            <div className="bg-primary/5 border border-primary/20 rounded-md p-4">
              <h3 className="text-sm font-medium mb-2">Selected Time Slot</h3>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-primary" />
                  <span>{format(selectedDate, "MMMM d, yyyy")}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-primary" />
                  <span>
                    {selectedSlot.start} - {selectedSlot.end}
                  </span>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t flex items-center justify-between">
                <div className="font-medium">
                  Session Fee:{" "}
                  <span className="font-bold">₹{mentor.hourlyRate}</span>
                </div>
                <Button
                  onClick={handleBookSession}
                  disabled={isBooking}
                  className="flex items-center"
                >
                  {isBooking ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Booking...
                    </>
                  ) : (
                    <>
                      Book Session
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

function convertTo24Hour(time: string): number {
  const match = time.match(/^(\d+)(am|pm)$/i);
  if (!match) return 0; // fallback if invalid format

  let [_, hourStr, period] = match;
  let hour = parseInt(hourStr, 10);

  if (period.toLowerCase() === "am") {
    if (hour === 12) hour = 0; // 12am -> 0
  } else {
    if (hour !== 12) hour += 12; // pm but not 12pm
  }

  return hour;
}
