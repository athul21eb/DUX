'use client'

import { useState } from "react";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "./form";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Button } from "./button";
import { format, setYear, startOfYear } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "./calendar";

// Reusable Date Picker Component
interface DatePickerProps {
  name: string;
  label: string;
  form: any;
  isEndDate?: boolean;
}

export function DatePickerWithYear({ name, label, form, isEndDate }: DatePickerProps) {
  const isPresent = name.includes("endDate");

  const [year, setYearState] = useState(2000);
  const [month, setMonth] = useState(new Date(2000, 0, 1)); // January 1, 2000


  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>{label}</FormLabel>
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  className={`pl-3 text-left font-normal ${!field.value && "text-muted-foreground"}`}
                >
                  {field.value ? format(field.value, "PPP") : <span>{isPresent ? "Present" : "Pick a date"}</span>}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 min-h-[400px]" align="start">
              <div className="flex justify-between items-center p-2 border-b">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    const newYear = year - 1;
                    setYearState(newYear);
                    setMonth(startOfYear(setYear(new Date(), newYear)));
                  }}
                >
                  ← {year - 1}
                </Button>
                <span className="font-medium">{year}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    const newYear = year + 1;
                    setYearState(newYear);
                    setMonth(startOfYear(setYear(new Date(), newYear)));
                  }}
                >
                  {year + 1} →
                </Button>
              </div>
              <div className="flex items-center justify-center">
                <Calendar
                  mode="single"
                  selected={field.value || undefined}
                  onSelect={field.onChange}
                  disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                  initialFocus
                  month={month}
                  onMonthChange={setMonth}
                />
              </div>
            </PopoverContent>
          </Popover>
          {isEndDate && <p className="text-sm text-muted-foreground">Leave empty for current position</p>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
