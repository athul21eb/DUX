"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Clock, Plus, X } from "lucide-react";
import { motion } from "framer-motion";

// Define the time slot type
export type TimeSlot = {
  id: string;
  start: string;
  end: string;
  isBooked: boolean;
};

// Generate time slots from 9am to 10pm
const generateTimeSlots = (): TimeSlot[] => {
  const slots: TimeSlot[] = [];
  for (let hour = 9; hour < 22; hour++) {
    const startHour = hour;
    const endHour = hour + 1;

    const startTime = `${startHour % 12 || 12}${startHour < 12 ? "am" : "pm"}`;
    const endTime = `${endHour % 12 || 12}${endHour < 12 ? "am" : "pm"}`;

    slots.push({
      id: `slot-${startHour}-${endHour}`,
      start: startTime,
      end: endTime,
      isBooked: false,
    });
  }
  return slots;
};

const availableTimeSlots = generateTimeSlots();

interface TimeSlotSelectorProps {
  form: any;
  name: string;
}

export default function TimeSlotSelector({
  form,
  name,
}: TimeSlotSelectorProps) {
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);

  const handleAddSlot = () => {
    if (selectedSlot) {
      const currentSlots = form.getValues(name) || [];
      // Check if slot already exists
      if (!currentSlots.some((slot: TimeSlot) => slot.id === selectedSlot.id)) {
        form.setValue(name, [...currentSlots, selectedSlot], {
          shouldValidate: true,
        });
      }
      setSelectedSlot(null);
    }
  };

  const handleRemoveSlot = (slotId: string) => {
    const currentSlots = form.getValues(name) || [];
    form.setValue(
      name,
      currentSlots.filter((slot: TimeSlot) => slot.id !== slotId),
      { shouldValidate: true }
    );
  };

  const selectedSlots = form.watch(name) || [];

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="space-y-4">
          <FormLabel className="text-base">Available Time Slots</FormLabel>

          <div className="space-y-4">
            {/* Selected slots display */}
            <div className="bg-background/80 rounded-md border p-3">
              <h4 className="text-sm font-medium mb-2">
                Your Selected Time Slots:
              </h4>

              <div className="flex flex-wrap gap-2 min-h-10">
                {selectedSlots.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-1">
                    No time slots selected. Please select at least one slot.
                  </p>
                ) : (
                  selectedSlots
                    .sort(
                      (a: TimeSlot, b: TimeSlot) =>
                        convertTo24Hour(a.start) - convertTo24Hour(b.start)
                    )
                    .map((slot: TimeSlot) => (
                      <motion.div
                        key={slot.id}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-primary/10 flex items-center px-3 py-1 rounded-full"
                      >
                        <Clock className="h-3 w-3 mr-1" />
                        <span className="text-sm">
                          {slot.start}-{slot.end}
                        </span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-auto p-1 ml-1"
                          onClick={() => handleRemoveSlot(slot.id)}
                          aria-label={`Remove time slot ${slot.start}-${slot.end}`}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </motion.div>
                    ))
                )}
              </div>
            </div>

            {/* Time slot selection */}
            <Card className="border-primary/20">
              <CardContent className="p-3 sm:p-4">
                <div className="flex flex-col space-y-3">
                  <div className="text-sm font-medium">Add new time slots:</div>

                  {/* Time slot grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4  gap-2 max-h-48 overflow-y-auto p-1">
                    {availableTimeSlots.map((slot) => {
                      const isSelected = selectedSlot?.id === slot.id;
                      const isAlreadyAdded = selectedSlots.some(
                        (s: TimeSlot) => s.start === slot.start && s.end === slot.end
                      );


                      return (
                        <Button
                          key={slot.id}
                          type="button"
                          variant={isSelected ? "default" : "outline"}
                          size="sm"
                          className={`h-8 px-1 justify-start ${
                            isAlreadyAdded
                              ? "opacity-50 cursor-not-allowed"
                              : ""
                          }`}
                          onClick={() =>
                            !isAlreadyAdded && setSelectedSlot(slot)
                          }
                          disabled={isAlreadyAdded}
                        >
                          <Clock className="h-3 w-3 mr-1 flex-shrink-0" />
                          <span className="text-xs truncate">
                            {slot.start}-{slot.end}
                          </span>
                          {isAlreadyAdded && (
                            <Badge
                              variant="outline"
                              className="ml-auto text-[10px] py-0 px-1"
                            >
                              Added
                            </Badge>
                          )}
                        </Button>
                      );
                    })}
                  </div>

                  {/* Add button */}
                  <div className="flex justify-end mt-2">
                    <Button
                      type="button"
                      onClick={handleAddSlot}
                      disabled={!selectedSlot}
                      size="sm"
                      className="flex items-center gap-1"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Add Slot</span>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <FormMessage />
        </FormItem>
      )}
    />
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
