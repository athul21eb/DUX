import { z } from "zod";

export const UserSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(50, "Name must be less than 50 characters")
    .regex(/^[A-Za-z\s]+$/, "Name can only contain letters and spaces"),

  email: z
    .string()
    .email("Invalid email address")
    .min(5, "Email must be at least 5 characters")
    .max(100, "Email must be less than 100 characters"),

    phone: z
    .string()
    .optional()
    .refine(
      (value) => !value || /^[0-9]{10}$/.test(value),
      "Phone number must be exactly 10 digits"
    ),


  gender: z.enum(["male", "female", "other", "prefer-not-to-say"]).optional(),

  dob: z
    .union([z.date(), z.string().transform((str) => new Date(str))])
    .optional()
    .refine(
      (date) => !date || (date instanceof Date && date < new Date()),
      "Date of birth cannot be in the future"
    )
    .refine(
      (date) => !date || (date instanceof Date && date > new Date("1900-01-01")),
      "Date of birth must be after 1900"
    )
    .refine(
      (date) =>
        !date ||
        (date instanceof Date &&
          new Date().getFullYear() - date.getFullYear() >= 13),
      "You must be at least 13 years old"
    ),

    image: z
  .string()
  .optional()
  .refine(
    (url) =>
      !url ||
      /^(https?:\/\/.*\.(png|jpe?g|gif|webp))$/i.test(url) ||
      /^https:\/\/lh3\.googleusercontent\.com\//.test(url),
    {
      message: "Image URL must be a valid link (jpg, jpeg, png, gif, webp) or a Google profile image.",
    }
  ),

});

export type UserFormValues = z.infer<typeof UserSchema>;
