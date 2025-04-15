import { z } from "zod";

// Define form schema with Zod
export const ContactFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }).max(50, { message: "Name must be at most 50 characters" }),
  surname: z.string().min(2, { message: "Surname must be at least 2 characters" }).max(50, { message: "Surname must be at most 50 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  message: z.string().min(10, { message: "Message must be at least 10 characters" }).max(500, { message: "Message must be at most 500 characters" }),
})
// Type for form data
export type TContactFormInputType = z.infer<typeof ContactFormSchema>