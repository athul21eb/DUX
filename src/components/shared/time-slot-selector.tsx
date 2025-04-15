"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Clock, Plus, X } from "lucide-react"
import { motion } from "framer-motion"

// Define the time slot type
export type TimeSlot = {
  id: string
  start: string
  end: string
}

// Generate time slots from 9am to 10pm
const generateTimeSlots = (): TimeSlot[] => {
  const slots: TimeSlot[] = []
  for (let hour = 9; hour < 22; hour++) {
    const startHour = hour
    const endHour = hour + 1

    const startTime = `${startHour % 12 || 12}${startHour < 12 ? "am" : "pm"}`
    const endTime = `${endHour % 12 || 12}${endHour < 12 ? "am" : "pm"}`

    slots.push({
      id: `slot-${startHour}-${endHour}`,
      start: startTime,
      end: endTime,
    })
  }
  return slots
}

const availableTimeSlots = generateTimeSlots()

interface TimeSlotSelectorProps {
  form: any
  name: string
}

export default function TimeSlotSelector({ form, name }: TimeSlotSelectorProps) {
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null)

  const handleAddSlot = () => {
    if (selectedSlot) {
      const currentSlots = form.getValues(name) || []
      // Check if slot already exists
      if (!currentSlots.some((slot: TimeSlot) => slot.id === selectedSlot.id)) {
        form.setValue(name, [...currentSlots, selectedSlot], { shouldValidate: true })
      }
      setSelectedSlot(null)
    }
  }

  const handleRemoveSlot = (slotId: string) => {
    const currentSlots = form.getValues(name) || []
    form.setValue(
      name,
      currentSlots.filter((slot: TimeSlot) => slot.id !== slotId),
      { shouldValidate: true },
    )
  }

  const selectedSlots = form.watch(name) || []

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="space-y-4">
          <FormLabel>Available Time Slots</FormLabel>

          <div className="grid grid-cols-1 gap-4">
            {/* Selected slots display */}
            <div className="flex flex-wrap gap-2 min-h-12 p-2 bg-background/80 rounded-md border">
              {selectedSlots.length === 0 ? (
                <p className="text-sm text-muted-foreground p-2">
                  No time slots selected. Please select at least one slot.
                </p>
              ) : (
                selectedSlots.map((slot: TimeSlot) => (
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
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </motion.div>
                ))
              )}
            </div>

            {/* Time slot selection */}
            <Card className="border-primary/20">
              <CardContent className="p-4">
                <div className="flex flex-col space-y-4">
                  <div className="text-sm font-medium">Select a time slot to add:</div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 max-h-48 overflow-y-auto">
                    {availableTimeSlots.map((slot) => {
                      const isSelected = selectedSlot?.id === slot.id
                      const isAlreadyAdded = selectedSlots.some((s: TimeSlot) => s.id === slot.id)

                      return (
                        <Button
                          key={slot.id}
                          type="button"
                          variant={isSelected ? "default" : "outline"}
                          size="sm"
                          className={`justify-start ${isAlreadyAdded ? "opacity-50 cursor-not-allowed" : ""}`}
                          onClick={() => !isAlreadyAdded && setSelectedSlot(slot)}
                          disabled={isAlreadyAdded}
                        >
                          <Clock className="h-3 w-3 mr-1" />
                          <span className="text-xs">
                            {slot.start}-{slot.end}
                          </span>
                          {isAlreadyAdded && (
                            <Badge variant="outline" className="ml-1 text-[10px] py-0">
                              Added
                            </Badge>
                          )}
                        </Button>
                      )
                    })}
                  </div>

                  <div className="flex justify-end">
                    <Button type="button" onClick={handleAddSlot} disabled={!selectedSlot} size="sm">
                      <Plus className="h-4 w-4 mr-1" /> Add Slot
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
  )
}

