// src/lib/actions/admin/mentorsApprovalsManagement/mentorsApprovalsManagementActions.ts

'use server';

import { prisma } from '@/lib/db/database';
import { revalidatePath } from 'next/cache';


export async function getMentorApprovalById(mentorId?: string) {
  if (!mentorId) {
    return {
      success: false,
      data: null,
      message: "Invalid mentor ID provided.",
    };
  }

  try {
    const mentor = await prisma.mentor.findUnique({
      where: { id: mentorId },
      include: {
        user: true,
        skills: { include: { skill: true } },
        experiences: true,
        educations: true,
      },
    });

    if (!mentor) {
      return {
        success: false,
        data: null,
        message: "Mentor not found or already verified.",
      };
    }

    return {
      success: true,
      data: {
        ...mentor,
        mentorName: mentor.user.name || "No Name",
        email: mentor.user.email,
        image:mentor.user.image || "",
        applicationDetails: mentor.aboutMe,
        skills: mentor.skills.map(ms => ms.skill.name),
      },
      message: "Successfully fetched mentor details.",
    };
  } catch (error: any) {
    console.error("Error fetching mentor details:", error);
    return {
      success: false,
      data: null,
      message: `Failed to fetch mentor details: ${error.message}`,
    };
  }
}


// Function to get all unverified mentors
export async function getAllMentorsApprovals(page: number = 1, pageSize: number = 10) {
  try {
    const skip = (page - 1) * pageSize;

    const [mentors, totalCount] = await Promise.all([
      prisma.mentor.findMany({
        where: {
          verified: false,
        },
        include: {
          user: true, // Include user details (name, email etc.)
          skills: {
            include: {
              skill: true, // Include skill details within the mentor's skills
            },
          },
          experiences: true,
          educations: true,
        },
        skip,
        take: pageSize,
        orderBy: {
          createdAt: 'desc', // Or any appropriate ordering
        },
      }),
      prisma.mentor.count({
        where: {
          verified: false,
        },
      }),
    ]);

    const totalPages = Math.ceil(totalCount / pageSize);

    const mentorsWithUserDetails = mentors.map(mentor => ({
      ...mentor,
      mentorName: mentor.user.name || 'No Name', // Access the user's name
      email: mentor.user.email,             // Access the user's email,
      applicationDetails: mentor.aboutMe,      //Assuming About me is like description here
      skills: mentor.skills.map(ms => ms.skill.name), // Extract skill names


    }));

    return {
      success: true,
      data: {
        mentorsApprovals: mentorsWithUserDetails as any, // Type casting
        totalPages,
        currentPage: page,
      },
      message: 'Successfully fetched unverified mentors.',
    };
  } catch (error: any) {
    console.error('Error fetching unverified mentors:', error);
    return {
      success: false,
      data: null,
      message: `Failed to fetch unverified mentors: ${error.message}`,
    };
  }
}

// Function to approve a mentor (set verified to true)
export async function approveMentor(mentorId: string) {
  try {
    const updatedMentor = await prisma.mentor.update({
      where: {
        id: mentorId,
      },
      data: {
        verified: true,
      },
    });

    const user = await prisma.user.update({
      where: {
        id:updatedMentor?.userId,
      },
      data:{
        role:"mentor"

      },
    });

    revalidatePath('/admin/approvals'); // Revalidate the page
    return {
      success: true,
      data: updatedMentor,
      message: 'Mentor approved successfully.',
    };
  } catch (error: any) {
    console.error('Error approving mentor:', error);
    return {
      success: false,
      data: null,
      message: `Failed to approve mentor: ${error.message}`,
    };
  }
}

// Function to reject a mentor (delete the mentor record)
export async function rejectMentor(mentorId: string) {
  try {
    const deletedMentor = await prisma.mentor.delete({
      where: {
        id: mentorId,
      },
    });

    revalidatePath('/admin/approvals'); // Revalidate the page
    return {
      success: true,
      data: deletedMentor,
      message: 'Mentor rejected successfully.',
    };
  } catch (error: any) {
    console.error('Error rejecting mentor:', error);
    return {
      success: false,
      data: null,
      message: `Failed to reject mentor: ${error.message}`,
    };
  }
}

// //Schema

// const skillSchema = z.object({
//   id: z.string().optional(),
//   name: z.string().min(1, "Skill name is required"),
//   description: z.string().min(1, "Description is required"),
// });


// export async function createSkill(data: any) {
//   try {
//     // Validate the data against the schema
//     const validatedData = skillSchema.parse(data);

//     // Create the skill in the prisma
//     const newSkill = await prisma.skill.create({
//       data: {
//         name: validatedData.name,
//         description: validatedData.description,
//       },
//     });

//     revalidatePath('/admin/skills-management'); // Revalidate the path
//     return {
//       success: true,
//       data: newSkill,
//       message: 'Skill created successfully.',
//     };
//   } catch (error: any) {
//     console.error('Error creating skill:', error);
//     return {
//       success: false,
//       data: null,
//       message: `Failed to create skill: ${error.message}`,
//     };
//   }
// }

// export async function updateSkill(data: any) {
//   try {
//     const validatedData = skillSchema.parse(data);

//     // Update the skill in the database
//     const updatedSkill = await db.skill.update({
//       where: {
//         id: validatedData.id, // Ensure you have the skill ID
//       },
//       data: {
//         name: validatedData.name,
//         description: validatedData.description,
//       },
//     });

//     revalidatePath('/admin/skills-management'); // Revalidate the path
//     return {
//       success: true,
//       data: updatedSkill,
//       message: 'Skill updated successfully.',
//     };
//   } catch (error: any) {
//     console.error('Error updating skill:', error);
//     return {
//       success: false,
//       data: null,
//       message: `Failed to update skill: ${error.message}`,
//     };
//   }
// }

// export async function deleteSkill(skillId: string) {
//   try {
//     // Delete the skill from the database
//     const deletedSkill = await db.skill.delete({
//       where: {
//         id: skillId, // Ensure you have the skill ID
//       },
//     });

//     revalidatePath('/admin/skills-management'); // Revalidate the path
//     return {
//       success: true,
//       data: deletedSkill,
//       message: 'Skill deleted successfully.',
//     };
//   } catch (error: any) {
//     console.error('Error deleting skill:', error);
//     return {
//       success: false,
//       data: null,
//       message: `Failed to delete skill: ${error.message}`,
//     };
//   }
// }