import { z } from "zod";


// Define the form schema
export const SlotFormSchema = z.object({
  timeSlots: z
    .array(
      z.object({
        id: z.string(),
        start: z.string(),
        end: z.string(),
        isBooked: z.boolean()
      })
    )
    .min(1, "Please select at least one time slot"),
});

export type SlotFormValues = z.infer<typeof SlotFormSchema>;