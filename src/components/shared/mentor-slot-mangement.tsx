"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { addDays, format, isBefore, startOfTomorrow } from "date-fns";
import { CalendarIcon, Save, Loader2 } from "lucide-react";
import TimeSlotSelector from "./time-slot-selector";
import { toast } from "react-hot-toast";
import { Fetch_TimeSlots_By_Date_Server_Action } from "@/server/actions/mentor/timeSlotManagement/fetch-timeSlots-by-date.server-action";
import { update_TimeSlots_By_Date_Server_Action } from "@/server/actions/mentor/timeSlotManagement/update-timeSlots-by-date.server-action";
import { SlotFormSchema, SlotFormValues } from "@/utils/validator/slotforms";

// Define the time slot type
type TimeSlot = {
  id: string;
  start: string;
  end: string;
  isBooked: boolean;
};

export default function SlotManagement({
  defaultTimeSlots = [],
  id,
}: {
  defaultTimeSlots: TimeSlot[];
  id: string;
}) {
  const tomorrow = startOfTomorrow();
  const [date, setDate] = useState<Date>(tomorrow);
  const [isLoading, setIsLoading] = useState(false);
  const [dateBooked, setDateBooked] = useState(false);
  const [defaultSlots, setDefaultSlots] =
    useState<TimeSlot[]>(defaultTimeSlots);

  // Initialize form
  const form = useForm<SlotFormValues>({
    resolver: zodResolver(SlotFormSchema),
    defaultValues: {
      timeSlots: defaultTimeSlots,
    },
  });

  // Fetch time slots when date changes
  useEffect(() => {
    const loadTimeSlots = async () => {
      setIsLoading(true);
      try {
        const formattedDate = format(date, "yyyy-MM-dd");
        const response = await Fetch_TimeSlots_By_Date_Server_Action(
          id,
          formattedDate
        );

        if (response.success && response.data) {
          form.setValue("timeSlots", response.data);
          const anyBooked = response.data.some(
            (slot: TimeSlot) => slot.isBooked
          );
          setDateBooked(anyBooked);
          console.log("Any booked slots:", anyBooked);
        } else {
          // If no slots are found, use default slots
          form.setValue("timeSlots", defaultSlots);
        }
      } catch (error) {
        console.error("Error loading time slots:", error);
        toast.error("Failed to load time slots");
        // Fall back to default slots on error
        form.setValue("timeSlots", defaultSlots);
      } finally {
        setIsLoading(false);
      }
    };

    loadTimeSlots();
  }, [date, form, defaultSlots]);

  // Handle form submission
  const onSubmit = async (values: SlotFormValues) => {

    if (dateBooked) {
      toast.error("This date is already booked");
      return; // <- Add this
    }
    setIsLoading(true);
    try {
      const formattedDate = format(date, "yyyy-MM-dd");
      const timeSlots = values.timeSlots.map((slot) => ({
        mentorId: id,
        date: new Date(formattedDate).toISOString(),
        start: slot.start,
        end: slot.end,
        isBooked: slot.isBooked,

      }));
      const response = await update_TimeSlots_By_Date_Server_Action(
        id,
        formattedDate,
        timeSlots
      );

      console.log(response);
      if (response.success) {
        toast.success("Time slots updated successfully");
      } else {
        toast.error(response.message || "Failed to update time slots");
      }
    } catch (error) {
      console.error("Error updating time slots:", error);
      toast.error("Failed to update time slots");
    } finally {
      setIsLoading(false);
    }
  };

  // Reset to default slots
  const resetToDefault = () => {
    form.setValue("timeSlots", defaultSlots, { shouldValidate: true });
    toast.success("Reset to default time slots");
  };

  // Function to disable dates before tomorrow
  const disabledDays = (date: Date) => {
    return isBefore(date, tomorrow);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Select Date</span>
              <div className="flex items-center space-x-2">
                <CalendarIcon className="h-4 w-4" />
                <span className="text-sm md:text-base">
                  {format(date, "PPP")}
                </span>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(newDate) => newDate && setDate(newDate)}
              disabled={disabledDays}
              className="rounded-md border"
            />
          </CardContent>
        </Card>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="md:col-span-1"
          >
            <Card className="h-full flex flex-col">
              <CardHeader>
                <CardTitle>Manage Time Slots</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow flex flex-col">
                <div className="flex-grow overflow-auto">
                  {isLoading ? (
                    <div className="flex justify-center items-center h-40">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : (
                    <TimeSlotSelector form={form} name="timeSlots" />
                  )}
                </div>

                <div className="flex flex-col sm:flex-row justify-between gap-3 mt-6">
                  {/* <Button
                    type="button"
                    variant="outline"
                    onClick={resetToDefault}
                    disabled={isLoading || defaultSlots.length === 0}
                    className="w-full sm:w-auto"
                  >
                    Reset to Default
                  </Button> */}
                  <Button
                    type="submit"
                    disabled={isLoading || !form.formState.isValid}
                    className="w-full sm:w-auto"
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Saving...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Save className="h-4 w-4" />
                        Save Changes
                      </span>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </form>
        </Form>
      </div>
    </div>
  );
}
