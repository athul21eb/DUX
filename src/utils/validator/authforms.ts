import { z } from "zod";

////------------------------------------RegisterSchema----------------------------------
export const SignUpFormSchema = z
  .object({
    email: z.string().trim().email({ message: "Please enter a valid email" }),
    password: z
      .string()
      .trim()
      .min(6, { message: "Password must be at least 6 characters long" })
      .regex(/[A-Z]/, {
        message: "Password must contain at least one uppercase letter",
      })
      .regex(/[^A-Za-z0-9]/, {
        message: "Password must contain at least one special character",
      })
      .regex(/^\S*$/, { message: "Password must not contain spaces" }), // No spaces allowed
    confirmPassword: z.string().trim(),
    name: z
      .string()
      .trim()
      .nonempty({ message: "Name cannot be empty" })
      .min(2, { message: "Name must be at least 2 characters long" })
      .regex(/^[A-Za-z\s]+$/, {
        message: "Name cannot contain numbers or special characters",
      }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type TSignUpFormInputType = z.infer<typeof SignUpFormSchema>

  ////------------------------------------LoginSchema----------------------------------

export const LoginSchema = z.object({
  email: z.string().trim().email({ message: "Please enter a valid email" }),
  password: z
  .string()
  .trim()
  .min(6, { message: "Password must be at least 6 characters long" })
  .regex(/[A-Z]/, {
    message: "Password must contain at least one uppercase letter",
  })
  .regex(/[^A-Za-z0-9]/, {
    message: "Password must contain at least one special character",
  })
  .regex(/^\S*$/, { message: "Password must not contain spaces" }), // No spaces allowed
});
export type TLoginFormInputType = z.infer<typeof LoginSchema>

//// ------------------ForgotPasswordSchema
export const ForgotPasswordSchema = z.object({
  email: z.string().email("Invalid email").nonempty("Email is required"),
  otp: z.optional(z.string().length(6, "OTP must be 6 digits")), // Optional initially
});
export type TForgotPasswordFormType = z.infer<typeof ForgotPasswordSchema>

////--------------------------changPasswordSchema
export const changePasswordSchema = z
  .object({
    newPassword: z
      .string()
      .trim()
      .min(6, { message: "Password must be at least 6 characters long" })
      .regex(/[A-Z]/, {
        message: "Password must contain at least one uppercase letter",
      })
      .regex(/[^A-Za-z0-9]/, {
        message: "Password must contain at least one special character",
      })
      .regex(/^\S*$/, { message: "Password must not contain spaces" }), // No spaces allowed
    confirmPassword: z.string().trim(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  });
  export type TChangePasswordType = z.infer<typeof changePasswordSchema>