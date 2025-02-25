"use server";

import { skillService } from "@/lib/db/skills";
import { Skill } from "@/types/skills";
import { skillSchema } from "@/utils/validator/skillform";
import { revalidatePath } from "next/cache";

// Define response types
type SuccessResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

type ErrorResponse = {
  success: false;
  message: string;
};

// Define Paginated Response
type PaginatedSkillsResponse = SuccessResponse<{
  skills: Skill[];
  totalPages: number;
  currentPage: number;
  totalCount: number;
}>;

// ✅ Get all skills with pagination
export async function getAllSkills(
  page: number = 1,
  limit: number = 10
): Promise<PaginatedSkillsResponse | ErrorResponse> {
  try {
    const skip = (page - 1) * limit;

    const [skills, totalCount] = await Promise.all([
      skillService.getSkillsWithPagination(skip, limit),
      skillService.getTotalSkillCount(),
    ]);

    if (!skills) throw new Error("Failed to fetch skills");

    return {
      success: true,
      message: "Skills fetched successfully",
      data: {
        skills,
        totalPages: Math.ceil(totalCount / limit),
        currentPage: page,
        totalCount,
      },
    };
  } catch (error) {
    console.error("Error fetching skills:", error);
    return { success: false, message: "Failed to fetch skills" };
  }
}

// ✅ Create a new skill
export async function createSkill(
  formData: Skill
): Promise<SuccessResponse<Skill> | ErrorResponse> {
  try {
    const validatedData = skillSchema.parse(formData);

    if (!validatedData) return { success: false, message: "Invalid input data" };

    const { name, description } = validatedData;

    if (!name) return { success: false, message: "Skill name is required" };

    const skill = await skillService.createSkill(name, description);
    if (!skill) return { success: false, message: "Failed to create skill" };
    revalidatePath("/admin/skills");
    return { success: true, message: "Skill created successfully", data: skill };
  } catch (error) {
    console.error("Error creating skill:", error);
    return { success: false, message: "Failed to create skill" };
  }
}

// ✅ Update an existing skill
export async function updateSkill(
  formData: Skill
): Promise<SuccessResponse<Skill> | ErrorResponse> {
  try {
    const validatedData = skillSchema.parse(formData);

    if (!validatedData) return { success: false, message: "Invalid input data" };

    const { id, name, description } = validatedData;

    if (!id) return { success: false, message: "Skill ID is required" };

    const updatedSkill = await skillService.updateSkill(id, name, description);
    if (!updatedSkill) return { success: false, message: "Failed to update skill" };

    revalidatePath("/admin/skills");
    
    return { success: true, message: "Skill updated successfully", data: updatedSkill };
  } catch (error) {
    console.error("Error updating skill:", error);
    return { success: false, message: "Failed to update skill" };
  }
}

// ✅ Delete a skill
export async function deleteSkill(
  id: string
): Promise<SuccessResponse<Skill> | ErrorResponse> {
  try {
    if (!id) return { success: false, message: "Skill ID is required" };

    const deletedSkill = await skillService.deleteSkill(id);
    if (!deletedSkill) return { success: false, message: "Failed to delete skill" };
    revalidatePath("/admin/skills");
    return { success: true, message: "Skill deleted successfully", data: deletedSkill };
  } catch (error) {
    console.error("Error deleting skill:", error);
    return { success: false, message: "Failed to delete skill" };
  }
}
