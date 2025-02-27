
'use server'

import { z } from "zod";
import { prisma } from "@/lib/db/database";
import { uploadImage } from "@/utils/cloudinary/cloudinary";
import { RegisterMentorformSchema } from "@/utils/validator/registerMentor";
import { updateUser } from "@/lib/db/user";

export async function CreateMentorProfileAction(
  data: z.infer<typeof RegisterMentorformSchema>,
  profileImage: File | null,
  documents: File[]
): Promise<{ success: boolean; message: string; data?: any }> {
  try {
    // Validate the input data against the schema
    const validatedData = RegisterMentorformSchema.parse(data);

    // Ensure userId is defined
    if (!validatedData.userId) {
      throw new Error("User ID is required to create a mentor profile.");
    }

    // Upload profile image if provided
    let profileImageUrl: string | null = null;
    if (profileImage) {
      try {
        const uploadResult = await uploadImage(profileImage);
        if (uploadResult) {
          profileImageUrl = uploadResult;
        }
      } catch (error) {
        console.error("Error uploading profile image:", error);
        throw new Error("Failed to upload profile image.");
      }
    }

    // Upload documents if provided and filter out null values
    const documentUrls: string[] = [];
    for (const document of documents) {
      try {
        const url = await uploadImage(document);
        if (url) {
          documentUrls.push(url); // Only push valid URLs
        }
      } catch (error) {
        console.error("Error uploading document:", error);
        throw new Error("Failed to upload one or more documents.");
      }
    }

    // Create the mentor profile in the prisma
    const mentorProfile = await prisma.mentor.create({
      data: {
        userId: validatedData.userId, // userId is now guaranteed to be a string
        aboutMe: validatedData.aboutMe,
        languages: validatedData.languages,
        documents: documentUrls, // Ensure this is an array of strings
        skills: {
          create: validatedData.skills.map((skill) => ({
            skill: {
              connect: { id: skill.id },
            },
          })),
        },
        experiences: {
          create: validatedData.experiences.map((exp) => ({
            role: exp.role,
            company: exp.company,
            startDate: exp.startDate,
            endDate: exp.endDate || null, // Ensure endDate is either a Date or null
            description: exp.description,
          })),
        },
        educations: {
          create: validatedData.educations.map((edu) => ({
            degree: edu.degree,
            institution: edu.institution,
            startDate: edu.startDate,
            endDate: edu.endDate || null, // Ensure endDate is either a Date or null
            description: edu.description,
          })),
        },
      },
    });


   await updateUser(validatedData.userId, {
    name:validatedData.name,
    phone:validatedData.phone,
    image:profileImageUrl ?? undefined

       });



    // Return success response
    return {
      success: true,
      message: "Mentor profile created successfully!",
      data: mentorProfile,
    };


  } catch (error) {
    console.error("Error creating mentor profile:", error);

    // Return error response
    return {
      success: false,
      message: error instanceof Error ? error.message : "An error occurred while creating the mentor profile.",
    };
  }
}