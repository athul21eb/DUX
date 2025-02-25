
export interface IUser {
  id: string;
  name?: string | null;  // Allow null
  email: string;
  emailVerified?: Date | null;  // Allow null
  googleId?: string | null;  // Allow null
  isBlocked: boolean;
  password?: string | null;  // Allow null
  image?: string | null;  // Allow null
  dob?: Date | null;  // Allow null
  gender?: string | null;  // Allow null
  phone?: string | null;  // Allow null
  role: Roles;
  createdAt: Date;
  updatedAt: Date;
}



export type Roles = "user" | "mentor" | "admin"