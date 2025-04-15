"use client"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface DatePickerProps {
  form: any
  name: string
  label: string
  isEndDate?: boolean
}

export function SimplifiedDatePicker({ form, name, label, isEndDate = false }: DatePickerProps) {
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
                  variant={"outline"}
                  className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                >
                  {field.value ? format(new Date(field.value), "PPP") : <span>Pick a date</span>}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={field.value ? new Date(field.value) : undefined}
                onSelect={field.onChange}
                disabled={(date) => {
                  if (isEndDate) {
                    // For end date, disable dates before start date
                    const startDatePath = name.replace("endDate", "startDate")
                    const startDate = form.getValues(startDatePath)
                    return startDate ? date < new Date(startDate) : false
                  }
                  return false
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

