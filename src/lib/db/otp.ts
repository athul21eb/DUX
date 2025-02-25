import { prisma } from "./database";

/// Create OTP
export const createOtp = async (email: string, token: string) => {
  try {
    const otp = await prisma.oTP.create({
      data: {
        email: email,
        token: token,
        expiresAt: new Date(Date.now() + 1000 * 60 * 15) // 15 minutes,

      }
    });
    return otp;
  } catch (error) {
    console.log(error);
    return null;
  }
}


// Get OTP by email
export const getOtpByEmail = async (email: string) => {
  try {
    const otp = await prisma.oTP.findFirst({
      where: {
        email: email
      },
      orderBy: {
        createdAt: 'desc' // Order by createdAt in descending order (most recent first)
      }
    });
    return otp;
  } catch (error) {
    console.log(error);
    return null;
  }
}

// Get OTP by token
export const getOtpByToken = async (token: string) => {
  try {
    const otp = await prisma.oTP.findFirst({
      where: {
        token: token
      }
    });
    return otp;
  } catch (error) {
    console.log(error);
    return null;
  }
}

// Delete OTP by ID
export const deleteOtp = async (id: number) => {
  try {
    await prisma.oTP.delete({
      where: {
        id: id
      }
    });
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

// Delete OTP by email (if needed)
export const deleteOtpByEmail = async (email: string) => {
  try {
    await prisma.oTP.deleteMany({
      where: {
        email: email
      }
    });
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}
