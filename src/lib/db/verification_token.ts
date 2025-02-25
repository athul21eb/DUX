import { VerificationToken } from "@prisma/client";
import { prisma } from "./database";




export const createVerificationToken = async (
  email: string,
  token: string,
  expires: Date
): Promise<VerificationToken | null> => {
  try {
    const verificationToken = await prisma.verificationToken.create({
      data: {
        email,
        token,
        expires,
      },
    });

    return verificationToken;
  } catch (error) {
    console.error("Error creating verification token:", error);
    return null;
  }
};



export const getVerificationTokenByEmail = async (email: string) => {
  try {
    const verificationToken = await prisma.verificationToken.findFirst({
        where: {
            email: email
        }
    })

    return verificationToken;
  } catch (error) {
    console.log(error);
    return null;
  }

}

export const getVerificationTokenByToken = async (token: string) => {
  try {
    const verificationToken = await prisma.verificationToken.findFirst({
        where: {
            token: token
        }
    })

    return verificationToken;
  } catch (error) {
    console.log(error);
    return null;
  }

}

//delete verification token
export const deleteVerificationToken = async (id: string) => {
  try {
    await prisma.verificationToken.delete({
        where: {
            id: id
        }
    })
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }

}