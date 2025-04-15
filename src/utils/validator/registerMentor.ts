import { z } from "zod";

export const RegisterMentorFormSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(50, "Name must be at most 50 characters"),
  email: z.string().trim().email("Please enter a valid email"),
  phone: z.string().trim().regex(/^\d{10}$/, "Phone number must be 10 digits"),

  dob: z.date({
    required_error: "Date of birth is required",
  }).refine((date) => {
    const today = new Date();
    const age = today.getFullYear() - date.getFullYear();
    return age >= 18;
  }, "You must be at least 18 years old"),

  gender: z.enum(["male", "female", "other", "prefer-not-to-say"], {
    required_error: "Please select a gender",
  }),

  hourlyRate: z
  .string()
  .trim()
  .min(1, "Hourly rate is required")
  .transform((val) => Number(val))
  .refine((val) => val >= 500, {
    message: "Hourly rate must be at least ₹500",
  }).transform(val=>String(val)),


  expertise: z.string().trim().min(2, "Please select your expertise"),

  skills: z
    .array(
      z.object({
        id: z.string().trim(),
        name: z.string().trim(),
        description: z.string().trim(),
      })
    )
    .min(1, "Please select at least one skill"),

  aboutMe: z.string().trim().min(10, "Please provide information about yourself"),

  experiences: z
    .array(
      z.object({
        role: z.string().trim().min(1, "Role is required"),
        company: z.string().trim().min(1, "Company is required"),
        startDate: z.date(),
        endDate: z.date().nullable(),
        description: z.string().trim(),
      })
    )
    .refine(
      (experiences) =>
        experiences.every(
          (exp) => !exp.endDate || exp.endDate >= exp.startDate
        ),
      "End date must be after start date"
    ),

  educations: z
    .array(
      z.object({
        degree: z.string().trim().min(1, "Degree is required"),
        institution: z.string().trim().min(1, "Institution is required"),
        startDate: z.date(),
        endDate: z.date().nullable(),
        description: z.string().trim(),
      })
    )
    .refine(
      (educations) =>
        educations.every(
          (edu) => !edu.endDate || edu.endDate >= edu.startDate
        ),
      "End date must be after start date"
    ),

  languages: z.array(z.string().trim()).min(1, "Please add at least one language"),
  timeSlots: z
      .array(
        z.object({
          id: z.string(),
          start: z.string(),
          end: z.string(),
        }),
      )
      .min(1, "Please select at least one time slot"),
});

export type RegisterMentorFormType = z.infer<typeof RegisterMentorFormSchema>;
