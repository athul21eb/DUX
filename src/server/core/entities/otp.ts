export interface Otp {
  id?: number;
  email: string;
  token: string;
  expiresAt: Date;
  createdAt?: Date;
}